import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  translationService,
  type TranslationRequest,
} from '$lib/server/services/translationService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: TranslationRequest = await request.json();

    if (!body.chineseText || body.chineseText.trim() === '') {
      return json({ error: 'Chinese text is required' }, { status: 400 });
    }

    const result = await translationService.translateToEnglish(body);

    return json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return json(
      {
        error: 'Failed to translate text',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('q');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    if (query) {
      // Search translations
      const results = await translationService.searchTranslations(query);
      return json({
        success: true,
        data: results,
      });
    } else {
      // Get translation history
      const results = await translationService.getTranslationHistory(limit);
      return json({
        success: true,
        data: results,
      });
    }
  } catch (error) {
    console.error('Translation history API error:', error);
    return json(
      {
        error: 'Failed to retrieve translations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const translationId = url.searchParams.get('id');

    if (!translationId) {
      return json({ error: 'Translation ID is required' }, { status: 400 });
    }

    const success = await translationService.deleteTranslation(translationId);

    if (success) {
      return json({ success: true, message: 'Translation deleted successfully' });
    } else {
      return json({ error: 'Translation not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete translation API error:', error);
    return json(
      {
        error: 'Failed to delete translation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
