import type { TourSummary } from '$lib/types/tour';

export const load = async ({ fetch, url }: { fetch: typeof globalThis.fetch, url: URL }) => {
  const query = url.searchParams.get('query') || '';
  const apiUrl = query 
    ? `/api/tours?query=${encodeURIComponent(query)}` 
    : '/api/tours';
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    return {
      tours: [],
      error: 'Failed to load tours'
    };
  }
  
  const tours: TourSummary[] = await response.json();
  
  return {
    tours,
    query
  };
}; 