import { json } from '@sveltejs/kit';
import { createUser } from '$lib/server/services/userService';
import type { RequestEvent } from '@sveltejs/kit';

// In a real application, this endpoint would be protected by authentication
export const POST = async ({ request }: RequestEvent) => {
  console.log('API: POST /api/users/create - Creating new user');

  try {
    const userData = await request.json();
    console.log('API: POST /api/users/create - Received user data:', {
      ...userData,
      password: userData.password ? '********' : undefined, // Log everything except the actual password
    });

    // Basic validation
    if (
      !userData.username ||
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.role
    ) {
      console.log('API: POST /api/users/create - Missing required fields');
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUser = await createUser({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
    });

    console.log(`API: POST /api/users/create - User created successfully with ID ${newUser._id}`);
    return json(newUser, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('API: POST /api/users/create - Error creating user:', errorMessage);
    console.error('Error stack:', errorStack);

    // Handle specific errors
    if (error instanceof Error && error.message === 'Username already exists') {
      return json({ error: 'Username already exists', details: errorMessage }, { status: 409 });
    }

    return json({ error: 'Failed to create user', details: errorMessage }, { status: 500 });
  }
};
