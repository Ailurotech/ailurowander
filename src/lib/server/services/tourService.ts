import { ObjectId } from 'mongodb';
import { getTours } from '../db';
import type { Tour, TourSummary } from '$lib/types/tour';
import { getDB } from '$lib/server/db';
import { uploadToS3, generateS3Key } from '$lib/server/s3';

// Get all tours or featured tours
export async function getAllTours(featuredOnly = false): Promise<TourSummary[]> {
  console.log(`getAllTours: Fetching ${featuredOnly ? 'featured' : 'all'} tours from database`);

  const toursCollection = await getTours();
  const query = featuredOnly ? { featured: true } : {};

  console.log(`getAllTours: Using query:`, query);

  const tours = await toursCollection.find(query).toArray();
  console.log(`getAllTours: Found ${tours.length} tours in database`);

  if (tours.length > 0) {
    console.log(`getAllTours: First tour in database:`, tours[0]);
  } else {
    console.log(`getAllTours: No tours found in database`);
  }

  return tours.map(tour => ({
    _id: tour._id,
    title: tour.title,
    description: tour.description,
    image: tour.images?.main || '/images/placeholder.jpg',
    duration: tour.duration ? `${tour.duration.days} days` : 'N/A',
    price: tour.price?.amount || 0,
    destination: tour.destination || '',
    featured: tour.featured || false,
  }));
}

// Get a tour by ID
export async function getTourById(id: string): Promise<Tour | null> {
  console.log(`getTourById: Fetching tour with ID ${id}`);

  if (!ObjectId.isValid(id)) {
    console.log(`getTourById: Invalid ObjectId format: ${id}`);
    return null;
  }

  const toursCollection = await getTours();
  const tour = (await toursCollection.findOne({ _id: new ObjectId(id) })) as Tour | null;

  if (tour) {
    console.log(`getTourById: Found tour "${tour.title}"`);
  } else {
    console.log(`getTourById: No tour found with ID ${id}`);
  }

  return tour;
}

// Create a new tour
export async function createTour(
  tour: Omit<Tour, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Tour> {
  console.log(`createTour: Creating new tour "${tour.title}"`);

  const toursCollection = await getTours();

  const newTour: Tour = {
    ...tour,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log(`createTour: Inserting tour data:`, {
    title: newTour.title,
    destination: newTour.destination,
    // Log essential properties but not the entire object
  });

  const result = await toursCollection.insertOne(newTour as any);
  console.log(`createTour: Tour created with ID ${result.insertedId}`);

  return { ...newTour, _id: result.insertedId };
}

// Update a tour
export async function updateTour(id: string, tourData: Partial<Tour>): Promise<Tour | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const toursCollection = await getTours();

  const updateData = {
    ...tourData,
    updatedAt: new Date(),
  };

  delete updateData._id; // Remove _id if present in the update data

  await toursCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  return await getTourById(id);
}

// Delete a tour
export async function deleteTour(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const toursCollection = await getTours();
  const result = await toursCollection.deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount === 1;
}

// Search tours by destination, title, or description
export async function searchTours(query: string): Promise<TourSummary[]> {
  const toursCollection = await getTours();

  const tours = await toursCollection
    .find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    })
    .toArray();

  return tours.map(tour => ({
    _id: tour._id,
    title: tour.title,
    description: tour.description,
    image: tour.images?.main || '/images/placeholder.jpg',
    duration: `${tour.duration.days} days`,
    price: tour.price.amount,
    destination: tour.destination,
    featured: tour.featured,
  }));
}

/**
 * Upload tour images to S3
 * @param images Array of image files
 * @param tourId The ID of the tour
 * @returns Object containing URLs for main and gallery images
 */
