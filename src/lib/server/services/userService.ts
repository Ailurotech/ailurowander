import { ObjectId } from 'mongodb';
import { getUsers } from '../db';
import type { User, UserSummary } from '$lib/types/user';
import * as bcrypt from 'bcrypt';

// Get all users
export async function getAllUsers(): Promise<UserSummary[]> {
  console.log('getAllUsers: Fetching all users from database');
  const usersCollection = await getUsers();
  const users = await usersCollection.find().toArray();

  console.log(`getAllUsers: Found ${users.length} users`);

  return users.map(user => ({
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  }));
}

// Get a user by ID
export async function getUserById(id: string): Promise<UserSummary | null> {
  console.log(`getUserById: Fetching user with ID ${id}`);

  if (!ObjectId.isValid(id)) {
    console.log('getUserById: Invalid ObjectId format');
    return null;
  }

  const usersCollection = await getUsers();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    console.log('getUserById: User not found');
    return null;
  }

  console.log(`getUserById: Found user ${user.username}`);

  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  };
}

// Create a new user
export async function createUser(userData: {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}): Promise<UserSummary> {
  console.log(`createUser: Creating new user with username ${userData.username}`);

  const usersCollection = await getUsers();

  // Check if username already exists
  console.log(`createUser: Checking if username ${userData.username} already exists`);
  const existingUser = await usersCollection.findOne({
    username: userData.username,
  });
  if (existingUser) {
    console.log(`createUser: Username ${userData.username} already exists`);
    throw new Error('Username already exists');
  }

  // Hash the password
  console.log('createUser: Hashing password');
  const passwordHash = await bcrypt.hash(userData.password, 10);

  const newUser: User = {
    username: userData.username,
    name: userData.name,
    email: userData.email,
    passwordHash,
    role: userData.role as User['role'],
    isActive: userData.isActive,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('createUser: Inserting new user into database');
  const result = await usersCollection.insertOne(newUser);
  console.log(`createUser: User created with ID ${result.insertedId}`);

  return {
    _id: result.insertedId,
    username: newUser.username,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    isActive: newUser.isActive,
    lastLogin: newUser.lastLogin,
  };
}

// Update a user
export async function updateUser(
  id: string,
  userData: {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
  }
): Promise<UserSummary | null> {
  console.log(`updateUser: Updating user with ID ${id}`);

  if (!ObjectId.isValid(id)) {
    console.log('updateUser: Invalid ObjectId format');
    return null;
  }

  const usersCollection = await getUsers();

  // Check if username already exists (if changing username)
  if (userData.username) {
    console.log(`updateUser: Checking if username ${userData.username} already exists`);
    const existingUser = await usersCollection.findOne({
      username: userData.username,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingUser) {
      console.log(`updateUser: Username ${userData.username} already exists`);
      throw new Error('Username already exists');
    }
  }

  const updateData: any = {
    ...userData,
    updatedAt: new Date(),
  };

  // If password is provided, hash it
  if (userData.password) {
    console.log('updateUser: Hashing new password');
    updateData.passwordHash = await bcrypt.hash(userData.password, 10);
    delete updateData.password;
  }

  console.log('updateUser: Updating user in database');
  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) {
    console.log('updateUser: User not found or update failed');
    return null;
  }

  console.log(`updateUser: User ${result.username} updated successfully`);

  return {
    _id: result._id,
    username: result.username,
    name: result.name,
    email: result.email,
    role: result.role,
    isActive: result.isActive,
    lastLogin: result.lastLogin,
  };
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  console.log(`deleteUser: Deleting user with ID ${id}`);

  if (!ObjectId.isValid(id)) {
    console.log('deleteUser: Invalid ObjectId format');
    return false;
  }

  const usersCollection = await getUsers();
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

  const success = result.deletedCount === 1;
  console.log(
    `deleteUser: Deletion ${success ? 'successful' : 'failed'}, deleted count: ${result.deletedCount}`
  );

  return success;
}

// Authenticate a user
export async function authenticateUser(
  username: string,
  password: string
): Promise<UserSummary | null> {
  console.log(`authenticateUser: Authenticating user ${username}`);

  const usersCollection = await getUsers();
  const user = await usersCollection.findOne({ username });

  if (!user || !user.isActive) {
    console.log(`authenticateUser: User ${username} not found or inactive`);
    return null;
  }

  console.log('authenticateUser: Comparing passwords');
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    console.log('authenticateUser: Password does not match');
    return null;
  }

  console.log(`authenticateUser: User ${username} authenticated successfully, updating last login`);
  // Update last login timestamp
  await usersCollection.updateOne(
    { _id: user._id },
    { $set: { lastLogin: new Date(), updatedAt: new Date() } }
  );

  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: new Date(),
  };
}
