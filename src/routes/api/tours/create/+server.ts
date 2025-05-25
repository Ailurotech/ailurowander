import { json } from '@sveltejs/kit';
import { createTour, uploadTourImages, updateTourImages } from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';
import type { Tour } from '$lib/types/tour';

// In a real application, this endpoint would be protected by authentication
export async function POST({ request }: RequestEvent) {
  console.log('API: POST /api/tours/create - Creating new tour');
  
  try {
    const formData = await request.formData();
    
    // Extract tour data from form
    const tourData: Omit<Tour, '_id' | 'createdAt' | 'updatedAt'> = {
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
      images: {
        main: '',
        gallery: []
      },
      highlights: [],
      itinerary: JSON.parse(formData.get('itinerary') as string || '[]'),
      inclusions: formData.getAll('included') as string[],
      exclusions: formData.getAll('notIncluded') as string[],
      tags: []
    };

    // Create the tour first to get an ID
    const tour = await createTour(tourData);
    
    if (!tour._id) {
      throw new Error('Failed to create tour: No ID returned');
    }

    // Handle image uploads
    const mainImage = formData.get('mainImage') as File;
    const galleryImages = formData.getAll('galleryImages') as File[];
    
    if (mainImage || galleryImages.length > 0) {
      const imageUrls = await uploadTourImages(
        {
          main: mainImage,
          gallery: galleryImages
        },
        tour._id.toString()
      );
      
      // Update tour with image URLs
      await updateTourImages(tour._id.toString(), imageUrls);
    }

    console.log(`API: POST /api/tours/create - Tour created successfully with ID ${tour._id}`);
    
    return json(tour, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('API: POST /api/tours/create - Error creating tour:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return json({ error: 'Failed to create tour', details: errorMessage }, { status: 500 });
  }
} 