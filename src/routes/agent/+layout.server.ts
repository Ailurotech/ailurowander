import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { validateSession } from "$lib/server/services/authService";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const sessionToken = cookies.get('agent_session');

  // If we're on the login page, don't redirect
  if (url.pathname === "/agent" || url.pathname === "/agent/") {
    return {};
  }

  // Check if user is authenticated
  if (!sessionToken) {
    throw redirect(302, "/agent");
  }

  // Validate session
  const agent = await validateSession(sessionToken);

  if (!agent) {
    // Invalid session, clear cookie and redirect to login
    cookies.delete("agent_session", { path: "/" });
    throw redirect(302, "/agent");
  }

  // Return agent data for the client
  return {
    agent: {
      id: agent._id?.toString(),
      username: agent.username,
      email: agent.email,
      role: agent.role,
    },
  };
};
