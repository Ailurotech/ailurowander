import type { TourSummary } from "$lib/types/tour";

export const load = async ({ url }: { url: URL }) => {
  const query = url.searchParams.get('query') || '';

  return {
    query,
    // Don't load tours on server - let client handle it
    tours: [],
  };
};
