import { json } from '@sveltejs/kit';
import { getAllTours, searchTours } from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ url }: RequestEvent) => {
  console.log('API: GET /api/tours - Fetching tours');

  try {
    const query = url.searchParams.get('query');
    const featuredOnly = url.searchParams.get('featured') === 'true';

    console.log(`API: GET /api/tours - Query params: query=${query}, featured=${featuredOnly}`);

    let tours;
    if (query) {
      console.log(`API: GET /api/tours - Searching tours with query: ${query}`);
      tours = await searchTours(query);
    } else {
      console.log(`API: GET /api/tours - Getting all tours (featuredOnly: ${featuredOnly})`);
      tours = await getAllTours(featuredOnly);
    }

    console.log(`API: GET /api/tours - Found ${tours.length} tours`);
    if (tours.length > 0) {
      console.log('API: GET /api/tours - First tour:', tours[0]);
    } else {
      console.log('API: GET /api/tours - No tours found');
    }

    return json(tours);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('API: GET /api/tours - Error fetching tours:', errorMessage);
    console.error('Error stack:', errorStack);

    return json({ error: 'Failed to fetch tours', details: errorMessage }, { status: 500 });
  }
};
