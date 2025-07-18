import { json } from '@sveltejs/kit';
import { getTourById, updateTour, deleteTour, uploadTourImages, updateTourImages, uploadItineraryImages, updateTourItineraryImages, uploadAccommodationImages, uploadMealsImages, updateTourAccommodationAndMealsImages } from '$lib/server/services/tourService';
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
    const hasValidMainImage = mainImage && mainImage.size > 0;
    const validGalleryImages = galleryImages.filter(img => img.size > 0);
    const hasValidGalleryImages = validGalleryImages.length > 0;
    
    if (hasValidMainImage || hasValidGalleryImages) {
      const imageUrls = await uploadTourImages(
        {
          main: hasValidMainImage ? mainImage! : new File([], 'placeholder.jpg'),
          gallery: validGalleryImages
        },
        id
      );
      
      // Update tour with image URLs (function now preserves existing images when new ones aren't provided)
      await updateTourImages(id, {
        main: hasValidMainImage ? imageUrls.main : '',
        gallery: hasValidGalleryImages ? imageUrls.gallery : []
      });
    }

    // Handle itinerary image uploads
    const itinerary = JSON.parse(formData.get('itinerary') as string || '[]');
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
    const accommodationImages: (File[])[] = [];
    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const dayAccommodationImages: File[] = [];
      let imgIndex = 0;
      while (true) {
        const accommodationImage = formData.get(`accommodationImage_${dayIndex}_${imgIndex}`) as File | null;
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
    const mealsImages: (File[][])[] = [];
    for (let dayIndex = 0; dayIndex < itinerary.length; dayIndex++) {
      const dayMealImages: File[][] = [];
      const dayMeals = itinerary[dayIndex].meals || [];
      
      for (let mealIndex = 0; mealIndex < dayMeals.length; mealIndex++) {
        const mealImages: File[] = [];
        let imgIndex = 0;
        while (true) {
          const mealImage = formData.get(`mealImage_${dayIndex}_${mealIndex}_${imgIndex}`) as File | null;
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
    const hasMealsImages = mealsImages.some(dayMeals => dayMeals.some(mealImages => mealImages.length > 0));
    
    if (hasAccommodationImages || hasMealsImages) {
      const accommodationImageUrls = hasAccommodationImages ? await uploadAccommodationImages(accommodationImages, id) : [];
      const mealsImageUrls = hasMealsImages ? await uploadMealsImages(mealsImages, id) : [];
      await updateTourAccommodationAndMealsImages(id, itinerary, accommodationImageUrls, mealsImageUrls);
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