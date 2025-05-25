import { json } from '@sveltejs/kit';
import { getTourById, updateTour, deleteTour, uploadTourImages, updateTourImages } from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';
import type { Tour } from '$lib/types/tour';

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
    
    const formData = await request.formData();
    
    // Extract tour data from form
    const tourData: Partial<Tour> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      destination: formData.get('destination') as string,
      duration: {
        days: parseInt(formData.get('durationDays') as string),
        nights: parseInt(formData.get('durationNights') as string)
      },
      price: {
        amount: parseFloat(formData.get('price') as string),
        currency: 'USD'
      },
      featured: formData.get('featured') === 'true',
      itinerary: JSON.parse(formData.get('itinerary') as string || '[]'),
      highlights: formData.getAll('highlights') as string[],
      inclusions: formData.getAll('included') as string[],
      exclusions: formData.getAll('notIncluded') as string[]
    };

    // Update the tour first
    const updatedTour = await updateTour(id, tourData);
    
    if (!updatedTour) {
      return json({ error: 'Tour not found' }, { status: 404 });
    }

    // Handle image uploads if present
    const mainImage = formData.get('mainImage') as File | null;
    const galleryImages = formData.getAll('galleryImages') as File[];
    
    // Only attempt to upload if we have valid files
    if ((mainImage && mainImage.size > 0) || galleryImages.some(img => img.size > 0)) {
      const imageUrls = await uploadTourImages(
        {
          main: mainImage || new File([], 'placeholder.jpg'),
          gallery: galleryImages.filter(img => img.size > 0)
        },
        id
      );
      
      // Update tour with image URLs
      await updateTourImages(id, imageUrls);
    }
    
    return json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return json({ error: 'Failed to update tour', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
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