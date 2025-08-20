import { json } from '@sveltejs/kit';
import { getAllTours, searchTours } from '$lib/server/services/tourService';
import { json as jsonResponse } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';

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

// Support partial updates for tour properties like isActive
export const PATCH = async ({ request }: RequestEvent) => {
  try {
    const body = await request.json();
    const { id, isActive, featured } = body as { id?: string; isActive?: boolean; featured?: boolean };

    if (!id) {
      return jsonResponse({ error: 'Tour ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return jsonResponse({ error: 'Invalid Tour ID' }, { status: 400 });
    }

    const db = await getDB();
    const toursCollection = db.collection('tours');

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (typeof featured === 'boolean') update.featured = featured;

    if (Object.keys(update).length === 1) {
      return jsonResponse({ error: 'No valid fields to update' }, { status: 400 });
    }

    const result = await toursCollection.updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return jsonResponse({ error: 'Tour not found' }, { status: 404 });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: 'Failed to update tour', details: errorMessage }, { status: 500 });
  }
};
