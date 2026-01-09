# 3D Outfit Builder Integration Guide

## Overview
This guide documents the integration of the standalone 3D outfit builder (from the `/human` folder) into the main Next.js e-commerce app.

## Integration Summary

### New Route Created
- **URL**: `/3d-preview`
- **File**: `app/3d-preview/page.tsx`
- **Purpose**: Hosts the 3D outfit builder as a seamless part of the main app

### Key Files Created/Modified

#### 1. **app/3d-preview/page.tsx** (NEW)
Main route page that loads the 3D builder with proper SSR handling:
- Uses `dynamic` import to avoid SSR issues with Three.js
- Shows loading spinner while 3D environment initializes
- Full-screen layout for immersive 3D experience

#### 2. **components/3d-builder/outfit-builder-3d.tsx** (NEW)
Core 3D builder component that:
- Imports components from `/human` folder (Scene, CategorySidebar, PlaygroundPanel)
- Manages 3D model state (body, shirt, pants, shoes)
- Handles color changes and model visibility
- **Modified `handleSaveOutfit()`** to save outfit data to localStorage and redirect to cart

#### 3. **hooks/use-3d-outfit-loader.ts** (NEW)
React hook for cart integration:
- Runs on cart page mount
- Reads outfit data from `localStorage.getItem("selectedOutfit")`
- Maps 3D outfit items to cart products using `OUTFIT_ITEM_MAP`
- Automatically adds items to cart
- Shows success toast
- Clears localStorage to prevent duplicates

#### 4. **components/cart/cart-page.tsx** (MODIFIED)
Updated to call the new hook:
```tsx
import { use3DOutfitLoader } from "@/hooks/use-3d-outfit-loader"

export default function CartPage() {
  // ... existing code
  use3DOutfitLoader() // Loads 3D outfit on mount
  // ... rest of component
}
```

#### 5. **components/navbar.tsx** (MODIFIED)
Added navigation link to 3D builder:
```tsx
{ href: "/3d-preview", label: "3D Builder", icon: <Palette className="h-4 w-4 mr-2" /> }
```

## How It Works

### User Flow
1. User navigates to `/3d-preview` from navbar or direct link
2. 3D outfit builder loads with default male/female body model
3. User customizes outfit:
   - Select character (male/female body)
   - Add shirt, pants, shoes
   - Change colors for each item
   - Adjust model sizes and lighting
   - Animate the character
4. User clicks "Add to Cart" button
5. Outfit data is saved to `localStorage` as JSON:
   ```json
   {
     "character": "default-body",
     "shirt": "ladies-turtle-neck",
     "pants": "ladies-black-pants",
     "shoes": "ladies-full-shoes",
     "colors": {
       "shirt": "#ffffff",
       "pants": "#000000",
       "shoes": "#2c3e50"
     },
     "urls": {
       "body": "https://...",
       "shirt": "https://...",
       "pants": "https://...",
       "shoes": "https://..."
     },
     "timestamp": "2026-01-09T..."
   }
   ```
6. Browser redirects to `/cart`
7. Cart page loads and `use3DOutfitLoader` hook:
   - Reads outfit data from localStorage
   - Maps item IDs to products (e.g., "ladies-turtle-neck" → "Ladies Turtle Neck T-Shirt $54.99")
   - Adds each item to cart using existing `addItem()` function
   - Shows toast: "3D Outfit added to cart! 🎉"
   - Clears localStorage
8. User sees outfit items in cart ready for checkout

### Data Flow Diagram
```
3D Builder                localStorage              Cart Page
┌─────────┐              ┌───────────┐            ┌──────────┐
│         │              │           │            │          │
│ Customize├──save──────►│selectedOu │            │          │
│ Outfit  │              │tfit JSON  │            │          │
│         │              │           │            │          │
│ Click   │              │           │            │          │
│ Add to  ├──redirect───►│           ├──read─────►│ Load &   │
│ Cart    │              │           │            │ Parse    │
└─────────┘              │           │            │          │
                         │           │            │ Add Items│
                         │           │            │ to Cart  │
                         │           │◄──clear────┤          │
                         └───────────┘            └──────────┘
```

## Product Mapping

The 3D builder uses specific item IDs that are mapped to cart products:

