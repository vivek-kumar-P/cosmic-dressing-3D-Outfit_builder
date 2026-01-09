/**
 * Outfit Parser Utility
 * Maps outfit item identifiers to actual CartItem products
 */

import type { CartItem } from "@/contexts/cart-context"

// Hardcoded product map - maps item ID/slugs to product data
export const PRODUCT_MAP: Record<string, Omit<CartItem, "quantity">> = {
  "red-basic-tee": {
    id: 1,
    name: "Basic Red T-Shirt",
    category: "Tops",
    price: 29.99,
    color: "Red",
    image: "/placeholder.svg?height=300&width=300&text=Red+Tee",
    modelUrl: "/models/tee.glb",
    description: "Classic red cotton t-shirt",
  },
  "blue-basic-tee": {
    id: 2,
    name: "Basic Blue T-Shirt",
    category: "Tops",
    price: 29.99,
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Blue+Tee",
    modelUrl: "/models/tee.glb",
    description: "Classic blue cotton t-shirt",
  },
  "black-basic-tee": {
    id: 3,
    name: "Basic Black T-Shirt",
    category: "Tops",
    price: 29.99,
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Black+Tee",
    modelUrl: "/models/tee.glb",
    description: "Classic black cotton t-shirt",
  },
  "white-basic-tee": {
    id: 4,
    name: "Basic White T-Shirt",
    category: "Tops",
    price: 29.99,
    color: "White",
    image: "/placeholder.svg?height=300&width=300&text=White+Tee",
    modelUrl: "/models/tee.glb",
    description: "Classic white cotton t-shirt",
  },
  "slim-blue-jeans": {
    id: 5,
    name: "Slim Blue Jeans",
    category: "Bottoms",
    price: 59.99,
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Slim+Jeans",
    modelUrl: "/models/jeans.glb",
    description: "Classic slim-fit blue denim jeans",
  },
  "slim-black-jeans": {
    id: 6,
    name: "Slim Black Jeans",
    category: "Bottoms",
    price: 59.99,
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Black+Jeans",
    modelUrl: "/models/jeans.glb",
    description: "Classic slim-fit black denim jeans",
  },
  "straight-black-jeans": {
    id: 7,
    name: "Straight Black Jeans",
    category: "Bottoms",
    price: 64.99,
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Straight+Jeans",
    modelUrl: "/models/jeans.glb",
    description: "Classic straight-fit black denim jeans",
  },
  "white-sneakers": {
    id: 8,
    name: "White Sneakers",
    category: "Shoes",
    price: 79.99,
    color: "White",
    image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
    modelUrl: "/models/sneakers.glb",
    description: "Comfortable white canvas sneakers",
  },
  "black-sneakers": {
    id: 9,
    name: "Black Sneakers",
    category: "Shoes",
    price: 79.99,
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Black+Sneakers",
    modelUrl: "/models/sneakers.glb",
    description: "Comfortable black canvas sneakers",
  },
  "leather-jacket": {
    id: 10,
    name: "Black Leather Jacket",
    category: "Outerwear",
    price: 149.99,
    color: "Black",
    image: "/placeholder.svg?height=300&width=300&text=Leather+Jacket",
    modelUrl: "/models/jacket.glb",
    description: "Classic black leather jacket",
  },
  "denim-jacket": {
    id: 11,
    name: "Blue Denim Jacket",
    category: "Outerwear",
    price: 89.99,
    color: "Blue",
    image: "/placeholder.svg?height=300&width=300&text=Denim+Jacket",
    modelUrl: "/models/jacket.glb",
    description: "Classic blue denim jacket",
  },
  "summer-dress": {
    id: 12,
    name: "Summer Floral Dress",
    category: "Dresses",
    price: 74.99,
    color: "Multi",
    image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
    modelUrl: "/models/dress.glb",
    description: "Light and airy floral summer dress",
  },
}

/**
 * Parses outfit query parameter from URL
 * Format: "shirt:red-basic-tee,pants:slim-blue-jeans"
 * Returns array of CartItems
 */
export function parseOutfitFromUrl(outfitParam: string): Omit<CartItem, "quantity">[] {
  if (!outfitParam || typeof outfitParam !== "string") {
    return []
  }

  const items: Omit<CartItem, "quantity">[] = []

  // Split by comma to get individual item pairs
  const itemPairs = outfitParam.split(",")

  for (const pair of itemPairs) {
    // Split by colon to get key and value
    const [, itemId] = pair.split(":")
    
    if (!itemId) continue

    // Trim whitespace
    const trimmedId = itemId.trim()

    // Look up item in product map
    const product = PRODUCT_MAP[trimmedId]
    if (product) {
      items.push(product)
    }
  }

  return items
}

/**
 * Validates that all items in the outfit exist in the product map
 */
export function validateOutfitItems(items: Omit<CartItem, "quantity">[]): boolean {
  return items.length > 0
}

/**
 * Gets a friendly display name for an outfit size
 * Used for showing how many items were added
 */
export function getOutfitSizeLabel(itemCount: number): string {
  if (itemCount === 0) return "Empty"
  if (itemCount === 1) return "Single Item"
  if (itemCount <= 3) return "Small Outfit"
  if (itemCount <= 5) return "Complete Outfit"
  return "Premium Outfit"
}
