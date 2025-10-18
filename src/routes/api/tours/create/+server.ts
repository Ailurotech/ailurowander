import { json } from '@sveltejs/kit';
import {
  createTour,
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

// In a real application, this endpoint would be protected by authentication
export async function POST(event: RequestEvent) {
  // Check authentication
  const isAuthenticated = await checkAuth(event);
  if (!isAuthenticated) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('API: POST /api/tours/create - Creating new tour');

  try {
    // Check if the request size is too large before processing
    const contentLength = event.request.headers.get('content-length');
    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      console.log(`Request size: ${sizeInMB.toFixed(2)}MB`);
      
      // Allow up to 50MB for tour creation with images
      if (sizeInMB > 50) {
        return json({ 
          error: 'Request too large', 
          details: `Request size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed size of 50MB` 
        }, { status: 413 });
      }
    }

    const formData = await event.request.formData();
    console.log('API: Form data received, fields:', Array.from(formData.keys()));

    // Extract tour data from form
    const maxGroupSizeValue = formData.get('maxGroupSize') as string;
    const maxGroupSize = maxGroupSizeValue ? parseInt(maxGroupSizeValue) : undefined;
    
    const tourData: Omit<Tour, '_id' | 'createdAt' | 'updatedAt'> = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || undefined,
      description: formData.get('description') as string,
      destination: formData.get('destination') as string,
      duration: {
        days: parseInt(formData.get('durationDays') as string),
        nights: parseInt(formData.get('durationNights') as string),
      },
      price: {
        amount: parseFloat(formData.get('price') as string),
        currency: 'USD',
      },
      featured: formData.get('featured') === 'true',
      isActive: true,
      maxGroupSize: maxGroupSize, // Store the exact value entered or undefined if not provided
      images: {
        main: '',
        gallery: [],
      },
      highlights: [],
      itinerary: JSON.parse((formData.get('itinerary') as string) || '[]'),
      inclusions: formData.getAll('included') as string[],
      exclusions: formData.getAll('notIncluded') as string[],
      tags: [],
    };

    // Create the tour first to get an ID
    const tour = await createTour(tourData);

    if (!tour._id) {
      throw new Error('Failed to create tour: No ID returned');
    }

    // Handle image uploads with size validation
    const mainImage = formData.get('mainImage') as File | null;
    const galleryImages = (formData.getAll('galleryImages') as File[]).filter(
      (f) => f && f.size > 0
    );

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

    if ((mainImage && mainImage.size > 0) || galleryImages.length > 0) {
      const imageUrls = await uploadTourImages(
        {
          main: mainImage && mainImage.size > 0 ? mainImage : undefined,
          gallery: galleryImages,
        },
        tour._id.toString()
      );

      // Update tour with image URLs
      if (imageUrls.main || imageUrls.gallery) {
        await updateTourImages(tour._id.toString(), imageUrls);
      }
    }

    // Handle itinerary image uploads
    const itinerary = tourData.itinerary;
    const itineraryImages: (File | null)[] = [];

    // Extract itinerary images from formData
    for (let i = 0; i < itinerary.length; i++) {
      const imageFile = formData.get(`itineraryImage_${i}`) as File | null;
      itineraryImages.push(imageFile);
    }

    // Upload itinerary images if any exist
    const hasItineraryImages = itineraryImages.some(img => img !== null);
    if (hasItineraryImages) {
      const itineraryImageUrls = await uploadItineraryImages(itineraryImages, tour._id.toString());
      await updateTourItineraryImages(tour._id.toString(), itinerary, itineraryImageUrls);
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
        ? await uploadAccommodationImages(accommodationImages, tour._id.toString())
        : [];
      const mealsImageUrls = hasMealsImages
        ? await uploadMealsImages(mealsImages, tour._id.toString())
        : [];
      await updateTourAccommodationAndMealsImages(
        tour._id.toString(),
        itinerary,
        accommodationImageUrls,
        mealsImageUrls
      );
    }

    console.log(`API: POST /api/tours/create - Tour created successfully with ID ${tour._id}`);

    return json(tour, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('API: POST /api/tours/create - Error creating tour:', errorMessage);
    console.error('Error stack:', errorStack);

    // Ensure we always return valid JSON, even for internal server errors
    return json({ 
      error: 'Failed to create tour', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}