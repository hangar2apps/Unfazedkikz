# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unfazed Kikz LLC - A high-performance shoe dropshipping website where sales are made through email.

**Business Website**: unfazed-kikz.com
**Business Email**: unfazedkikz@gmail.com
**Motto**: "We don't do release dates"

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Run data migration (one-time only)
node migrate.js
```

## Architecture (Phase 2 - Optimized)

### Frontend (React)
- **Router**: Uses `react-router-dom` with two main routes:
  - `/` - Home page (public shoe catalog with lazy-loading)
  - `/upload` - Admin interface for managing shoes

- **State Management**: Hierarchical lazy-loading pattern
  - App.js: Fetches only brands on startup (~20 items)
  - Home.js: Accordion UI for brand/line/shoe navigation
  - BrandAccordion.js: Lazy-loads lines when brand expanded
  - LineAccordion.js: Lazy-loads shoes when line expanded + virtual scrolling for 50+ items

### Backend (Netlify Functions)

Located in `functions/` directory with `.mjs` extension. All functions use Supabase for metadata and Netlify Blobs for image storage.

**Core Functions:**

- **getBrands.mjs**: Returns all brands (initial page load)
- **getLinesByBrand.mjs**: Returns lines for a specific brand
- **getShoesByLine.mjs**: Returns shoes for a specific line (with lazy loading)
- **getShoes.mjs**: Legacy endpoint - returns all shoes (used for backward compatibility)

**Admin Functions:**

- **upload.mjs**:
  - Accepts: shoeBrand, shoeLine, shoeModel, imageData (base64)
  - Optimizes image to WebP (60-70% size reduction) using Sharp
  - Uploads to `shoe-images` Netlify Blobs store
  - Creates brand/line in Supabase if not exists
  - Stores metadata with image URL

- **delete.mjs**: Removes shoes from both Supabase and Netlify Blobs

### Database Schema (Supabase PostgreSQL)

```sql
brands (id, name, created_at)
  ↓ (one-to-many)
lines (id, brand_id, name, created_at)
  ↓ (one-to-many)
shoes (id, line_id, model, image_url, created_at)
```

**RLS Policies:**
- Public can SELECT (read)
- Authenticated can INSERT, UPDATE, DELETE (admin only)

### Data Storage

1. **Supabase**: Shoe hierarchy and metadata (brands → lines → shoes)
2. **Netlify Blobs**:
   - `shoes` store: Legacy data (old system, safe to delete after verification)
   - `shoe-images` store: Current production images

### Key Utilities

`src/utils/utils.js`:
- `groupShoesByBrandAndLine(shoes)`: Legacy function - still in codebase but not used in Phase 2

## Performance Optimizations

1. **Lazy Loading**: Content loads only when user interacts
   - Initial load: ~20 brands (< 1 second)
   - Click brand: Lines load on demand
   - Click line: Shoes load on demand

2. **Image Optimization**:
   - WebP format with 80% quality
   - Max size 1200x1200px
   - Lazy loading attribute on img tags

3. **Virtual Scrolling**:
   - Automatically enabled for lines with 50+ shoes
   - Uses `react-window` library
   - Only renders visible items

4. **Browser Caching**: Netlify Blobs handles cache headers

## Deployment

Deployed on Netlify with:
- Framework: create-react-app
- Build: `npm run build`
- Functions: Netlify Functions (serverless)
- Database: Supabase (managed PostgreSQL)
- Storage: Netlify Blobs

## Environment Variables (Required)

### Development (.env.local)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NETLIFY_SITE_ID=your_site_id
NETLIFY_ACCESS_TOKEN=your_access_token
```

### Production (Netlify Environment Variables)
Same as above variables must be set in Netlify site settings.

## Dependencies

### Key Libraries
- `react-router-dom`: Client-side routing
- `@supabase/supabase-js`: Supabase client
- `@netlify/blobs`: File storage API
- `react-window`: Virtual scrolling (performance)
- `react-query`: Data fetching & caching (optional upgrade)
- `sharp`: Server-side image optimization
- `bootstrap`: UI framework
- `sweetalert2`: Alerts/modals

## Migration History

**Phase 1 (Old System):**
- Images stored on GitHub (backup)
- Metadata in Netlify Blobs (slow)
- All data loaded upfront
- ~80-150ms initial page load

**Phase 2 (Current):**
- Images in Netlify Blobs (optimized)
- Metadata in Supabase (fast queries)
- Lazy-loaded on demand
- ~300-500ms initial page load (but instant rendering, content loads as needed)
- Much better perceived performance

## Testing Checklist

- [ ] Home page loads and shows brands quickly
- [ ] Click a brand - lines appear
- [ ] Click a line - shoes with images appear
- [ ] Upload a new shoe - appears in correct brand/line
- [ ] Delete a shoe - removed from all stores
- [ ] Images load fast from Netlify Blobs
- [ ] Upload page shows correct brands in dropdown

## Notes for Future Development

1. **Adding React Query**: Uncomment lines in App.js to add caching layer
2. **Optimization**: Consider database indexing if queries slow down with 5000+ items
3. **Authentication**: Upload/delete are currently public - add auth if needed
4. **Analytics**: Supabase has built-in analytics for database queries
5. **Scaling**: With current setup, supports up to 50k+ shoes efficiently
