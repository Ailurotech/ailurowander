import { json } from '@sveltejs/kit';
import { getTourById, updateTour, deleteTour } from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'Tour ID is required' }, { status: 400 });
    }
    
    const tour = await getTourById(id);
    
    if (!tour) {
      return json({ error: 'Tour not found' }, { status: 404 });
    }
    
    return json(tour);
  } catch (error) {
    console.error('Error fetching tour details:', error);
    return json({ error: 'Failed to fetch tour details' }, { status: 500 });
  }
};

// The following endpoints would typically be protected by authentication
// in a production application

export const PUT = async ({ params, request }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'Tour ID is required' }, { status: 400 });
    }
    
    const tourData = await request.json();
    
    const updatedTour = await updateTour(id, tourData);
    
    if (!updatedTour) {
      return json({ error: 'Tour not found' }, { status: 404 });
    }
    
    return json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return json({ error: 'Failed to update tour' }, { status: 500 });
  }
};

export const DELETE = async ({ params }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'Tour ID is required' }, { status: 400 });
    }
    
    const success = await deleteTour(id);
    
    if (!success) {
      return json({ error: 'Tour not found or could not be deleted' }, { status: 404 });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}; 