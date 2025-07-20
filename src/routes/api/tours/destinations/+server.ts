import { json } from "@sveltejs/kit";
import { getTours } from "$lib/server/db";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({}: RequestEvent) {
  try {
    const toursCollection = await getTours();

    // Get all unique destinations from tours
    const destinations = await toursCollection.distinct("destination");

    // Filter out any null or empty destinations
    const validDestinations = destinations.filter(
      (dest) => dest && dest.trim() !== "",
    );

    return json(validDestinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}
