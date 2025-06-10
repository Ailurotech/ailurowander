import { error } from '@sveltejs/kit';
import type { Tour } from '$lib/types/tour';
import { deslugify } from '$lib/utils/slugify';

export const load = async ({ params, fetch }: { params: { name: string }, fetch: typeof globalThis.fetch }) => {
  try {
    // Get the name parameter from the URL and convert it to a search query
    const nameParam = params.name;
    
    // First try to fetch by the slugified name
    const response = await fetch(`/api/tours/by-slug/${nameParam}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw error(404, 'Tour not found');
      }
      throw error(500, 'Failed to load tour details');
    }
    
    const tour: Tour = await response.json();
    
    return {
      tour
    };
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
      throw err as any;
    }
    throw error(500, 'An unexpected error occurred');
  }
}; 