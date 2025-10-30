import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import {
  getTourById,
  updateTour,
  deleteTour,
  uploadTourImages,
  updateTourImages,
  uploadItineraryImages,
  updateTourItineraryImages,
  uploadAccommodationImages,
  uploadMealsImages,
  updateTourAccommodationAndMealsImages,
} from '$lib/server/services/tourService';
import type { RequestEvent } from '@sveltejs/kit';
import type { Tour } from '$lib/types/tour';
import { validateSession } from '$lib/server/services/authService';

// Add authentication check helper
async function checkAuth(event: RequestEvent) {
  const sessionToken = event.cookies.get('agent_session');
  
  if (!sessionToken) {
    return false;
  }
  
  const agent = await validateSession(sessionToken);
  return !!agent;
}

export const GET = async (event: RequestEvent) => {
  // Check authentication for all methods
  const isAuthenticated = await checkAuth(event);
  if (!isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = event.params.id;
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

export const PUT = async (event: RequestEvent) => {
  // Check authentication for all methods
  const isAuthenticated = await checkAuth(event);
  if (!isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = event.params.id;
    if (!id) {
      return json({ error: 'Tour ID is required' }, { status: 400 });
    }

    // Check if the request size is too large before processing
    const contentLength = event.request.headers.get('content-length');
    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      console.log(`Request size: ${sizeInMB.toFixed(2)}MB`);
      
      // Allow up to 50MB for tour updates with images
      if (sizeInMB > 50) {
        return json({ 
          error: 'Request too large', 
          details: `Request size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed size of 50MB` 
        }, { status: 413 });
      }
    }

    const formData = await event.request.formData();

    // Extract tour data from form
    const maxGroupSizeValue = formData.get('maxGroupSize') as string;
    const maxGroupSize = maxGroupSizeValue ? parseInt(maxGroupSizeValue) : undefined;
    
    const tourData: Partial<Tour> = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || undefined,
      description: formData.get('description') as string,
      destination: formData.get('destination') as string,
      weatherCity: formData.get('weatherCity') as string || undefined,
      duration: {
        days: parseInt(formData.get('durationDays') as string),
        nights: parseInt(formData.get('durationNights') as string),
      },
      price: {
        amount: parseFloat(formData.get('price') as string),
        currency: 'USD',
      },
      featured: formData.get('featured') === 'true',
      maxGroupSize: maxGroupSize, // Store the exact value entered or undefined if not provided
      itinerary: JSON.parse((formData.get('itinerary') as string) || '[]'),
      highlights: formData.getAll('highlights') as string[],
      inclusions: formData.getAll('included') as string[],
      exclusions: formData.getAll('notIncluded') as string[],
    };

    // Handle image removals
    const removedGalleryImages = JSON.parse((formData.get('removedGalleryImages') as string) || '[]') as number[];
    const removeMainImage = formData.get('removeMainImage') === 'true';

    // Update the tour first
    const updatedTour = await updateTour(id, tourData);

    if (!updatedTour) {
      return json({ error: 'Tour not found' }, { status: 404 });
    }

    // Handle image uploads if present with size validation
    const mainImage = formData.get('mainImage') as File | null;
    const galleryImages = (formData.getAll('galleryImages') as File[]).filter(img => img && img.size > 0);

    // Validate individual file sizes (10MB per image)
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    
    if (mainImage && mainImage.size > maxFileSize) {
      return json({ 
        error: 'Main image too large', 
        details: `Main image size (${(mainImage.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size of 10MB` 
      }, { status: 413 });
    }

    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i];
      if (image.size > maxFileSize) {
        return json({ 
          error: 'Gallery image too large', 
          details: `Gallery image ${i + 1} size (${(image.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size of 10MB` 
        }, { status: 413 });
      }
    }

    // Only attempt to upload if we have valid files
    const hasValidMainImage = mainImage && mainImage.size > 0;
    const hasValidGalleryImages = galleryImages.length > 0;

    if (hasValidMainImage || hasValidGalleryImages) {
      const imageUrls = await uploadTourImages(
        {
          main: hasValidMainImage ? mainImage! : undefined,
          gallery: galleryImages,
        },
        id
      );

      // Handle image updates and removals
      const toursCollection = await getDB().then(db => db.collection('tours'));
      const currentTour = await toursCollection.findOne({ _id: new ObjectId(id) });
      const existingImages = currentTour?.images || { main: '', gallery: [] };

      // Prepare final image URLs
      let finalMainImage = existingImages.main;
      let finalGalleryImages = [...existingImages.gallery];

      // Remove main image if requested
      if (removeMainImage) {
        finalMainImage = '';
      }

      // Remove specified gallery images
      if (removedGalleryImages.length > 0) {
        finalGalleryImages = finalGalleryImages.filter((_, index) => !removedGalleryImages.includes(index));
      }

      // Add new images
      if (hasValidMainImage && imageUrls.main) {
        finalMainImage = imageUrls.main;
      }

      if (hasValidGalleryImages && imageUrls.gallery) {
        finalGalleryImages = [...finalGalleryImages, ...imageUrls.gallery];
      }

      // Update tour with final image URLs
      await updateTourImages(id, {
        main: finalMainImage,
        gallery: finalGalleryImages,
      });
    }

    // Handle itinerary image uploads
    const itinerary = JSON.parse((formData.get('itinerary') as string) || '[]');
    const itineraryImages: (File | null)[] = [];

    // Extract itinerary images from form data
    for (let i = 0; i < itinerary.length; i++) {
      const itineraryImage = formData.get(`itineraryImage_${i}`) as File | null;
      itineraryImages.push(itineraryImage && itineraryImage.size > 0 ? itineraryImage : null);
    }

    // Always update itinerary (preserves existing images when no new ones are provided)
    if (itineraryImages.some(img => img !== null)) {
      // Upload new itinerary images if any exist
      const itineraryImageUrls = await uploadItineraryImages(itineraryImages, id);
      await updateTourItineraryImages(id, itinerary, itineraryImageUrls);
    } else {
      // No new images, but still need to update itinerary content (preserving existing images)
      await updateTourItineraryImages(id, itinerary, []);
    }

    // Extract and upload accommodation images
    const accommodationImages: File[][] = [];
    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const dayAccommodationImages: File[] = [];
      let imgIndex = 0;
      while (true) {
        const accommodationImage = formData.get(
          `accommodationImage_${dayIndex}_${imgIndex}`
        ) as File | null;
        if (accommodationImage && accommodationImage.size > 0) {
          dayAccommodationImages.push(accommodationImage);
          imgIndex++;
        } else {
          break;
        }
      }
      accommodationImages.push(dayAccommodationImages);
    }

    // Extract and upload meals images
    const mealsImages: File[][][] = [];
    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const dayMealImages: File[][] = [];
      const dayMeals = itinerary[dayIndex].meals || [];

      for (let mealIndex = 0; mealIndex < dayMeals.length; mealIndex++) {
        const mealImages: File[] = [];
        let imgIndex = 0;
        while (true) {
          const mealImage = formData.get(
            `mealImage_${dayIndex}_${mealIndex}_${imgIndex}`
          ) as File | null;
          if (mealImage && mealImage.size > 0) {
            mealImages.push(mealImage);
            imgIndex++;
          } else {
            break;
          }
        }
        dayMealImages.push(mealImages);
      }
      mealsImages.push(dayMealImages);
    }

    // Upload accommodation and meals images if any exist
    const hasAccommodationImages = accommodationImages.some(dayImages => dayImages.length > 0);
    const hasMealsImages = mealsImages.some(dayMeals =>
      dayMeals.some(mealImages => mealImages.length > 0)
    );

    if (hasAccommodationImages || hasMealsImages) {
      const accommodationImageUrls = hasAccommodationImages
        ? await uploadAccommodationImages(accommodationImages, id)
        : [];
      const mealsImageUrls = hasMealsImages ? await uploadMealsImages(mealsImages, id) : [];
      await updateTourAccommodationAndMealsImages(
        id,
        itinerary,
        accommodationImageUrls,
        mealsImageUrls
      );
    }

    return json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return json(
      {
        error: 'Failed to update tour',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (event: RequestEvent) => {
  // Check authentication for all methods
  const isAuthenticated = await checkAuth(event);
  if (!isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = event.params.id;
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