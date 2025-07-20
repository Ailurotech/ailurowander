import { error, redirect } from "@sveltejs/kit";
import type { Tour } from "$lib/types/tour";
import { slugify } from "$lib/utils/slugify";

export const load = async ({
  params,
  fetch,
}: {
  params: { id: string };
  fetch: typeof globalThis.fetch;
}) => {
  try {
    // First, fetch the tour by ID
    const response = await fetch(`/api/tours/${params.id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw error(404, "Tour not found");
      }
      throw error(500, "Failed to load tour details");
    }

    const tour: Tour = await response.json();

    // Create the slug from the tour title
    const tourSlug = slugify(tour.title);

    // Redirect to the slug-based URL
    throw redirect(301, `/tours/${tourSlug}`);
  } catch (err: unknown) {
    // Only re-throw if it's not a redirect
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      "location" in err
    ) {
      throw err; // This is a redirect, let it through
    } else if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      "message" in err
    ) {
      throw err as any; // This is an error response, let it through
    }
    throw error(500, "An unexpected error occurred");
  }
};
