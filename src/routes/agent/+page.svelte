<script lang="ts">
  import { t } from '$lib/i18n';
  import Section from '../../components/atoms/Section.svelte';
  import Button from '../../components/atoms/Button.svelte';
  import Divider from '../../components/atoms/Divider.svelte';
  import ChineseIcon from '../../components/atoms/ChineseIcon.svelte';
  import { goto } from '$app/navigation';
  
  // Login form state
  let username = '';
  let password = '';
  let rememberMe = false;
  let isLoading = false;
  let errorMessage = '';
  
  // Handle login submission
  async function handleLogin() {
    isLoading = true;
    errorMessage = '';
    
    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any login with non-empty values
      if (username && password) {
        // Redirect to tours management page
        goto('/agent/tours');
      } else {
        errorMessage = 'Please enter both username and password.';
      }
    } catch (error) {
      errorMessage = 'Login failed. Please try again.';
      console.error('Login error:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Agent Login | AiluroWander Travel</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="min-h-screen flex flex-col justify-center bg-neutral-50">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="text-center">
      <div class="inline-block p-2 rounded-full bg-primary/5 mb-4">
        <ChineseIcon icon="pagoda" size="xl" color="#B91C1C" />
      </div>
      <h2 class="text-3xl font-bold font-heading text-neutral-900">
        Agent Portal
      </h2>
      <p class="mt-2 text-sm text-neutral-600">
        Sign in to manage tours and bookings
      </p>
    </div>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if errorMessage}
        <div class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      {/if}
    
      <form class="space-y-6" on:submit|preventDefault={handleLogin}>
        <div>
          <label for="username" class="form-label">
            Username
          </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              bind:value={username}
              class="input w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label for="password" class="form-label">
            Password
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              bind:value={password}
              class="input w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              bind:checked={rememberMe}
              class="h-4 w-4 text-primary focus:ring-primary rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-neutral-700">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth={true} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-neutral-500">
              Need assistance?
            </span>
          </div>
        </div>

        <div class="mt-6 text-center text-sm">
          <p class="text-neutral-600">
            Contact administrator for account access
          </p>
          <p class="mt-1">
            <a href="/" class="font-medium text-primary hover:text-primary-dark">
              Return to website
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="mt-12 text-center text-xs text-neutral-500">
    <p>© {new Date().getFullYear()} AiluroWander Travel. All rights reserved.</p>
  </div>
</div> 