<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import Section from '../../../components/atoms/Section.svelte';
  import Button from '../../../components/atoms/Button.svelte';
  import Divider from '../../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../../components/atoms/ChineseIcon.svelte';
  import type { UserSummary } from '$lib/types/user';

  // Filter state
  let searchQuery = '';
  let roleFilter = 'all';
  let statusFilter: 'all' | 'active' | 'inactive' = 'all';

  // UI state
  let isDeleteModalOpen = false;
  let userToDelete: string | null = null;
  let isLoading = true;
  let error: string | null = null;
  let deleteError = '';

  // User data
  let users: UserSummary[] = [];

  // New user modal state
  let isUserModalOpen = false;
  let editingUser: UserSummary | null = null;
  let userForm = {
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent',
    isActive: true,
  };
  let formErrors: Record<string, string> = {};

  // Available user roles
  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'agent', label: 'Travel Agent' },
    { value: 'guide', label: 'Tour Guide' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Customer Support' },
  ];

  // Load users from API
  async function loadUsers() {
    isLoading = true;
    error = null;

    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      users = await response.json();
    } catch (err) {
      console.error('Failed to load users:', err);
      error = err instanceof Error ? err.message : 'Failed to load users';
    } finally {
      isLoading = false;
    }
  }

  // Called on component mount
  onMount(() => {
    loadUsers();
  });

  // Filter users based on search and filters
  $: filteredUsers = users.filter(user => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open delete confirmation modal
  function confirmDelete(userId: string) {
    userToDelete = userId;
    isDeleteModalOpen = true;
  }

  // Close delete modal
  function cancelDelete() {
    isDeleteModalOpen = false;
    userToDelete = null;
    deleteError = '';
  }

  // Execute user deletion
  async function deleteUser() {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed with status: ${response.status}`);
      }

      // Refresh the user list
      await loadUsers();
      cancelDelete();
    } catch (err) {
      console.error('Failed to delete user:', err);
      deleteError = err instanceof Error ? err.message : 'Failed to delete user';
    }
  }

  // Toggle user active status
  async function toggleUserStatus(user: UserSummary) {
    if (!user._id) return;

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed with status: ${response.status}`);
      }

      // Refresh the user list
      await loadUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
      error = err instanceof Error ? err.message : 'Failed to update user status';
    }
  }

  // Open user modal for creating a new user
  function openNewUserModal() {
    editingUser = null;
    userForm = {
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'agent',
      isActive: true,
    };
    formErrors = {};
    isUserModalOpen = true;
  }

  // Open user modal for editing an existing user
  function openEditUserModal(user: UserSummary) {
    editingUser = user;
    userForm = {
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      isActive: user.isActive,
    };
    formErrors = {};
    isUserModalOpen = true;
  }

  // Close user modal
  function closeUserModal() {
    isUserModalOpen = false;
  }

  // Validate user form
  function validateUserForm(): boolean {
    formErrors = {};

    if (!userForm.username) {
      formErrors.username = 'Username is required';
    } else if (userForm.username.length < 3) {
      formErrors.username = 'Username must be at least 3 characters';
    }

    if (!userForm.name) {
      formErrors.name = 'Name is required';
    }

    if (!userForm.email) {
      formErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(userForm.email)) {
      formErrors.email = 'Email is invalid';
    }

    // Only validate password if creating new user or changing password
    if (!editingUser || userForm.password) {
      if (!editingUser && !userForm.password) {
        formErrors.password = 'Password is required';
      } else if (userForm.password && userForm.password.length < 6) {
        formErrors.password = 'Password must be at least 6 characters';
      }

      if (userForm.password !== userForm.confirmPassword) {
        formErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return Object.keys(formErrors).length === 0;
  }

  // Save user (create or update)
  async function saveUser() {
    if (!validateUserForm()) {
      return;
    }

    try {
      let response;

      if (editingUser && editingUser._id) {
        // Update existing user
        response = await fetch(`/api/users/${editingUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userForm.username,
            name: userForm.name,
            email: userForm.email,
            password: userForm.password || undefined,
            role: userForm.role,
            isActive: userForm.isActive,
          }),
        });
      } else {
        // Create new user
        response = await fetch('/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userForm.username,
            name: userForm.name,
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            isActive: userForm.isActive,
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed with status: ${response.status}`);
      }

      // Refresh the user list and close the modal
      await loadUsers();
      closeUserModal();
    } catch (err) {
      console.error('Error saving user:', err);
      formErrors.general = err instanceof Error ? err.message : 'Failed to save user';
    }
  }

  // Format date for display
  function formatDate(date: Date | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Manage Users | Agent Dashboard</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<Section variant="light" spacing="md">
  <svelte:fragment slot="header">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h1 class="text-3xl font-heading font-bold">Manage Users</h1>
      <Button on:click={openNewUserModal} variant="primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add New User
      </Button>
    </div>
    <Divider type="simple" />
  </svelte:fragment>

  <!-- Filters and Search -->
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-200">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-grow">
        <label for="search" class="sr-only">Search Users</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            id="search"
            type="text"
            placeholder="Search by name, username or email"
            class="input pl-10 w-full"
            bind:value={searchQuery}
          />
        </div>
      </div>

      <div class="flex-shrink-0 w-full md:w-48">
        <label for="role" class="sr-only">Filter by role</label>
        <select id="role" class="input w-full" bind:value={roleFilter}>
          <option value="all">All Roles</option>
          {#each roleOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <div class="flex-shrink-0 w-full md:w-48">
        <label for="status" class="sr-only">Filter by status</label>
        <select id="status" class="input w-full" bind:value={statusFilter}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Users List -->
  {#if isLoading}
    <div class="bg-white rounded-lg shadow-sm p-8 border border-neutral-200 text-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-neutral-200 h-16 w-16 mb-4"></div>
        <div class="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
        <div class="h-3 bg-neutral-200 rounded w-1/3"></div>
      </div>
    </div>
  {:else if filteredUsers.length === 0}
    <div class="bg-white rounded-lg shadow-sm p-8 border border-neutral-200 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-neutral-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h2 class="text-xl font-heading font-bold mb-2">No Users Found</h2>
      <p class="text-neutral-600 mb-4">
        {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
          ? 'Try adjusting your search or filter criteria.'
          : 'There are no users available. Add your first user to get started.'}
      </p>
      <Button on:click={openNewUserModal} variant="primary">Add New User</Button>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200">
          <thead class="bg-neutral-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-neutral-200">
            {#each filteredUsers as user (user._id)}
              <tr class="hover:bg-neutral-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium"
                      >
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-neutral-900">{user.name}</div>
                      <div class="text-sm text-neutral-500">
                        <span class="mr-2">{user.username}</span>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    {#each roleOptions as option}
                      {#if option.value === user.role}
                        {option.label}
                      {/if}
                    {/each}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-neutral-100 text-neutral-800'}"
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatDate(user.lastLogin)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <button
                      class="text-secondary-dark hover:text-secondary"
                      on:click={() => toggleUserStatus(user)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      class="text-primary-dark hover:text-primary"
                      on:click={() => openEditUserModal(user)}
                    >
                      Edit
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800"
                      on:click={() => user._id && confirmDelete(user._id.toString())}
                      disabled={user.username === 'admin'}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</Section>

<!-- Delete Confirmation Modal -->
{#if isDeleteModalOpen}
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-neutral-900" id="modal-title">
                Delete User
              </h3>
              <div class="mt-2">
                <p class="text-sm text-neutral-500">
                  Are you sure you want to delete this user? This action cannot be undone and the
                  user will lose all access to the system.
                </p>
                {#if deleteError}
                  <p class="mt-2 text-sm text-red-600">{deleteError}</p>
                {/if}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            on:click={deleteUser}
          >
            Delete
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={cancelDelete}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- User Modal (Add/Edit) -->
{#if isUserModalOpen}
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form on:submit|preventDefault={saveUser}>
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div class="mb-4">
              <h3 class="text-lg leading-6 font-medium text-neutral-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <p class="mt-1 text-sm text-neutral-500">
                {editingUser
                  ? 'Update user information and permissions.'
                  : 'Create a new user account with appropriate permissions.'}
              </p>
            </div>

            {#if formErrors.general}
              <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-sm text-red-700">{formErrors.general}</p>
              </div>
            {/if}

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="username" class="form-label">Username*</label>
                  <input
                    type="text"
                    id="username"
                    bind:value={userForm.username}
                    class="input w-full"
                    placeholder="e.g. jsmith"
                  />
                  {#if formErrors.username}
                    <p class="text-sm text-red-600 mt-1">{formErrors.username}</p>
                  {/if}
                </div>

                <div class="form-group">
                  <label for="name" class="form-label">Full Name*</label>
                  <input
                    type="text"
                    id="name"
                    bind:value={userForm.name}
                    class="input w-full"
                    placeholder="e.g. John Smith"
                  />
                  {#if formErrors.name}
                    <p class="text-sm text-red-600 mt-1">{formErrors.name}</p>
                  {/if}
                </div>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  bind:value={userForm.email}
                  class="input w-full"
                  placeholder="e.g. john.smith@example.com"
                />
                {#if formErrors.email}
                  <p class="text-sm text-red-600 mt-1">{formErrors.email}</p>
                {/if}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="password" class="form-label">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password*'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    bind:value={userForm.password}
                    class="input w-full"
                    placeholder="••••••••"
                  />
                  {#if formErrors.password}
                    <p class="text-sm text-red-600 mt-1">{formErrors.password}</p>
                  {/if}
                </div>

                <div class="form-group">
                  <label for="confirm-password" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    bind:value={userForm.confirmPassword}
                    class="input w-full"
                    placeholder="••••••••"
                  />
                  {#if formErrors.confirmPassword}
                    <p class="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                  {/if}
                </div>
              </div>

              <div class="form-group">
                <label for="role" class="form-label">User Role*</label>
                <select id="role" class="input w-full" bind:value={userForm.role}>
                  {#each roleOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <div class="form-group">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    bind:checked={userForm.isActive}
                    class="rounded text-primary focus:ring-primary h-5 w-5"
                  />
                  <span class="ml-2">Active Account</span>
                </label>
                <p class="text-sm text-neutral-500 mt-1">
                  Inactive accounts cannot login to the system.
                </p>
              </div>
            </div>
          </div>

          <div class="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              on:click={closeUserModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
