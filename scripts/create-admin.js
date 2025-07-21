import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'ailuroWander';

// Hash password function (same as in authService)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const agentsCollection = db.collection('agents');
    
    // Check if admin already exists
    const existingAdmin = await agentsCollection.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminAgent = {
      username: 'admin',
      email: 'admin@ailurotech.com.au',
      passwordHash: hashPassword('1234'),
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await agentsCollection.insertOne(adminAgent);
    console.log('Admin user created with ID:', result.insertedId);
    console.log('Username: admin');
    console.log('Password: password');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await client.close();
  }
}

createAdmin(); 