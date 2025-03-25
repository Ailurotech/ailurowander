import { json } from '@sveltejs/kit';
import { getAllUsers } from '$lib/server/services/userService';
import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ url }: RequestEvent) => {
  console.log('API: GET /api/users - Fetching all users');
  
  try {
    // In a production app, you would check authentication/authorization here
    
    const users = await getAllUsers();
    
    console.log(`API: GET /api/users - Successfully retrieved ${users.length} users`);
    return json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('API: GET /api/users - Error fetching users:', errorMessage);
    console.error('Error stack:', errorStack);
    
    return json({ error: 'Failed to fetch users', details: errorMessage }, { status: 500 });
  }
}; 