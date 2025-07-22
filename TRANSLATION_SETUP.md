# Translation System Setup

This document explains how to set up and use the translation system that can
translate Chinese text to all supported languages and store the results in the
database.

## Features

- **Multi-language Translation**: Translate Chinese text to English, German,
  Japanese, Spanish, and Thai
- **Database Storage**: All translations are stored in MongoDB with usage
  tracking
- **Translation History**: View and search through previous translations
- **Context & Categories**: Organize translations with context and category tags
- **API Integration**: Supports multiple translation APIs (Google Translate,
  LibreTranslate, or mock for development)

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your `.env` file:

```env
# Translation API Configuration
TRANSLATION_API_KEY=your_api_key_here
TRANSLATION_API_URL=https://translation.googleapis.com/language/translate/v2

# For LibreTranslate (free alternative)
# TRANSLATION_API_URL=https://libretranslate.com/translate
```

### 2. Translation API Options

#### Option A: Google Translate API (Recommended for production)

- Requires API key from Google Cloud Console
- High accuracy and reliability
- Paid service with usage limits

#### Option B: LibreTranslate (Free alternative)

- Self-hosted or use public instance
- No API key required
- Good for development and testing

#### Option C: Mock Translation (Development only)

- No API key required
- Uses predefined translations for testing
- Automatically falls back to this if no API is configured

### 3. Database Setup

The translation system automatically creates a `translations` collection in your
MongoDB database. No additional setup required.

## Usage

### Web Interface

1. Navigate to `/agent/translations` in your application
2. Enter Chinese text in the input field
3. Optionally add context and category
4. Click "Translate to All Languages"
5. View results and translation history

### API Usage

#### Translate Text

```javascript
const response = await fetch("/api/translations", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chineseText: '你好世界',
    context: 'greeting',
    category: 'ui',
  }),
});

const result = await response.json();
console.log(result.data.translations);
```

#### Search Translations

```javascript
const response = await fetch("/api/translations?q=hello");
const result = await response.json();
```

#### Get Translation History

```javascript
const response = await fetch("/api/translations?limit=20");
const result = await response.json();
```

## Database Schema

The `translations` collection stores documents with this structure:

```javascript
{
  _id: ObjectId,
  original: "你好世界",           // Chinese source text
  translations: {
    en: "Hello world",
    de: "Hallo Welt",
    ja: "こんにちは世界",
    es: "Hola mundo",
    th: "สวัสดีโลก"
  },
  timestamp: Date,              // When translation was created
  context: "greeting",          // Optional context
  category: "ui",               // Optional category
  usage_count: 5,              // How many times accessed
  last_used: Date              // Last access timestamp
}
```

## Supported Languages

- **zh** (Chinese) - Source language
- **en** (English)
- **de** (German)
- **ja** (Japanese)
- **es** (Spanish)
- **th** (Thai)

## Categories

Predefined categories for organizing translations:

- `tours` - Tour-related content
- `destinations` - Destination descriptions
- `ui` - User interface text
- `content` - General content
- `marketing` - Marketing materials
- `other` - Miscellaneous

## Error Handling

The system includes comprehensive error handling:

- Invalid input validation
- API connection failures
- Database operation errors
- Graceful fallbacks to original text

## Performance Considerations

- **Caching**: Existing translations are retrieved from database instead of
  re-translating
- **Usage Tracking**: Popular translations are prioritized
- **Batch Operations**: Multiple translations are processed in parallel
- **Search Optimization**: Full-text search across all languages

## Development Notes

- Mock translations are used when no API is configured
- All API calls include proper error handling
- Database operations use proper MongoDB types
- Frontend includes loading states and error messages

## Troubleshooting

### Common Issues

1. **Translation API not working**
   - Check API key and URL configuration
   - Verify network connectivity
   - Check API usage limits

2. **Database connection issues**
   - Verify MongoDB connection string
   - Check database permissions
   - Ensure collections are accessible

3. **Frontend not loading**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check authentication for agent routes

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=translation:*
```

This will log all translation operations and API calls for troubleshooting.
