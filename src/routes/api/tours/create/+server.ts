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

// In a real application, this endpoint would be protected by authentication
export async function POST({ request }: RequestEvent) {
  console.log('API: POST /api/tours/create - Creating new tour');

  try {
    const formData = await request.formData();

    // Extract tour data from form
    const tourData: Omit<Tour, "_id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      destination: formData.get("destination") as string,
      duration: {
        days: parseInt(formData.get('durationDays') as string),
        nights: parseInt(formData.get('durationNights') as string),
      },
      price: {
        amount: parseFloat(formData.get('price') as string),
        currency: 'USD',
      },
      featured: formData.get("featured") === "true",
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
      throw new Error("Failed to create tour: No ID returned");
    }

    // Handle image uploads
    const mainImage = formData.get('mainImage') as File;
    const galleryImages = formData.getAll('galleryImages') as File[];

    if (mainImage || galleryImages.length > 0) {
      const imageUrls = await uploadTourImages(
        {
          main: mainImage,
          gallery: galleryImages,
        },
        tour._id.toString(),
      );

      // Update tour with image URLs
      await updateTourImages(tour._id.toString(), imageUrls);
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
    const hasItineraryImages = itineraryImages.some((img) => img !== null);
    if (hasItineraryImages) {
      const itineraryImageUrls = await uploadItineraryImages(
        itineraryImages,
        tour._id.toString(),
      );
      await updateTourItineraryImages(
        tour._id.toString(),
        itinerary,
        itineraryImageUrls,
      );
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

    return json({ error: 'Failed to create tour', details: errorMessage }, { status: 500 });
  }
}
