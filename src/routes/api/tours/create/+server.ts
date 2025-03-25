import { json } from '@sveltejs/kit';
import { createTour } from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';

// In a real application, this endpoint would be protected by authentication
export const POST = async ({ request }: RequestEvent) => {
  console.log('API: POST /api/tours/create - Creating new tour');
  
  try {
    const tourData = await request.json();
    console.log('API: POST /api/tours/create - Received tour data:', {
      title: tourData.title,
      destination: tourData.destination,
      // Log essential info but not the entire object for brevity
    });
    
    // Basic validation
    if (!tourData.title || !tourData.description || !tourData.destination) {
      console.log('API: POST /api/tours/create - Missing required fields');
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Ensure required nested objects exist
    tourData.images = tourData.images || { main: '', gallery: [] };
    tourData.duration = tourData.duration || { days: 1, nights: 0 };
    tourData.price = tourData.price || { amount: 0, currency: 'USD' };
    
    const newTour = await createTour(tourData);
    console.log(`API: POST /api/tours/create - Tour created successfully with ID ${newTour._id}`);
    
    return json(newTour, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('API: POST /api/tours/create - Error creating tour:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return json({ error: 'Failed to create tour', details: errorMessage }, { status: 500 });
  }
}; 