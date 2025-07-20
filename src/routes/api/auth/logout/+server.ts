import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSession } from '$lib/server/services/authService';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    const sessionToken = cookies.get('agent_session');

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Clear the session cookie
    cookies.delete('agent_session', { path: '/' });

    return json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
