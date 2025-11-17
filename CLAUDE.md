# CLAUDE.md - AI Assistant Guide for AiluroWander

> **Last Updated**: 2025-11-17
> **Project**: AiluroWander - Travel & Tour Management Platform
> **Framework**: SvelteKit 2.x with TypeScript

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Architecture Patterns](#architecture-patterns)
7. [API Structure](#api-structure)
8. [Database Schema](#database-schema)
9. [Environment Configuration](#environment-configuration)
10. [Key Features](#key-features)
11. [Common Tasks](#common-tasks)
12. [Testing & Quality](#testing--quality)
13. [Deployment](#deployment)

---

## 📖 Project Overview

**AiluroWander** is a multilingual travel and tour management platform built with SvelteKit. The application allows administrators to manage tours with rich content including itineraries, accommodations, pricing, and availability. The platform supports 6 languages with real-time AWS translation capabilities.

### Primary Use Cases
- **Public-facing**: Browse tours, view destinations, contact forms
- **Agent Dashboard**: Create/edit tours, manage users, upload images
- **Multilingual Support**: Chinese (default), English, German, Japanese, Spanish, Thai

---

## 🛠 Tech Stack

### Core Framework
- **SvelteKit 2.16.0** - Full-stack framework (Svelte 5.0)
- **TypeScript 5.0** - Type safety
- **Vite 6.0** - Build tool and dev server

### Styling
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **PostCSS** with nesting support
- **Custom Theme**: Chinese-inspired color palette (vermilion red, jade green, gold accents)

### Database & Storage
- **MongoDB 6.14** - Primary database
- **AWS S3** - Image and asset storage
- **AWS SNS** - Notifications (contact forms)
- **AWS Translate** - Real-time translation service

### UI Components & Libraries
- **Tiptap 2.11** - Rich text editor for tour descriptions
- **AmCharts 5** - Data visualization and maps
- **bcrypt 6.0** - Password hashing

### Internationalization
- **sveltekit-i18n 2.4** - Translation management
- **Supported languages**: en, zh (default), de, ja, es, th

---

## 📁 Project Structure

```
ailurowander/
├── src/
│   ├── components/          # Svelte components (Atomic Design)
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Simple component combinations
│   │   ├── organisms/      # Complex components
│   │   │   └── form-sections/
│   │   ├── common/         # Shared components (Hero, Section, Newsletter)
│   │   ├── layout/         # Layout components (Header, Footer, Nav)
│   │   ├── home/           # Home page specific components
│   │   └── tours/          # Tour-specific components
│   │
│   ├── lib/                # Shared libraries and utilities
│   │   ├── i18n/           # Internationalization setup
│   │   │   ├── index.ts    # i18n configuration & stores
│   │   │   └── translations/  # JSON translation files
│   │   ├── server/         # Server-side only code
│   │   │   ├── db.ts       # MongoDB connection & helpers
│   │   │   ├── s3.ts       # AWS S3 client configuration
│   │   │   └── services/   # Business logic layer
│   │   │       ├── authService.ts
│   │   │       ├── tourService.ts
│   │   │       ├── translationService.ts
│   │   │       └── userService.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   ├── tour.ts     # Tour, TourSummary, TourFormData
│   │   │   └── user.ts     # User types
│   │   └── utils/          # Utility functions
│   │       └── slugify.ts  # URL slug generation
│   │
│   ├── routes/             # SvelteKit file-based routing
│   │   ├── +page.svelte    # Home page
│   │   ├── +layout.svelte  # Root layout
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact form
│   │   ├── tours/          # Tour browsing
│   │   │   ├── +page.svelte        # Tour listing
│   │   │   ├── [name]/             # Tour detail by slug
│   │   │   └── by-id/[id]/         # Tour detail by ID
│   │   ├── agent/          # Admin dashboard (protected)
│   │   │   ├── +layout.server.ts   # Auth check
│   │   │   ├── +layout.svelte      # Agent layout
│   │   │   ├── +page.svelte        # Dashboard home
│   │   │   ├── tours/              # Tour management
│   │   │   │   ├── add/            # Create new tour
│   │   │   │   └── edit/[id]/      # Edit existing tour
│   │   │   └── users/              # User management
│   │   └── api/            # API endpoints (server routes)
│   │       ├── auth/       # Authentication
│   │       │   ├── login/
│   │       │   └── logout/
│   │       ├── tours/      # Tour CRUD operations
│   │       │   ├── +server.ts          # GET all, POST create
│   │       │   ├── [id]/               # GET/PUT/DELETE by ID
│   │       │   ├── by-slug/[slug]/     # GET by slug
│   │       │   ├── by-province/        # Filter by location
│   │       │   └── destinations/       # Get unique destinations
│   │       ├── users/      # User management
│   │       ├── translations/ # Translation API
│   │       └── contact/    # Contact form submission
│   │
│   ├── app.html            # HTML template
│   ├── app.css             # Global styles
│   ├── app.d.ts            # Global type declarations
│   ├── global.d.ts         # Additional type declarations
│   └── hooks.server.ts     # SvelteKit server hooks
│
├── static/                 # Static assets (served as-is)
│   ├── images/             # Image assets
│   ├── patterns/           # Background patterns
│   ├── ailuro-logo.png     # Logo
│   ├── china-provinces.json # Geographic data
│   └── cn.svg, chinaHigh.svg # Map SVGs
│
├── scripts/                # Utility scripts
│   ├── create-admin.js     # Create admin user (gitignored)
│   └── fix-tour-images.js  # Image migration script
│
├── .env                    # Environment variables (gitignored)
├── package.json            # Dependencies and scripts
├── svelte.config.js        # SvelteKit configuration
├── tailwind.config.js      # Tailwind theme customization
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── AWS_TRANSLATE_SETUP.md  # AWS Translate setup guide
└── TRANSLATION_SETUP.md    # Translation feature documentation
```

### Component Organization (Atomic Design)

- **Atoms** (`src/components/atoms/`): Basic UI elements (buttons, inputs, labels)
- **Molecules** (`src/components/molecules/`): Simple combinations (Card, ParallaxHero)
- **Organisms** (`src/components/organisms/`): Complex components (forms, sections)
- **Common** (`src/components/common/`): Reusable across pages (Hero, Section, Newsletter)
- **Layout** (`src/components/layout/`): Structural components (Header, Footer, Navigation)
- **Domain-specific** (`src/components/tours/`, `home/`): Feature-specific components

---

## 🔄 Development Workflows

### Initial Setup

```bash
# Install dependencies
npm install  # or yarn install

# Set up environment variables
cp .env.example .env  # If exists, otherwise create .env manually
# Add required environment variables (see Environment Configuration section)

# Start development server
npm run dev

# Open in browser
# Default: http://localhost:5173
```

### Available Scripts

```json
{
  "dev": "vite dev",                    // Start dev server
  "build": "vite build",                // Production build
  "preview": "vite preview",            // Preview production build
  "prepare": "svelte-kit sync",         // Sync SvelteKit types
  "check": "svelte-check --tsconfig ./tsconfig.json",  // Type check
  "check:watch": "svelte-check --watch", // Watch mode type checking
  "format": "prettier --write .",       // Format all files
  "format:check": "prettier --check ."  // Check formatting
}
```

### Database Setup

```bash
# Create admin user (requires .env with MONGODB_URI)
node scripts/create-admin.js

# Fix tour images (if migrating data)
node scripts/fix-tour-images.js
```

### Git Workflow

- **Main branch**: Production-ready code
- **Feature branches**: Named like `feature/tour-pricing`, `fix/translation-bug`
- **Commit messages**: Clear, descriptive, present tense ("Add tour pricing feature")

---

## 📐 Code Conventions

### TypeScript

- **Strict mode enabled**: All type checks enforced
- **No implicit any**: Explicit type annotations required
- **Interfaces over types**: Use `interface` for object shapes
- **Import paths**: Use `$lib` alias for `src/lib`

```typescript
// Good
import { getTours } from '$lib/server/db';
import type { Tour } from '$lib/types/tour';

// Avoid
import { getTours } from '../../lib/server/db';
```

### Svelte Components

- **File naming**: PascalCase for components (e.g., `TourCard.svelte`)
- **Script tag**: Use `<script lang="ts">` for TypeScript
- **Props**: Destructure in script tag

```svelte
<script lang="ts">
  import type { Tour } from '$lib/types/tour';

  interface Props {
    tour: Tour;
    featured?: boolean;
  }

  let { tour, featured = false }: Props = $props();
</script>
```

### CSS/Tailwind

- **Prefer Tailwind utilities**: Use utility classes over custom CSS
- **Custom colors**: Use theme colors (primary, secondary, accent)
- **Responsive design**: Mobile-first approach

```svelte
<!-- Good: Using Tailwind utilities -->
<div class="container mx-auto px-4 md:px-8">
  <h1 class="text-3xl md:text-4xl font-heading text-primary">
    {tour.title}
  </h1>
</div>
```

### File Organization

- **One component per file**: Each `.svelte` file contains one component
- **Colocate related code**: Keep types, utilities, and components together
- **Barrel exports**: Use `index.ts` for cleaner imports (when applicable)

### Naming Conventions

- **Components**: PascalCase (`TourCard.svelte`, `PricingAvailability.svelte`)
- **Routes**: kebab-case for multi-word routes (`/tours/by-id/[id]`)
- **Functions**: camelCase (`getTourById`, `slugifyTitle`)
- **Constants**: UPPER_SNAKE_CASE (`MONGODB_URI`, `DEFAULT_LANGUAGE`)
- **Types/Interfaces**: PascalCase (`Tour`, `TourFormData`, `User`)

---

## 🏗 Architecture Patterns

### Layered Architecture

```
Presentation Layer (Svelte Components)
         ↓
    API Layer (+server.ts routes)
         ↓
  Service Layer (src/lib/server/services/)
         ↓
  Data Layer (src/lib/server/db.ts, s3.ts)
         ↓
   External Services (MongoDB, AWS S3, AWS Translate)
```

### Service Pattern

All business logic resides in service modules:

```typescript
// src/lib/server/services/tourService.ts
export async function getTourById(id: string): Promise<Tour | null> {
  const collection = await getTours();
  return await collection.findOne({ _id: new ObjectId(id) });
}
```

### Data Flow

1. **Client Component** makes request →
2. **API Route** validates input →
3. **Service Function** executes logic →
4. **Database/External Service** performs operation →
5. **Response** returned through layers

### Authentication

- **Server-side auth check**: `src/routes/agent/+layout.server.ts`
- **Session storage**: Cookie-based (implementation in authService)
- **Protected routes**: All `/agent/*` routes require authentication

### State Management

- **Svelte Stores**: Used for i18n locale management
- **Props drilling**: For component-level state
- **URL state**: For filters, pagination (search params)

---

## 🌐 API Structure

### REST API Endpoints

All API routes are in `src/routes/api/` and follow RESTful conventions.

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Tours
- `GET /api/tours` - List all active tours
- `POST /api/tours` - Create new tour (admin)
- `GET /api/tours/[id]` - Get tour by ID
- `PUT /api/tours/[id]` - Update tour (admin)
- `DELETE /api/tours/[id]` - Delete tour (admin)
- `GET /api/tours/by-slug/[slug]` - Get tour by URL slug
- `GET /api/tours/by-province` - Filter tours by province
- `GET /api/tours/destinations` - Get unique destinations

#### Users
- `GET /api/users` - List users (admin)
- `POST /api/users/create` - Create user (admin)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user (admin)
- `DELETE /api/users/[id]` - Delete user (admin)

#### Other
- `POST /api/translations` - Translate text (AWS Translate)
- `POST /api/contact` - Submit contact form (sends SNS notification)
- `GET /api/debug` - Debug endpoint (check environment variables)

### API Response Format

```typescript
// Success response
{
  success: true,
  data: { /* ... */ }
}

// Error response
{
  success: false,
  error: "Error message"
}
```

### Request/Response Examples

```typescript
// GET /api/tours
Response: {
  success: true,
  data: Tour[]
}

// POST /api/tours
Request: {
  title: string,
  description: string,
  // ... TourFormData
}
Response: {
  success: true,
  data: { _id: string }
}

// POST /api/translations
Request: {
  text: string,
  targetLanguage: 'en' | 'de' | 'ja' | 'es' | 'th'
}
Response: {
  success: true,
  translatedText: string
}
```

---

## 💾 Database Schema

### MongoDB Collections

#### tours Collection

```typescript
interface Tour {
  _id?: ObjectId;
  title: string;                    // Tour title
  subtitle?: string;                // Optional subtitle
  description: string;              // Short description
  longDescription?: string;         // Detailed description (rich text)
  isActive: boolean;                // Published status
  featured: boolean;                // Featured on homepage

  images: {
    main: string;                   // Main tour image (S3 URL)
    gallery?: string[];             // Additional images (S3 URLs)
  };

  duration: {
    days: number;
    nights: number;
  };

  price: {
    amount: number;
    currency: string;               // e.g., "CNY", "USD"
  };

  destination: string;              // e.g., "Beijing", "Sichuan"
  maxGroupSize?: number;            // Maximum participants

  highlights: string[];             // Key highlights/features
  inclusions: string[];             // What's included
  exclusions: string[];             // What's not included
  tags: string[];                   // Searchable tags

  itinerary: {
    day: number;
    title: string;
    description: string;
    image?: string;                 // Day-specific image (S3 URL)
    includedMeals?: {
      breakfast?: boolean;
      lunch?: boolean;
      dinner?: boolean;
    };
    accommodation?: {
      name: string;
      description?: string;
      images?: string[];            // Accommodation photos (S3 URLs)
    };
    meals?: {
      name: string;
      description?: string;
      images?: string[];            // Meal photos (S3 URLs)
    }[];
  }[];

  reviews?: {
    author: string;
    rating: number;                 // 1-5
    comment: string;
    date: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}
```

#### users Collection

```typescript
interface User {
  _id?: ObjectId;
  username: string;                 // Unique username
  email: string;                    // Email address
  password: string;                 // Bcrypt hashed password
  role: 'admin' | 'agent';          // User role
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Helper Functions

Located in `src/lib/server/db.ts`:

```typescript
// Connection management
connectDB()                // Establish MongoDB connection
closeDB()                  // Close connection
getDB()                    // Get cached DB instance

// Collection accessors
getTours()                 // Get tours collection
getUsers()                 // Get users collection
```

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ailuroWander
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ailuroWander?retryWrites=true&w=majority

# AWS S3 Configuration
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your_bucket_name

# AWS SNS (for contact form notifications)
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:contact-form

# AWS Translate (optional, for real-time translation)
USE_AWS_TRANSLATE=true
# Note: Uses same S3_* credentials

# Application Settings
NODE_ENV=development
```

### Environment Variable Usage

```typescript
// In server code only (src/lib/server/*)
import { env } from '$env/dynamic/private';

const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/ailuroWander';
```

**Important**: Never import `$env/dynamic/private` in client-side code!

---

## ✨ Key Features

### 1. Multilingual Support

- **Default language**: Chinese (`zh`)
- **Supported languages**: English, German, Japanese, Spanish, Thai
- **Implementation**: `sveltekit-i18n` with JSON translation files
- **Storage**: `src/lib/i18n/translations/*.json`
- **State**: Svelte store (`locale`) persisted to `localStorage`

```typescript
// Usage in components
import { t, locale, setLocale } from '$lib/i18n';

// In template
<h1>{$t('home.hero.title')}</h1>

// Change language
setLocale('en');
```

### 2. Real-time Translation (AWS Translate)

- **Service**: AWS Translate API
- **Trigger**: Translate buttons in tour forms
- **Auto-detection**: Detects Chinese text
- **Target languages**: All supported app languages
- **Configuration**: See `AWS_TRANSLATE_SETUP.md`

### 3. Image Upload & Management (AWS S3)

- **Upload flow**: Form → Presigned URL → S3 Direct Upload
- **Supported contexts**: Tour main images, gallery, itinerary, accommodations, meals
- **URL format**: `https://bucket.s3.region.amazonaws.com/tours/uuid-filename.jpg`
- **Configuration**: `src/lib/server/s3.ts`

### 4. Rich Text Editor (Tiptap)

- **Editor**: Tiptap with Bubble Menu
- **Usage**: Tour long descriptions, itinerary details
- **Features**: Headings, bold, italic, lists, links, images
- **Storage**: HTML format in MongoDB

### 5. Tour Management Dashboard

- **Route**: `/agent/*`
- **Authentication**: Required (session-based)
- **Features**:
  - Create/edit tours with full itinerary
  - Image upload (main, gallery, per-day images)
  - Accommodation and meal details
  - Pricing and availability
  - Real-time translation

### 6. Contact Form with SNS

- **Route**: `/contact`
- **Backend**: `POST /api/contact`
- **Notification**: AWS SNS topic
- **Data**: Name, email, message sent to SNS subscribers

---

## 🔧 Common Tasks

### Adding a New Page

1. Create route file: `src/routes/new-page/+page.svelte`
2. Add page layout if needed: `src/routes/new-page/+layout.svelte`
3. Add translations in all `src/lib/i18n/translations/*.json` files
4. Update navigation in `src/components/layout/Header.svelte`

### Adding a New Component

1. Determine component type (atom, molecule, organism, common, etc.)
2. Create in appropriate directory: `src/components/{type}/ComponentName.svelte`
3. Use TypeScript for props: `interface Props { ... }`
4. Follow naming conventions (PascalCase)

### Adding a New API Endpoint

1. Create route: `src/routes/api/resource/+server.ts`
2. Implement handlers: `GET`, `POST`, `PUT`, `DELETE`
3. Use service layer: Create/use service in `src/lib/server/services/`
4. Return JSON: `return json({ success: true, data })`

Example:

```typescript
// src/routes/api/tours/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTourById } from '$lib/server/services/tourService';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const tour = await getTourById(params.id);
    if (!tour) {
      return json({ success: false, error: 'Tour not found' }, { status: 404 });
    }
    return json({ success: true, data: tour });
  } catch (error) {
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
};
```

### Adding a New Service Function

1. Open appropriate service file in `src/lib/server/services/`
2. Add function with proper types
3. Use database helpers from `src/lib/server/db.ts`
4. Handle errors gracefully

```typescript
// src/lib/server/services/tourService.ts
export async function searchTours(query: string): Promise<Tour[]> {
  const collection = await getTours();
  return await collection.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ],
    isActive: true
  }).toArray();
}
```

### Adding Translations

1. Open all translation files: `src/lib/i18n/translations/*.json`
2. Add new keys in consistent structure
3. Use dot notation: `"tour.details.title": "Tour Details"`

```json
// en.json
{
  "tour": {
    "details": {
      "title": "Tour Details",
      "duration": "Duration"
    }
  }
}

// zh.json
{
  "tour": {
    "details": {
      "title": "旅游详情",
      "duration": "时长"
    }
  }
}
```

### Updating Database Schema

1. Update TypeScript interface in `src/lib/types/`
2. Update service functions to handle new fields
3. Create migration script if needed (in `scripts/`)
4. Test with existing data

---

## 🧪 Testing & Quality

### Type Checking

```bash
npm run check        # One-time check
npm run check:watch  # Watch mode
```

### Code Formatting

```bash
npm run format       # Format all files
npm run format:check # Check formatting without changes
```

### Prettier Configuration

Located in `.prettierrc`:
- Uses Prettier plugin for Svelte
- Consistent formatting across team

### Pre-deployment Checklist

- [ ] Run `npm run check` - no TypeScript errors
- [ ] Run `npm run format:check` - code is formatted
- [ ] Test all new features in browser
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify translations in all supported languages
- [ ] Test with production-like `.env` variables
- [ ] Run `npm run build` successfully

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `.svelte-kit` directory with production-ready files.

### Preview Production Build

```bash
npm run preview
```

### Deployment Targets

The project uses `@sveltejs/adapter-auto`, which automatically detects:
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- **AWS Amplify**
- **Azure Static Web Apps**
- **Node.js servers**

### Environment Variables in Production

Ensure all environment variables from `.env` are configured in your deployment platform:
- MongoDB connection string
- AWS credentials (S3, SNS, Translate)
- Node environment setting

### Database Considerations

- **Connection pooling**: MongoDB client reuses connections (see `getDB()`)
- **Indexes**: Create indexes for frequently queried fields:
  - `tours.isActive`
  - `tours.featured`
  - `tours.destination`
  - `users.username` (unique)
  - `users.email` (unique)

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

1. **Always check types**: This project uses strict TypeScript. Ensure all code is properly typed.

2. **Use existing patterns**: Follow the service layer pattern. Don't put business logic in route handlers.

3. **Maintain i18n**: When adding UI text, add translations to ALL language files, not just English.

4. **Preserve component structure**: Follow Atomic Design principles. Don't create components in wrong directories.

5. **Test MongoDB queries**: When adding database operations, consider edge cases (empty results, invalid IDs, etc.).

6. **S3 URL handling**: Images are stored on S3. Always use full URLs, not relative paths.

7. **Authentication awareness**: Remember `/agent/*` routes require authentication. Don't expose sensitive operations publicly.

8. **Environment variables**: Never hardcode credentials. Always use `env` from `$env/dynamic/private`.

9. **Responsive design**: All new UI must work on mobile, tablet, and desktop. Use Tailwind responsive classes.

10. **Error handling**: Always handle errors gracefully. Return meaningful error messages to users.

### Code Review Checklist

When reviewing or generating code, verify:

- ✅ TypeScript types are correct and complete
- ✅ No `any` types (unless absolutely necessary)
- ✅ Proper error handling (try/catch, null checks)
- ✅ Translations added for all UI text
- ✅ Responsive design (mobile-first)
- ✅ Follows existing naming conventions
- ✅ Uses service layer (no business logic in routes)
- ✅ Proper imports (use `$lib` alias)
- ✅ Security considerations (auth, input validation)
- ✅ Consistent with existing code style

### Common Pitfalls to Avoid

1. **Don't import server code in client components**
   ```typescript
   // ❌ Bad - in a .svelte component
   import { getDB } from '$lib/server/db';

   // ✅ Good - use API route
   const response = await fetch('/api/tours');
   ```

2. **Don't skip error handling**
   ```typescript
   // ❌ Bad
   const tour = await getTourById(id);

   // ✅ Good
   const tour = await getTourById(id);
   if (!tour) {
     return json({ success: false, error: 'Not found' }, { status: 404 });
   }
   ```

3. **Don't forget mobile users**
   ```svelte
   <!-- ❌ Bad -->
   <div class="text-4xl">

   <!-- ✅ Good -->
   <div class="text-2xl md:text-4xl">
   ```

4. **Don't hardcode text in components**
   ```svelte
   <!-- ❌ Bad -->
   <h1>Tours</h1>

   <!-- ✅ Good -->
   <h1>{$t('tours.title')}</h1>
   ```

### Helpful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run check:watch      # Watch TypeScript errors

# Quality
npm run check            # Type check
npm run format           # Auto-format code

# Build
npm run build            # Production build
npm run preview          # Preview build

# Database
node scripts/create-admin.js      # Create admin user

# Debugging
# Check environment variables
curl http://localhost:5173/api/debug
```

---

## 📚 Additional Resources

- **SvelteKit Docs**: https://kit.svelte.dev/docs
- **Svelte 5 Docs**: https://svelte.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MongoDB Node Driver**: https://mongodb.github.io/node-mongodb-native/
- **AWS SDK for JavaScript**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- **Tiptap Editor**: https://tiptap.dev/docs

### Project-specific Documentation

- `AWS_TRANSLATE_SETUP.md` - AWS Translate configuration guide
- `TRANSLATION_SETUP.md` - Translation feature documentation
- `README.md` - Basic project setup and commands

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: MongoDB connection fails
**Solution**: Check `MONGODB_URI` in `.env`, ensure MongoDB is running, verify network access

**Issue**: Images not uploading to S3
**Solution**: Verify AWS credentials in `.env`, check S3 bucket permissions, ensure bucket exists

**Issue**: Translations not working
**Solution**: Check translation files exist for all languages, verify `locale` store is set, check browser console for errors

**Issue**: TypeScript errors after pulling changes
**Solution**: Run `npm run prepare` to sync SvelteKit types, check `node_modules` is up to date

**Issue**: 403 error on `/agent` routes
**Solution**: User not authenticated, check login status, verify session cookies

---

## 📝 Notes

- **Default language**: Chinese (zh) - most content is created in Chinese first
- **Caching**: MongoDB connection is cached across requests for performance
- **File uploads**: Large files (images) go directly to S3 via presigned URLs
- **Authentication**: Session-based (not JWT), stored in cookies
- **Styling**: Custom Chinese-inspired theme (red, jade green, gold)
- **Maps**: AmCharts used for China province visualization

---

**Last Updated**: 2025-11-17
**Maintainer**: Development Team
**Version**: 0.0.1
