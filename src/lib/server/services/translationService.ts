import { getDB } from '../db';
import { supportedLanguages } from '../../i18n';
import { ObjectId } from 'mongodb';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { env } from '$env/dynamic/private';

// AWS Translate configuration (uses same credentials as S3)
const AWS_REGION = env.S3_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = env.S3_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = env.S3_SECRET_ACCESS_KEY || '';
const USE_AWS_TRANSLATE = env.USE_AWS_TRANSLATE === 'true';

// Only translate to English
const TARGET_LANGUAGE = 'en';

export interface TranslationRequest {
  chineseText: string;
  context?: string;
  category?: string;
}

export interface TranslationResult {
  original: string;
  translations: Record<string, string>;
  timestamp: Date;
  context?: string;
  category?: string;
}

export interface StoredTranslation {
  _id?: ObjectId;
  original: string;
  translations: Record<string, string>;
  timestamp: Date;
  context?: string;
  category?: string;
  usage_count: number;
  last_used: Date;
}

class TranslationService {
  private async translateText(text: string, targetLang: string): Promise<string> {
    try {
      // Only use AWS Translate
      if (USE_AWS_TRANSLATE && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
        return await this.translateWithAWS(text, targetLang);
      }

      // If AWS Translate is not configured, return original text
      console.warn(
        'AWS Translate not configured. Please set USE_AWS_TRANSLATE=true and AWS credentials.'
      );
      return text;
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
      return text; // Return original text if translation fails
    }
  }

  private async translateWithAWS(text: string, targetLang: string): Promise<string> {
    try {
      // Create AWS Translate client
      const client = new TranslateClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });

      // Create translate command
      const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'zh',
        TargetLanguageCode: targetLang,
      });

      // Execute translation
      const response = await client.send(command);

      if (response.TranslatedText) {
        return response.TranslatedText;
      } else {
        throw new Error('No translation returned from AWS API');
      }
    } catch (error) {
      console.error('AWS Translate API error:', error);
      throw error;
    }
  }

  public async translateToEnglish(request: TranslationRequest): Promise<TranslationResult> {
    const { chineseText, context, category } = request;

    // Check if translation already exists in database
    const existingTranslation = await this.getExistingTranslation(chineseText);
    if (existingTranslation) {
      // Update usage count and last used timestamp
      await this.updateTranslationUsage(existingTranslation._id!);
      return {
        original: existingTranslation.original,
        translations: existingTranslation.translations,
        timestamp: existingTranslation.timestamp,
        context: existingTranslation.context,
        category: existingTranslation.category,
      };
    }

    // Translate to English only
    const translatedText = await this.translateText(chineseText, TARGET_LANGUAGE);

    const result: TranslationResult = {
      original: chineseText,
      translations: { en: translatedText },
      timestamp: new Date(),
      context,
      category,
    };

    // Store in database
    await this.storeTranslation(result);

    return result;
  }

  private async getExistingTranslation(chineseText: string): Promise<StoredTranslation | null> {
    const db = await getDB();
    const collection = db.collection('translations');

    const result = await collection.findOne({ original: chineseText });
    return result as StoredTranslation | null;
  }

  private async storeTranslation(translation: TranslationResult): Promise<void> {
    const db = await getDB();
    const collection = db.collection('translations');

    const storedTranslation = {
      ...translation,
      usage_count: 1,
      last_used: new Date(),
    };

    await collection.insertOne(storedTranslation);
  }

  private async updateTranslationUsage(translationId: ObjectId): Promise<void> {
    const db = await getDB();
    const collection = db.collection('translations');

    await collection.updateOne(
      { _id: translationId },
      {
        $inc: { usage_count: 1 },
        $set: { last_used: new Date() },
      }
    );
  }

  public async getTranslationHistory(limit: number = 50): Promise<StoredTranslation[]> {
    const db = await getDB();
    const collection = db.collection('translations');

    const results = await collection.find({}).sort({ last_used: -1 }).limit(limit).toArray();

    return results as StoredTranslation[];
  }

  public async searchTranslations(query: string): Promise<StoredTranslation[]> {
    const db = await getDB();
    const collection = db.collection('translations');

    const results = await collection
      .find({
        $or: [
          { original: { $regex: query, $options: 'i' } },
          { 'translations.en': { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ last_used: -1 })
      .limit(20)
      .toArray();

    return results as StoredTranslation[];
  }

  public async deleteTranslation(translationId: string): Promise<boolean> {
    const db = await getDB();
    const collection = db.collection('translations');

    const result = await collection.deleteOne({ _id: new ObjectId(translationId) });
    return result.deletedCount > 0;
  }
}

export const translationService = new TranslationService();
