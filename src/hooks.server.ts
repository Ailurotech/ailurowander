// src/hooks.server.ts
// No global database initialization needed anymore.

import type { Handle } from '@sveltejs/kit';

export const config = {
  runtime: 'nodejs18.x',
};

// Handle function to manage requests
export const handle: Handle = async ({ event, resolve }) => {
  // For large file uploads, we need to increase the body size limit
  // The default limit in Node.js/SvelteKit is around 1MB
  // This is handled at the adapter level, but we can add logging here
  
  if (event.request.method === 'POST' && event.url.pathname.includes('/api/tours')) {
    console.log('Processing tour upload request:', {
      url: event.url.pathname,
      method: event.request.method,
      contentType: event.request.headers.get('content-type')
    });
  }

  return await resolve(event);
};
