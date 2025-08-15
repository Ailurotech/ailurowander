<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../../components/atoms/Section.svelte';
  import Button from '../../../components/atoms/Button.svelte';
  import Divider from '../../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../../components/atoms/ChineseIcon.svelte';
  import { onMount } from 'svelte';

  // Define a type for the icon
  type ChineseIconType =
    | 'great-wall'
    | 'forbidden-city'
    | 'terracotta'
    | 'temple'
    | 'pagoda'
    | 'dragon'
    | 'panda'
    | 'lantern'
    | 'bamboo'
    | 'mountains';

  // Define tour interface
  interface Tour {
    _id: string;
    id?: number; // For compatibility with existing code
    title: string;
    description: string;
    image: string;
    duration: string;
    price: number;
    destination: string;
    location?: string; // For compatibility
    isActive?: boolean;
    featured?: boolean;
    iconType?: ChineseIconType;
  }

  // Initialize empty tours array
  let tours: Tour[] = [];

  // Filter state
  let searchQuery = '';
  let statusFilter: 'all' | 'active' | 'inactive' = 'all';

  // UI state
  let isDeleteModalOpen = false;
  let tourToDelete: string | null = null;
  let isLoading = true;
  let loadError = '';
  let deleteError = '';

  // Fetch tours from API
  async function loadTours() {
    isLoading = true;
    loadError = '';

    try {
      console.log('Fetching tours from API...');
      const response = await fetch('/api/tours');

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const apiTours = await response.json();
      console.log(`Received ${apiTours.length} tours from API`);

      // Transform API tours to our local format
      tours = apiTours.map((tour: any) => ({
        _id: tour._id,
        id: tour._id, // Use _id for compatibility with existing code
        title: tour.title,
        description: tour.description,
        image: tour.image || '/images/placeholder.jpg',
        duration: tour.duration || '0 days',
        price: typeof tour.price === 'number' ? tour.price : 0,
        location: tour.destination, // Use destination as location
        destination: tour.destination,
        isActive: tour.isActive !== undefined ? tour.isActive : true,
        featured: tour.featured,
        iconType: determineIconType(tour.destination), // Assign icon based on destination
      }));

      console.log('Transformed tours data:', tours);
    } catch (error) {
      console.error('Error loading tours:', error);
      loadError = error instanceof Error ? error.message : 'Failed to load tours';
      tours = [];
    } finally {
      isLoading = false;
    }
  }

  // Determine icon type based on destination
  function determineIconType(destination?: string): ChineseIconType {
    if (!destination) return 'pagoda' as ChineseIconType;

    const dest = destination.toLowerCase();
    if (dest.includes('beijing')) return 'great-wall' as ChineseIconType;
    if (dest.includes('shanghai')) return 'forbidden-city' as ChineseIconType;
    if (dest.includes('xian')) return 'terracotta' as ChineseIconType;
    if (dest.includes('river') || dest.includes('gorge')) return 'mountains' as ChineseIconType;
    if (dest.includes('chengdu')) return 'panda' as ChineseIconType;
    if (dest.includes('temple')) return 'temple' as ChineseIconType;

    // Default icons
    const icons: ChineseIconType[] = ['pagoda', 'lantern', 'bamboo', 'dragon'];
    return icons[Math.floor(Math.random() * icons.length)] as ChineseIconType;
  }

  // Load tours on component mount
  onMount(() => {
    loadTours();
  });

  // Filter tours based on search and status
  $: filteredTours = tours.filter(tour => {
    const matchesSearch =
      searchQuery === '' ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tour.location || tour.destination || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && tour.isActive) ||
      (statusFilter === 'inactive' && !tour.isActive);

    return matchesSearch && matchesStatus;
  });

  // Open delete confirmation modal
  function confirmDelete(tourId: string) {
    tourToDelete = tourId;
    isDeleteModalOpen = true;
  }

  // Close delete modal
  function cancelDelete() {
    isDeleteModalOpen = false;
    tourToDelete = null;
    deleteError = '';
  }

  // Execute tour deletion
  async function deleteTour() {
    if (!tourToDelete) return;

    try {
      // In a real app, you would call an API here
      const response = await fetch(`/api/tours/${tourToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete tour: ${response.status}`);
      }

      // Remove from local array
      tours = tours.filter(tour => tour._id !== tourToDelete);
      cancelDelete();
    } catch (error) {
      console.error('Error deleting tour:', error);
      deleteError =
        error instanceof Error ? error.message : 'Failed to delete tour. Please try again.';
    }
  }

  // Toggle tour active status
  async function toggleTourStatus(tourId: string) {
    const tour = tours.find(t => t._id === tourId);
    if (!tour) return;

    try {
      const newStatus = !tour.isActive;

      // Update on server
      const response = await fetch(`/api/tours`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tourId,
          isActive: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tour status: ${response.status}`);
      }

      // Update locally
      tours = tours.map(t => {
        if (t._id === tourId) {
          return { ...t, isActive: newStatus };
        }
        return t;
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      // Could show an error message here
    }
  }

  // Refresh tours list
  function refreshTours() {
    loadTours();
  }
</script>

<svelte:head>
  <title>{$t('agent.tours.title')} | {$t('site.title')}</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<Section variant="light" spacing="md">
  <svelte:fragment slot="header">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h1 class="text-3xl font-heading font-bold">{$t('agent.tours.title')}</h1>
      <div class="flex gap-2">
        <Button on:click={refreshTours} variant="secondary">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {$t('agent.tours.management.refresh')}
        </Button>
        <Button href="/agent/tours/add" variant="primary">
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
          {$t('agent.tours.add_new')}
        </Button>
      </div>
    </div>
    <Divider type="simple" />
  </svelte:fragment>

  <!-- Filters and Search -->
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-200">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-grow">
        <label for="search" class="sr-only">Search Tours</label>
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
            placeholder={$t('agent.tours.management.search_placeholder')}
            class="input pl-10 w-full"
            bind:value={searchQuery}
          />
        </div>
      </div>

      <div class="flex-shrink-0 w-full md:w-48">
        <label for="status" class="sr-only">Filter by status</label>
        <select id="status" class="input w-full" bind:value={statusFilter}>
          <option value="all">{$t('agent.tours.management.filter_all')}</option>
          <option value="active">{$t('agent.tours.management.filter_active')}</option>
          <option value="inactive">{$t('agent.tours.management.filter_inactive')}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Error message if loading failed -->
  {#if loadError}
    <div
      class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-6"
      role="alert"
    >
      <strong class="font-bold">Error loading tours:</strong>
      <span class="block sm:inline"> {loadError}</span>
      <button class="absolute top-0 bottom-0 right-0 px-4 py-3" on:click={() => (loadError = '')}>
        <svg
          class="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </button>
    </div>
  {/if}

  <!-- Tours List -->
  {#if isLoading}
    <div class="bg-white rounded-lg shadow-sm p-8 border border-neutral-200 text-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="rounded-full bg-neutral-200 h-16 w-16 mb-4"></div>
        <div class="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
        <div class="h-3 bg-neutral-200 rounded w-1/3"></div>
      </div>
    </div>
  {:else if filteredTours.length === 0}
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
      <h2 class="text-xl font-heading font-bold mb-2">
        {$t('agent.tours.management.no_tours_found')}
      </h2>
      <p class="text-neutral-600 mb-4">
        {searchQuery || statusFilter !== 'all'
          ? $t('agent.tours.management.search_adjust_message')
          : $t('agent.tours.management.no_tours_message')}
      </p>
      <Button href="/agent/tours/add" variant="primary">{$t('agent.tours.add_new')}</Button>
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
                {$t('agent.tours.management.table_tour')}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {$t('agent.tours.management.table_location')}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {$t('agent.tours.management.table_duration')}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {$t('agent.tours.management.table_price')}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {$t('agent.tours.management.table_status')}
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {$t('agent.tours.management.table_actions')}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-neutral-200">
            {#each filteredTours as tour (tour._id)}
              <tr class="hover:bg-neutral-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      {#if tour.iconType}
                        <ChineseIcon
                          icon={tour.iconType}
                          size="lg"
                          color={tour.isActive ? '#B91C1C' : '#9CA3AF'}
                        />
                      {:else}
                        <div class="h-10 w-10 rounded-full bg-neutral-200"></div>
                      {/if}
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-neutral-900">{tour.title}</div>
                      <div class="text-sm text-neutral-500 truncate max-w-xs">
                        {tour.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-neutral-900">{tour.location || tour.destination}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-neutral-900">{tour.duration}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-neutral-900">${tour.price}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {tour.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-neutral-100 text-neutral-800'}"
                  >
                    {tour.isActive
                      ? $t('agent.tours.management.status_active')
                      : $t('agent.tours.management.status_inactive')}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <button
                      class="text-secondary-dark hover:text-secondary"
                      on:click={() => toggleTourStatus(tour._id)}
                    >
                      {tour.isActive
                        ? $t('agent.tours.management.action_deactivate')
                        : $t('agent.tours.management.action_activate')}
                    </button>
                    <a
                      href={`/agent/tours/edit/${tour._id}`}
                      class="text-primary-dark hover:text-primary"
                    >
                      {$t('agent.tours.management.action_edit')}
                    </a>
                    <button
                      class="text-red-600 hover:text-red-800"
                      on:click={() => confirmDelete(tour._id)}
                    >
                      {$t('agent.tours.management.action_delete')}
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
                {$t('agent.tours.management.delete_modal_title')}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-neutral-500">
                  {$t('agent.tours.management.delete_modal_message')}
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
            on:click={deleteTour}
          >
            {$t('agent.tours.management.delete_modal_confirm')}
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={cancelDelete}
          >
            {$t('agent.tours.management.delete_modal_cancel')}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
