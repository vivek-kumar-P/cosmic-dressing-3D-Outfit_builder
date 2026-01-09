/**
 * Hook for loading 3D outfit data from localStorage
 * Automatically adds outfit items to cart when coming from 3D builder
 */

import { useEffect, useCallback } from "react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"

// Map 3D outfit item IDs to cart products
const OUTFIT_ITEM_MAP: Record<string, { name: string; category: string; price: number; image: string }> = {
  "default-body": {
    name: "Male Character Model",
    category: "Character",
    price: 0,
    image: "/placeholder.svg?height=300&width=300&text=Male+Body",
  },
  "woman-default": {
    name: "Female Character Model",
    category: "Character",
    price: 0,
    image: "/placeholder.svg?height=300&width=300&text=Female+Body",
  },
  "default-shirt": {
    name: "Classic Shirt",
    category: "Tops",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300&text=Classic+Shirt",
  },
  "ladies-turtle-neck": {
    name: "Ladies Turtle Neck T-Shirt",
    category: "Tops",
    price: 54.99,
    image: "/placeholder.svg?height=300&width=300&text=Turtle+Neck",
  },
  "ladies-full-shoes": {
    name: "Ladies Full Shoes",
    category: "Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300&text=Ladies+Shoes",
  },
  "printed-shoes-ladies": {
    name: "Printed Shoes for Ladies",
    category: "Shoes",
    price: 94.99,
    image: "/placeholder.svg?height=300&width=300&text=Printed+Shoes",
  },
  "ladies-black-pants": {
    name: "Ladies Black Pants",
    category: "Bottoms",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300&text=Black+Pants",
  },
  "leather-dress-ladies": {
    name: "Leather Full Dress",
    category: "Dresses",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300&text=Leather+Dress",
  },
  "default-pants": {
    name: "Classic Pants",
    category: "Bottoms",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300&text=Classic+Pants",
  },
  "default-shoes": {
    name: "Classic Shoes",
    category: "Shoes",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300&text=Classic+Shoes",
  },
}

interface OutfitData {
  character?: string
  shirt?: string | null
  pants?: string | null
  shoes?: string | null
  accessories?: string | null
  colors?: {
    shirt?: string
    pants?: string
    shoes?: string
  }
  urls?: {
    body?: string
    shirt?: string
    pants?: string
    shoes?: string
  }
  timestamp?: string
}

export function use3DOutfitLoader() {
  const { addItem } = useCart()

  const loadOutfitFromStorage = useCallback(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Get outfit data from localStorage
    const outfitDataStr = localStorage.getItem("selectedOutfit")
    if (!outfitDataStr) return

    try {
      const outfitData: OutfitData = JSON.parse(outfitDataStr)
      console.log("[Cart] Loading 3D outfit:", outfitData)

      const itemsToAdd: Array<{ id: string; name: string; category: string; price: number; color: string; image: string }> = []

      // Map outfit items to cart products
      if (outfitData.shirt && outfitData.shirt !== null) {
        const shirtInfo = OUTFIT_ITEM_MAP[outfitData.shirt]
        if (shirtInfo) {
          itemsToAdd.push({
            id: outfitData.shirt,
            ...shirtInfo,
            color: outfitData.colors?.shirt || "#4a90e2",
          })
        }
      }

      if (outfitData.pants && outfitData.pants !== null) {
        const pantsInfo = OUTFIT_ITEM_MAP[outfitData.pants]
        if (pantsInfo) {
          itemsToAdd.push({
            id: outfitData.pants,
            ...pantsInfo,
            color: outfitData.colors?.pants || "#34495e",
          })
        }
      }

      if (outfitData.shoes && outfitData.shoes !== null) {
        const shoesInfo = OUTFIT_ITEM_MAP[outfitData.shoes]
        if (shoesInfo) {
          itemsToAdd.push({
            id: outfitData.shoes,
            ...shoesInfo,
            color: outfitData.colors?.shoes || "#2c3e50",
          })
        }
      }

      // Add items to cart
      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach((item) => {
          addItem({
            id: Math.random() * 100000, // Generate unique ID
            name: item.name,
            category: item.category,
            price: item.price,
            color: item.color,
            image: item.image,
            modelUrl: "/models/outfit.glb",
          })
        })

        // Show success toast
        toast({
          title: "3D Outfit added to cart! 🎉",
          description: `${itemsToAdd.length} item${itemsToAdd.length !== 1 ? "s" : ""} from your custom outfit.`,
        })

        // Clear localStorage to prevent duplicate additions
        localStorage.removeItem("selectedOutfit")
      } else {
        // No items found, clear storage anyway
        localStorage.removeItem("selectedOutfit")
      }
    } catch (error) {
      console.error("[Cart] Error loading outfit data:", error)
      localStorage.removeItem("selectedOutfit")
      toast({
        title: "Error loading outfit",
        description: "Could not load your 3D outfit. Please try again.",
        variant: "destructive",
      })
    }
  }, [addItem])

  // Run effect only once on mount
  useEffect(() => {
    loadOutfitFromStorage()
  }, [loadOutfitFromStorage])
}