| 3D Item ID | Cart Product | Category | Price |
|------------|--------------|----------|-------|
| `default-body` | Male Character Model | Character | $0 |
| `woman-default` | Female Character Model | Character | $0 |
| `default-shirt` | Classic Shirt | Tops | $49.99 |
| `ladies-turtle-neck` | Ladies Turtle Neck T-Shirt | Tops | $54.99 |
| `ladies-full-shoes` | Ladies Full Shoes | Shoes | $89.99 |
| `printed-shoes-ladies` | Printed Shoes for Ladies | Shoes | $94.99 |
| `ladies-black-pants` | Ladies Black Pants | Bottoms | $69.99 |
| `leather-dress-ladies` | Leather Full Dress | Dresses | $129.99 |
| `default-pants` | Classic Pants | Bottoms | $59.99 |
| `default-shoes` | Classic Shoes | Shoes | $79.99 |

### Adding New Products

To add more 3D items to the product map, edit `hooks/use-3d-outfit-loader.ts`:

```typescript
const OUTFIT_ITEM_MAP: Record<string, { name: string; category: string; price: number; image: string }> = {
  // ... existing items
  "my-new-item": {
    name: "My New Item",
    category: "Accessories",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300&text=New+Item",
  },
}
```

Then add the item to the 3D builder's category sidebar (in `human/components/outfit-builder/category-sidebar.tsx`).

## Dependencies

### Already Installed in Root package.json
✅ `@react-three/fiber` - React renderer for Three.js  
✅ `@react-three/drei` - Helper components for Three.js  
✅ `three` - 3D graphics library  

All Three.js dependencies are already in the root project's `package.json`, so no additional installation is required.

## Asset Paths

### 3D Models
The 3D builder uses models hosted on Vercel Blob Storage:
- Body models: `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/...`
- Clothing models: Same CDN URLs
- No local asset path changes needed

### Images
Product images use Next.js placeholder format:
- `/placeholder.svg?height=300&width=300&text=...`
- These automatically work with Next.js image optimization

## Key Features

### ✅ Completed
- [x] New `/3d-preview` route integrated
- [x] Full 3D outfit builder with character customization
- [x] Add to Cart functionality saves to localStorage
- [x] Automatic redirect to /cart after adding
- [x] Cart page auto-loads outfit items
- [x] Product mapping for all 3D items
- [x] Success toast notifications
- [x] Prevents duplicate additions (clears localStorage)
- [x] Navigation link in navbar
- [x] SSR-safe dynamic import
- [x] Responsive mobile/desktop layout

### 🎨 Customization Available
- Character models (male/female bodies)
- Shirts, pants, shoes, dresses
- Color selection for each item
- Model scaling (size adjustments)
- Lighting controls
- Camera position/rotation
- Animations (if model has them)

### 🔧 Advanced Features
- **Model Upload**: Users can upload custom GLTF models (if enabled)
- **Asset Library**: Manage uploaded 3D models (requires Supabase setup)
- **Animations**: Play character animations with speed control
- **Reset**: Restore default body and clear all items

## Testing

### Test the Integration

1. **Start dev server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to 3D Builder**:
   - Click "3D Builder" in navbar
   - Or go to `http://localhost:3000/3d-preview`

3. **Customize an outfit**:
   - Select "Woman Default" or keep male body
   - Click items in left sidebar (e.g., "Ladies Turtle Neck T-Shirt")
   - Change colors using color pickers
   - Adjust sizes with sliders

4. **Add to Cart**:
   - Click "Add to Cart" button at bottom-right
   - Should see toast: "Outfit saved! 🎉"
   - Should redirect to `/cart`

5. **Verify cart**:
   - Should see toast: "3D Outfit added to cart! 🎉"
   - Should see 2-3 items in cart (depending on what you added)
   - Items should have correct names, prices, and colors

6. **Test no duplicates**:
   - Refresh `/cart` page
   - Items should NOT duplicate
   - (localStorage is cleared after loading)

### Expected Behavior Checklist
- [ ] 3D Builder loads without errors
- [ ] Can select different body models
- [ ] Can add/remove clothing items
- [ ] Can change colors
- [ ] "Add to Cart" shows success toast
- [ ] Redirects to /cart automatically
- [ ] Cart shows correct items with prices
- [ ] No duplicates on page refresh
- [ ] Mobile responsive (sidebar collapses)
- [ ] "Back to Home" button works

