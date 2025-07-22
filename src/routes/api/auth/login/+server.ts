import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  authenticateAgent,
  createSession,
} from "$lib/server/services/authService";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Authenticate agent
    const agent = await authenticateAgent(username, password);

    if (!agent) {
      return json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Create session
    const session = await createSession(agent._id!);

    // Set session cookie
    cookies.set("agent_session", session.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return json({
      success: true,
      agent: {
        id: agent._id,
        username: agent.username,
        email: agent.email,
        role: agent.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
