/**
 * Hook for parsing and handling outfit URL parameters
 * Automatically adds outfit items to cart when URL contains outfit query param
 */

import { useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"
import { parseOutfitFromUrl, validateOutfitItems, getOutfitSizeLabel } from "@/lib/utils/outfit-parser"

export function useOutfitUrlParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem, items: cartItems } = useCart()

  const handleOutfitParam = useCallback(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Get outfit parameter from URL
    const outfitParam = searchParams?.get("outfit")

    if (!outfitParam) return

    // Parse outfit items from URL parameter
    const outfitItems = parseOutfitFromUrl(outfitParam)

    // Validate that we found valid items
    if (!validateOutfitItems(outfitItems)) {
      toast({
        title: "Invalid outfit",
        description: "No valid items found in outfit URL",
        variant: "destructive",
      })
      return
    }

    // Add items to cart
    const addedCount = outfitItems.length
    outfitItems.forEach((item) => {
      addItem(item)
    })

    // Show success toast with outfit size label
    const sizeLabel = getOutfitSizeLabel(addedCount)
    toast({
      title: `${sizeLabel} added to cart! 🎉`,
      description: `${addedCount} item${addedCount !== 1 ? "s" : ""} from your outfit have been added.`,
    })

    // Clean up URL parameters using history.replaceState
    // This prevents duplicate additions on page refresh
    const newUrl = window.location.pathname
    window.history.replaceState(
      { ...window.history.state },
      "",
      newUrl,
    )
  }, [searchParams, addItem])

  // Run effect only once on mount
  useEffect(() => {
    handleOutfitParam()
  }, [handleOutfitParam])
}
