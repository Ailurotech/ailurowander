import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

// Use env.MONGODB_URI and provide a default for local development
const MONGODB_URI = env.MONGODB_URI || 'mongodb://localhost:27017/ailuroWander';

console.log('MongoDB connection string:', MONGODB_URI);

const client = new MongoClient(MONGODB_URI);

export async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database name from connection string or default to ailuroWander
    const dbName = MONGODB_URI.split('/').pop() || 'ailuroWander';
    console.log(`Using database: ${dbName}`);
    
    const db = client.db(dbName);
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // List all databases on the MongoDB server
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log('All databases on MongoDB server:', dbs.databases.map(db => db.name));
    
    // If tours collection exists, show count
    if (collections.some(c => c.name === 'tours')) {
      const toursCount = await db.collection('tours').countDocuments();
      console.log(`Found ${toursCount} documents in tours collection`);
      
      // Show first 3 tours for debugging
      if (toursCount > 0) {
        const sampleTours = await db.collection('tours').find().limit(3).toArray();
        console.log('Sample tours:', sampleTours);
      }
    }
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function closeDB() {
  await client.close();
  console.log('MongoDB connection closed');
}

// Cache the connection to avoid multiple connections
let db: Awaited<ReturnType<typeof connectDB>> | null = null;

export async function getDB() {
  if (!db) {
    console.log('No existing MongoDB connection, creating a new one');
    db = await connectDB();
  } else {
    console.log('Using existing MongoDB connection');
  }
  return db;
}

export async function getTours() {
  const db = await getDB();
  console.log('Accessing tours collection');
  return db.collection('tours');
}

export async function getUsers() {
  const db = await getDB();
  console.log('Accessing users collection');
  return db.collection('users');
} 