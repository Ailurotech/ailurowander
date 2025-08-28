import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { ObjectId } from 'mongodb';

export const GET = async ({ url }: RequestEvent) => {
  try {
    const tagsParam = url.searchParams.get('tags') ?? '';
    const excludeId = url.searchParams.get('excludeId') ?? '';
    const limit = Number(url.searchParams.get('limit') ?? '3');

    const tags = tagsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // 没标签就不推荐
    if (!tags.length) return json([]);

    const db = await getDB();
    const toursCol = db.collection('tours');

    const query: any = {
      tags: { $in: tags }, // 核心：按 tags 交集查
    };
    if (excludeId && ObjectId.isValid(excludeId)) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    const tours = await toursCol
      .find(query)
      .project({
        _id: 1,
        title: 1,
        description: 1,
        image: 1,
        duration: 1,
        price: 1,
        destination: 1,
        tags: 1,
        featured: 1,
        rating: 1
      })
      .limit(limit)
      .toArray();

    return json(tours);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: 'Failed to load related tours', details: msg }, { status: 500 });
  }
};