export async function uploadTourImages(
  images: { main: File; gallery: File[] },
  tourId: string
): Promise<{ main: string; gallery: string[] }> {
  try {
    // Upload main image
    const mainImageKey = generateS3Key(images.main.name, `tours/${tourId}/`);
    const mainImageUrl = await uploadToS3(
      await images.main.arrayBuffer(),
      mainImageKey,
      images.main.type
    );

    // Upload gallery images
    const galleryUrls = await Promise.all(
      images.gallery.map(async image => {
        const key = generateS3Key(image.name, `tours/${tourId}/gallery/`);
        return uploadToS3(await image.arrayBuffer(), key, image.type);
      })
    );

    return {
      main: mainImageUrl,
      gallery: galleryUrls,
    };
  } catch (error) {
    console.error('Error uploading tour images:', error);
    throw new Error('Failed to upload tour images');
  }
}

/**
 * Update tour with new image URLs
 * @param tourId The ID of the tour
 * @param imageUrls Object containing main and gallery image URLs
 */
export async function updateTourImages(
  tourId: string,
  imageUrls: { main?: string; gallery?: string[] }
): Promise<void> {
  const db = await getDB();
  const toursCollection = db.collection('tours');

  const updateObject: any = {};

  if (imageUrls.main !== undefined) {
    updateObject['images.main'] = imageUrls.main;
  }

  if (imageUrls.gallery !== undefined) {
    updateObject['images.gallery'] = imageUrls.gallery;
  }

  if (Object.keys(updateObject).length > 0) {
    await toursCollection.updateOne({ _id: new ObjectId(tourId) }, { $set: updateObject });
  }
}

/**
 * Upload itinerary images to S3
 * @param itineraryImages Array of image files for each day
 * @param tourId The ID of the tour
 * @returns Array of image URLs corresponding to each day
 */
export async function uploadItineraryImages(
  itineraryImages: (File | null)[],
  tourId: string
): Promise<(string | undefined)[]> {
  try {
    const imageUrls = await Promise.all(
      itineraryImages.map(async (image, index) => {
        if (!image) return undefined;

        const key = generateS3Key(image.name, `tours/${tourId}/itinerary/day-${index + 1}/`);
        return uploadToS3(await image.arrayBuffer(), key, image.type);
      })
    );

    return imageUrls;
  } catch (error) {
    console.error('Error uploading itinerary images:', error);
    throw new Error('Failed to upload itinerary images');
  }
}

/**
 * Update tour itinerary with image URLs
 * @param tourId The ID of the tour
 * @param itinerary The itinerary array
 * @param imageUrls Array of image URLs for each day
 */
export async function updateTourItineraryImages(
  tourId: string,
  itinerary: any[],
  imageUrls: (string | undefined)[]
): Promise<void> {
  const db = await getDB();
  const toursCollection = db.collection('tours');

  // Get the current tour to preserve existing images
  const currentTour = await toursCollection.findOne({ _id: new ObjectId(tourId) });
  const existingItinerary = currentTour?.itinerary || [];

  // Update each itinerary day with its corresponding image URL, preserving existing images
  const updatedItinerary = itinerary.map((day, index) => ({
    ...day,
    // Only update image if a new one is provided, otherwise keep existing image
    image: imageUrls[index] !== undefined ? imageUrls[index] : existingItinerary[index]?.image,
  }));

  await toursCollection.updateOne(
    { _id: new ObjectId(tourId) },
    {
      $set: {
        itinerary: updatedItinerary,
      },
    }
  );
}

/**
 * Upload accommodation images to S3
 * @param accommodationImages Array of file arrays for each day
 * @param tourId The ID of the tour
 * @returns Array of image URL arrays corresponding to each day
 */
export async function uploadAccommodationImages(
  accommodationImages: File[][],
  tourId: string
): Promise<string[][]> {
  try {
    const imageUrls: string[][] = [];

    for (let dayIndex = 0; dayIndex < accommodationImages.length; dayIndex++) {
      const dayImages = accommodationImages[dayIndex];
      if (dayImages && dayImages.length > 0) {
        const dayImageUrls = await Promise.all(
          dayImages.map(async (image, imgIndex) => {
            const key = generateS3Key(
              image.name,
              `tours/${tourId}/accommodation/day-${dayIndex + 1}/`
            );
            return uploadToS3(await image.arrayBuffer(), key, image.type);
          })
        );
        imageUrls[dayIndex] = dayImageUrls;
      } else {
        imageUrls[dayIndex] = [];
      }
    }

    return imageUrls;
  } catch (error) {
    console.error('Error uploading accommodation images:', error);
    throw new Error('Failed to upload accommodation images');
  }
}

