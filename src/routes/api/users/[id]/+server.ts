import { json } from '@sveltejs/kit';
import { getUserById, updateUser, deleteUser } from '$lib/server/services/userService';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const user = await getUserById(id);
    
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
};

export const PUT = async ({ params, request }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const userData = await request.json();
    
    const updatedUser = await updateUser(id, userData);
    
    if (!updatedUser) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message === 'Username already exists') {
      return json({ error: 'Username already exists' }, { status: 409 });
    }
    
    return json({ error: 'Failed to update user' }, { status: 500 });
  }
};

export const DELETE = async ({ params }: RequestEvent) => {
  try {
    const id = params.id;
    if (!id) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const success = await deleteUser(id);
    
    if (!success) {
      return json({ error: 'User not found or could not be deleted' }, { status: 404 });
    }
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return json({ error: 'Failed to delete user' }, { status: 500 });
  }
}; 