## Troubleshooting

### Issue: "Cannot find module '@react-three/fiber'"
**Solution**: Dependencies are in root package.json. Run:
```bash
pnpm install
# or
npm install
```

### Issue: 3D canvas is black/empty
**Solution**: 
- Check browser console for WebGL errors
- Ensure your browser supports WebGL 2.0
- Try a different browser (Chrome/Firefox recommended)

### Issue: Models don't load
**Solution**:
- Models are on Vercel CDN, check internet connection
- Check browser console for CORS errors
- Ensure Vercel Blob Storage URLs are accessible

### Issue: Add to Cart doesn't redirect
**Solution**:
- Check browser console for errors
- Ensure `useRouter` from `next/navigation` is working
- Try manually navigating to `/cart` to see if hook works

### Issue: Items not appearing in cart
**Solution**:
- Open browser DevTools → Application → Local Storage
- Check if `selectedOutfit` key exists after clicking Add to Cart
- Verify outfit data structure matches expected format
- Check console for `[Cart] Loading 3D outfit:` log

### Issue: Build errors about window/document
**Solution**:
- 3D builder uses `dynamic` import with `ssr: false`
- Ensure component is client-side only (`"use client"`)
- Don't import Three.js components directly in server components

## File Structure

```
cosmic-dress-uploaded-from-computer-on-13-10/
│
├── app/
│   ├── 3d-preview/
│   │   └── page.tsx                    # NEW: Main 3D builder route
│   └── cart/
│       └── page.tsx                    # Uses cart-page component
│
├── components/
│   ├── 3d-builder/
│   │   └── outfit-builder-3d.tsx       # NEW: 3D builder integration
│   ├── cart/
│   │   └── cart-page.tsx               # MODIFIED: Added use3DOutfitLoader hook
│   └── navbar.tsx                      # MODIFIED: Added 3D Builder link
│
├── hooks/
│   ├── use-3d-outfit-loader.ts         # NEW: Loads outfit from localStorage
│   └── use-outfit-url-params.ts        # Existing: URL params handler
│
├── human/                              # Standalone 3D app (not modified)
│   ├── components/
│   │   ├── 3d-viewer/
│   │   │   └── scene.tsx               # Used in outfit-builder-3d.tsx
│   │   └── outfit-builder/
│   │       ├── category-sidebar.tsx    # Used in outfit-builder-3d.tsx
│   │       └── playground-panel.tsx    # Used in outfit-builder-3d.tsx
│   ├── lib/
│   │   └── model-utils.ts              # Used for cache clearing
│   ├── types/
│   │   └── index.ts                    # LightPosition type
│   └── public/                         # 3D models (on CDN, not local)
│
└── package.json                        # Has Three.js dependencies
```

## Next Steps

### Optional Enhancements

1. **Add more 3D items**:
   - Accessories (hats, glasses, bags)
   - More clothing variations
   - Update `OUTFIT_ITEM_MAP` in `use-3d-outfit-loader.ts`

2. **Save outfits to database**:
   - Instead of localStorage, save to Supabase
   - Allow users to save multiple outfits
   - Implement "My Saved Outfits" page

3. **Share outfits via URL**:
   - Encode outfit data in URL params
   - Allow users to share links: `/3d-preview?outfit=...`
   - Pre-load outfit configuration from URL

4. **Add more character customization**:
   - Skin tones
   - Hair styles
   - Body proportions
   - Face customization

5. **Improve product matching**:
   - Fetch real products from database
   - Match 3D items to actual inventory
   - Show product availability

6. **Add outfit preview in cart**:
   - Show 3D thumbnail of outfit in cart
   - Allow editing outfit from cart
   - Re-open 3D builder with current outfit

## Support

For issues or questions:
- Check browser console for errors
- Review this guide's troubleshooting section
- Test with simple outfit (1-2 items) first
- Verify localStorage data structure

## Credits

- 3D Builder: Original app from `/human` folder (v0 generated)
- Integration: Custom integration layer for Next.js e-commerce app
- 3D Engine: Three.js via @react-three/fiber
- Models: Hosted on Vercel Blob Storage
