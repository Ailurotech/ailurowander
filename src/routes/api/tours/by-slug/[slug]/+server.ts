import { json } from "@sveltejs/kit";
import { getDB } from "$lib/server/db";
import { ObjectId } from "mongodb";
import { slugify } from "$lib/utils/slugify";
import type { Tour } from "$lib/types/tour";

/**
 * API endpoint to fetch a tour by its URL-friendly slug
 */
export async function GET({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const db = await getDB();
    const toursCollection = db.collection('tours');

    // Get all tours
    const tours = await toursCollection.find({}).toArray();

    // We need to find the tour with a title that matches the slug when slugified
    let matchedTour: any = null;

    for (const tourDoc of tours) {
      if (slugify(tourDoc.title) === slug) {
        matchedTour = tourDoc;
        break;
      }
    }

    if (!matchedTour) {
      return new Response(JSON.stringify({ error: "Tour not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return json(matchedTour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tour" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
