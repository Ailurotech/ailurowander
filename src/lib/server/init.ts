import { getUsers, getTours } from './db';
import { createUser } from './services/userService';
import { createTour } from './services/tourService';

// Initialize the database with an admin user if none exists
export async function initDatabase() {
  console.log('=============================');
  console.log('INITIALIZING DATABASE');
  console.log('=============================');
  
  try {
    console.log('Checking for existing users...');
    const usersCollection = await getUsers();
    
    // Check if any users exist
    const userCount = await usersCollection.countDocuments();
    console.log(`User count in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('No users found. Creating admin user...');
      
      try {
        const admin = await createUser({
          username: 'admin',
          name: 'Administrator',
          email: 'admin@ailuro.com',
          password: 'adminpassword',  // This would typically be a secure password
          role: 'administrator',
          isActive: true
        });
        
        console.log('Admin user created successfully:', admin);
      } catch (err) {
        console.error('Error creating admin user:', err);
      }
    } else {
      console.log(`Found ${userCount} existing users. Skipping admin creation.`);
    }
    
    // Initialize tours
    await initTours();
    
    console.log('Database initialization complete');
    console.log('=============================');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.log('=============================');
  }
}

// Initialize sample tours if none exist
async function initTours() {
  console.log('Checking for existing tours...');
  const toursCollection = await getTours();
  
  // Check if any tours exist
  const tourCount = await toursCollection.countDocuments();
  console.log(`Tour count in database: ${tourCount}`);
  
  if (tourCount === 0) {
    console.log('No tours found. Creating sample tours...');
    
    try {
      // Sample tour data
      const sampleTours = [
        {
          title: 'Classic Beijing Tour',
          description: 'Explore the Great Wall, Forbidden City, and more in this classic Beijing tour.',
          shortDescription: 'Discover the wonders of Beijing.',
          duration: { days: 5, nights: 4 },
          price: { amount: 1299, currency: 'USD' },
          destination: 'Beijing',
          maxGroupSize: 15,
          included: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
          notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
          itinerary: [
            { day: 1, title: 'Arrival Day', description: 'Welcome to Beijing! Transfer to hotel and rest.' },
            { day: 2, title: 'Forbidden City', description: 'Visit Tiananmen Square and Forbidden City.' },
            { day: 3, title: 'Great Wall', description: 'Day trip to the Great Wall of China.' },
            { day: 4, title: 'Summer Palace', description: 'Visit the Summer Palace and Temple of Heaven.' },
            { day: 5, title: 'Departure', description: 'Free time for shopping before departure.' }
          ],
          images: { 
            main: '/images/beijing.jpg', 
            gallery: ['/images/great-wall.jpg', '/images/forbidden-city.jpg'] 
          },
          featured: true,
          discount: 0,
          tags: ['Beijing', 'Great Wall', 'Culture', 'History'],
          iconType: 'great-wall'
        },
        {
          title: 'Shanghai Highlights',
          description: 'Experience the vibrant city of Shanghai with visits to the Bund, Yu Garden, and more.',
          shortDescription: 'Vibrant city life in Shanghai.',
          duration: { days: 4, nights: 3 },
          price: { amount: 999, currency: 'USD' },
          destination: 'Shanghai',
          maxGroupSize: 12,
          included: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
          notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
          itinerary: [
            { day: 1, title: 'Arrival Day', description: 'Welcome to Shanghai! Transfer to hotel and rest.' },
            { day: 2, title: 'The Bund', description: 'Explore the Bund and Nanjing Road.' },
            { day: 3, title: 'Yu Garden', description: 'Visit Yu Garden and Shanghai Tower.' },
            { day: 4, title: 'Departure', description: 'Free time before departure.' }
          ],
          images: { 
            main: '/images/shanghai.jpg', 
            gallery: ['/images/bund.jpg'] 
          },
          featured: true,
          discount: 0,
          tags: ['Shanghai', 'Urban', 'Modern', 'Shopping'],
          iconType: 'forbidden-city'
        },
        {
          title: 'Xian & Terracotta Warriors',
          description: 'Discover the ancient city of Xian and the famous Terracotta Warriors.',
          shortDescription: 'Ancient wonders of Xian.',
          duration: { days: 3, nights: 2 },
          price: { amount: 899, currency: 'USD' },
          destination: 'Xian',
          maxGroupSize: 10,
          included: ['Hotel accommodation', 'English speaking guide', 'Transportation'],
          notIncluded: ['International flights', 'Travel insurance', 'Personal expenses'],
          itinerary: [
            { day: 1, title: 'Arrival Day', description: 'Welcome to Xian! Transfer to hotel and city wall.' },
            { day: 2, title: 'Terracotta Warriors', description: 'Full day at the Terracotta Warriors.' },
            { day: 3, title: 'Departure', description: 'Visit Big Wild Goose Pagoda before departure.' }
          ],
          images: { 
            main: '/images/xian.jpg', 
            gallery: ['/images/terracotta.jpg'] 
          },
          featured: true,
          discount: 0,
          tags: ['Xian', 'Terracotta Warriors', 'History', 'Ancient'],
          iconType: 'terracotta'
        }
      ];
      
      // Create sample tours
      for (const tourData of sampleTours) {
        const newTour = await createTour(tourData);
        console.log(`Created tour: ${newTour.title}`);
      }
      
      console.log('Sample tours created successfully!');
    } catch (err) {
      console.error('Error creating sample tours:', err);
    }
  } else {
    console.log(`Found ${tourCount} existing tours. Skipping sample tour creation.`);
  }
} 