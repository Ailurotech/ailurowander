import { ObjectId } from 'mongodb';
import { getTours } from '../db';
import type { Tour, TourSummary } from '$lib/types/tour';

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
    image: tour.images?.main || '',
    duration: tour.duration ? `${tour.duration.days} days` : 'N/A',
    price: tour.price?.amount || 0,
    destination: tour.destination || '',
    featured: tour.featured || false
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
  const tour = await toursCollection.findOne({ _id: new ObjectId(id) }) as Tour | null;
  
  if (tour) {
    console.log(`getTourById: Found tour "${tour.title}"`);
  } else {
    console.log(`getTourById: No tour found with ID ${id}`);
  }
  
  return tour;
}

// Create a new tour
export async function createTour(tour: Omit<Tour, '_id' | 'createdAt' | 'updatedAt'>): Promise<Tour> {
  console.log(`createTour: Creating new tour "${tour.title}"`);
  
  const toursCollection = await getTours();
  
  const newTour: Tour = {
    ...tour,
    createdAt: new Date(),
    updatedAt: new Date()
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
    updatedAt: new Date()
  };
  
  delete updateData._id; // Remove _id if present in the update data
  
  await toursCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  
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
  
  const tours = await toursCollection.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { destination: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  }).toArray();
  
  return tours.map(tour => ({
    _id: tour._id,
    title: tour.title,
    description: tour.description,
    image: tour.images.main,
    duration: `${tour.duration.days} days`,
    price: tour.price.amount,
    destination: tour.destination,
    featured: tour.featured
  }));
} 