/**
 * Upload meals images to S3
 * @param mealsImages Array of meal image arrays for each day
 * @param tourId The ID of the tour
 * @returns Array of meal image URL arrays corresponding to each day
 */
export async function uploadMealsImages(
  mealsImages: File[][][],
  tourId: string
): Promise<string[][][]> {
  try {
    const imageUrls: string[][][] = [];

    for (let dayIndex = 0; dayIndex < mealsImages.length; dayIndex++) {
      const dayMeals = mealsImages[dayIndex];
      if (dayMeals && dayMeals.length > 0) {
        const dayMealUrls: string[][] = [];

        for (let mealIndex = 0; mealIndex < dayMeals.length; mealIndex++) {
          const mealImages = dayMeals[mealIndex];
          if (mealImages && mealImages.length > 0) {
            const mealImageUrls = await Promise.all(
              mealImages.map(async (image, imgIndex) => {
                const key = generateS3Key(
                  image.name,
                  `tours/${tourId}/meals/day-${dayIndex + 1}/meal-${mealIndex + 1}/`
                );
                return uploadToS3(await image.arrayBuffer(), key, image.type);
              })
            );
            dayMealUrls[mealIndex] = mealImageUrls;
          } else {
            dayMealUrls[mealIndex] = [];
          }
        }
        imageUrls[dayIndex] = dayMealUrls;
      } else {
        imageUrls[dayIndex] = [];
      }
    }

    return imageUrls;
  } catch (error) {
    console.error('Error uploading meals images:', error);
    throw new Error('Failed to upload meals images');
  }
}

/**
 * Update tour itinerary with accommodation and meals images
 * @param tourId The ID of the tour
 * @param itinerary The itinerary array
 * @param accommodationImageUrls Array of accommodation image URLs for each day
 * @param mealsImageUrls Array of meals image URLs for each day
 */
export async function updateTourAccommodationAndMealsImages(
  tourId: string,
  itinerary: any[],
  accommodationImageUrls: string[][],
  mealsImageUrls: string[][][]
): Promise<void> {
  const db = await getDB();
  const toursCollection = db.collection('tours');

  // Get the current tour to preserve existing images
  const currentTour = await toursCollection.findOne({ _id: new ObjectId(tourId) });
  const existingItinerary = currentTour?.itinerary || [];

  // Update each itinerary day with accommodation and meals images
  const updatedItinerary = itinerary.map((day, index) => {
    const existingDay = existingItinerary[index] || {};
    const updatedDay = { ...day };

    // Update accommodation images
    if (accommodationImageUrls[index] && accommodationImageUrls[index].length > 0) {
      updatedDay.accommodation = {
        ...updatedDay.accommodation,
        images: accommodationImageUrls[index],
      };
    } else if (existingDay.accommodation?.images) {
      updatedDay.accommodation = {
        ...updatedDay.accommodation,
        images: existingDay.accommodation.images,
      };
    }

    // Update meals images
    if (mealsImageUrls[index] && mealsImageUrls[index].length > 0) {
      updatedDay.meals =
        updatedDay.meals?.map((meal: any, mealIndex: number) => ({
          ...meal,
          images: mealsImageUrls[index][mealIndex] || meal.images || [],
        })) || [];
    } else if (existingDay.meals) {
      updatedDay.meals =
        updatedDay.meals?.map((meal: any, mealIndex: number) => ({
          ...meal,
          images: existingDay.meals?.[mealIndex]?.images || meal.images || [],
        })) || [];
    }

    return updatedDay;
  });

  await toursCollection.updateOne(
    { _id: new ObjectId(tourId) },
    {
      $set: {
        itinerary: updatedItinerary,
      },
    }
  );
}
