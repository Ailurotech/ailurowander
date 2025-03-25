import { error } from '@sveltejs/kit';
import type { Tour } from '$lib/types/tour';

export const load = async ({ params, fetch }: { params: { id: string }, fetch: typeof globalThis.fetch }) => {
  try {
    const response = await fetch(`/api/tours/${params.id}`);
    
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