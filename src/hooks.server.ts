import { initDatabase } from '$lib/server/init';

// Initialize database when the server starts
initDatabase().catch(console.error);

export const config = {
  runtime: 'nodejs18.x',
}; 