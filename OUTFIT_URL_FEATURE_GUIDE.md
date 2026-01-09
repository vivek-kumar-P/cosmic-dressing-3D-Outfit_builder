# Outfit URL Parameter Feature - Implementation Guide

## Overview
This feature allows users to automatically add pre-configured outfit combinations to their cart via URL query parameters. When visiting `/cart?outfit=...`, the specified items are automatically added with a success toast notification.

## How It Works

### URL Format
```
/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans,shoes:white-sneakers
```

**Format Breakdown:**
- Parameter name: `outfit`
- Item pairs separated by commas: `item1:id1,item2:id2,item3:id3`
- Each pair: `category:product-id`
- The category part is optional and ignored (only product-id is used)

### Example URLs

**Simple outfit (2 items):**
```
/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans
```

**Complete outfit (4 items):**
```
/cart?outfit=shirt:white-basic-tee,pants:slim-black-jeans,shoes:black-sneakers,jacket:leather-jacket
```

**Single item:**
```
/cart?outfit=shirt:blue-basic-tee
```

## Available Products

The feature includes a hardcoded product map with the following items:

### Tops
- `red-basic-tee` - Basic Red T-Shirt ($29.99)
- `blue-basic-tee` - Basic Blue T-Shirt ($29.99)
- `black-basic-tee` - Basic Black T-Shirt ($29.99)
- `white-basic-tee` - Basic White T-Shirt ($29.99)

### Bottoms
- `slim-blue-jeans` - Slim Blue Jeans ($59.99)
- `slim-black-jeans` - Slim Black Jeans ($59.99)
- `straight-black-jeans` - Straight Black Jeans ($64.99)

### Shoes
- `white-sneakers` - White Sneakers ($79.99)
- `black-sneakers` - Black Sneakers ($79.99)

### Outerwear
- `leather-jacket` - Black Leather Jacket ($149.99)
- `denim-jacket` - Blue Denim Jacket ($89.99)

### Dresses
- `summer-dress` - Summer Floral Dress ($74.99)

## Implementation Details

### Files Created/Modified

1. **`lib/utils/outfit-parser.ts`** (NEW)
   - `PRODUCT_MAP`: Hardcoded mapping of product IDs to CartItem objects
   - `parseOutfitFromUrl()`: Parses outfit query param string
   - `validateOutfitItems()`: Validates parsed items
   - `getOutfitSizeLabel()`: Returns friendly label based on item count

2. **`hooks/use-outfit-url-params.ts`** (NEW)
   - `useOutfitUrlParams()`: React hook that:
     - Runs once on component mount using `useEffect`
     - Parses outfit parameter from `useSearchParams()`
     - Adds items to cart via `useCart().addItem()`
     - Shows success toast notification
     - Cleans URL using `window.history.replaceState()`

3. **`components/cart/cart-page.tsx`** (MODIFIED)
   - Imported `useOutfitUrlParams` hook
   - Called hook in component body (runs on mount)

## How to Use

### In Your App
Simply navigate to the cart page with an outfit parameter:

```javascript
// Programmatically navigate
router.push('/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans')

// Or create a share link
const shareLink = 'https://cosmic-dressing-experience.vercel.app/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans,shoes:white-sneakers'
```

### User Experience Flow
1. User clicks a link or visits a URL with outfit params
2. Cart page loads
3. Hook automatically parses URL parameters
4. Items are added to cart
5. Success toast appears (e.g., "Complete Outfit added to cart! 🎉")
6. URL is cleaned via `history.replaceState()` to remove query params
7. Refreshing the page won't duplicate items (since params are cleaned)

## Advanced Usage

### Adding Custom Products
To add more products to the outfit map, edit `lib/utils/outfit-parser.ts`:

```typescript
export const PRODUCT_MAP: Record<string, Omit<CartItem, "quantity">> = {
  // ... existing items
  "my-custom-item": {
    id: 99,
    name: "My Custom Item",
    category: "Accessories",
    price: 49.99,
    color: "Gold",
    image: "/images/my-item.jpg",
    modelUrl: "/models/my-item.glb",
    description: "Custom item description",
  },
}
```

Then use it in URLs:
```
/cart?outfit=shirt:red-basic-tee,accessory:my-custom-item
```

### Changing Toast Messages
Modify the toast message in `hooks/use-outfit-url-params.ts`:

```typescript
toast({
  title: `${sizeLabel} added to cart! 🎉`,
  description: `${addedCount} item${addedCount !== 1 ? "s" : ""} from your outfit.`,
})
```

### URL Cleanup Behavior
The URL is cleaned automatically using:
```typescript
window.history.replaceState(
  { ...window.history.state },
  "",
  window.location.pathname, // Removes query params
)
```

This ensures:
- Outfit params are removed from URL after processing
- Refreshing the page won't re-add items
- Browser back button works correctly
- No duplicate additions

## Error Handling

The implementation handles several error cases:

1. **Invalid product IDs**: Non-existent products are silently skipped
2. **No valid items**: If no products match the outfit param, an error toast is shown
3. **Malformed URL**: Invalid formats are gracefully handled
4. **No outfit param**: If no outfit query param exists, nothing happens

## Testing

### Test URLs to Try

```
# Basic 2-item outfit
http://localhost:3000/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans

# Complete 4-item outfit
http://localhost:3000/cart?outfit=shirt:white-basic-tee,pants:slim-black-jeans,shoes:black-sneakers,jacket:denim-jacket

# Single item
http://localhost:3000/cart?outfit=shirt:blue-basic-tee

# Invalid item (should fail gracefully)
http://localhost:3000/cart?outfit=shirt:nonexistent-item

# Mixed valid and invalid
http://localhost:3000/cart?outfit=shirt:red-basic-tee,invalid:bad-item,pants:slim-blue-jeans
```

### Testing Checklist
- [ ] Navigate to `/cart?outfit=shirt:red-basic-tee,pants:slim-blue-jeans`
- [ ] Verify items appear in cart
- [ ] Verify success toast shows correct count
- [ ] Verify URL is cleaned (no `?outfit=` in URL after)
- [ ] Refresh page - items should NOT duplicate
- [ ] Try invalid product IDs - should show error
- [ ] Test single item outfit
- [ ] Test 4+ item outfit

## Code References

### Hook Import
```typescript
import { useOutfitUrlParams } from "@/hooks/use-outfit-url-params"
```

### Hook Usage (in "use client" component)
```typescript
export default function CartPage() {
  // ... other hooks
  useOutfitUrlParams()
  
  // ... rest of component
}
```

### Adding Custom Product
```typescript
import { PRODUCT_MAP } from "@/lib/utils/outfit-parser"

// To access a product:
const product = PRODUCT_MAP["red-basic-tee"]
```

## Benefits

✅ **No Page Reload**: Items added instantly without navigation
✅ **URL Shareable**: Users can share outfit links with friends
✅ **No Duplicates**: URL cleaned after processing prevents re-additions
✅ **Good UX**: Toast feedback confirms items were added
✅ **Flexible**: Easy to add more products to the map
✅ **Type-Safe**: Full TypeScript support with CartItem types
✅ **Performant**: Single useEffect on mount only
