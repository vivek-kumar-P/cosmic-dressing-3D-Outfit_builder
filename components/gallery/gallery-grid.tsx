"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingBag, Loader } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { getFashionCategoryLabel } from "@/lib/constants/fashion-taxonomy"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface GalleryGridProps {
  filters?: {
    category?: string[]
    style?: string[]
    priceRange?: [number, number]
    search?: string
    colors?: string[]
    seasons?: string[]
    occasions?: string[]
    fabrics?: string[]
    tags?: string[]
  }
}

const categoryImagePools: Record<string, string[]> = {
  tops: [
    "/images/curated-fashion-50/men-shirts-10/01_men-shirt_11100290.jpg",
    "/images/curated-fashion-50/men-shirts-10/03_men-shirt_11100293.jpg",
    "/images/curated-fashion-50/women-wear-products-50/18_shirts_14870714.jpg",
  ],
  bottoms: [
    "/images/curated-fashion-50/men-pants-10/01_men-pants_4109797.jpg",
    "/images/curated-fashion-50/men-pants-10/03_men-pants_6069087.jpg",
    "/images/curated-fashion-50/women-wear-products-50/12_pants_3927390.jpg",
  ],
  dresses: [
    "/images/curated-fashion-50/women-wear-products-50/35_full-kurtas_29138637.jpg",
    "/images/curated-fashion-50/women-wear-products-50/44_saaree_30592270.jpg",
    "/images/curated-fashion-50/women-wear-products-50/05_t-shirt_4440572.jpg",
  ],
  shoes: [
    "/images/curated-fashion-50/men-shoes-10/01_loafers_9992899.jpg",
    "/images/curated-fashion-50/men-shoes-10/03_brogue_6765524.jpg",
    "/images/curated-fashion-50/women-footwear-20/01_sandals_29096391.jpg",
  ],
  accessories: [
    "/images/curated-fashion-50/watches/25_watches_30799588.jpg",
    "/images/curated-fashion-50/sunglasses/41_sunglasses_29538714.jpg",
    "/images/curated-fashion-50/women-jewelry-30/13_earrings_4225085.jpg",
  ],
  "men-shoes": [
    "/images/curated-fashion-50/men-shoes-10/02_loafers_29258015.jpg",
    "/images/curated-fashion-50/men-shoes-10/04_formal-black_292999.jpg",
  ],
  "women-fashion": [
    "/images/curated-fashion-50/women-fashion/079_women-fashion_5050.jpg",
    "/images/curated-fashion-50/women-fashion/109_women-fashion_5114.jpg",
  ],
  "women-jewelry": [
    "/images/curated-fashion-50/women-jewelry-30/09_necklace_4295006.jpg",
    "/images/curated-fashion-50/women-jewelry-30/27_bracelet_14666597.jpg",
  ],
  sunglasses: [
    "/images/curated-fashion-50/sunglasses/44_sunglasses_31538078.jpg",
    "/images/curated-fashion-50/sunglasses/49_sunglasses_5202051.jpg",
  ],
  "men-marriage-wear": [
    "/images/curated-fashion-50/men-marriage-10/01_sherwani_36836731.jpg",
    "/images/curated-fashion-50/men-marriage-10/09_shirt-pant_30324809.jpg",
  ],
  default: [
    "/images/curated-fashion-50/fashion/07_fashion_20441555.jpg",
    "/images/curated-fashion-50/fashion/12_fashion_8945179.jpg",
    "/images/curated-fashion-50/fashion/22_fashion_23947090.jpg",
  ],
}

const getCardImage = (item: any, index: number) => {
  const existingImage = item.image_url || item.image || item.thumbnail || item.photo_url
  if (existingImage) {
    return existingImage
  }

  const categoryKey = String(item.category || "default").toLowerCase()
  const pool = categoryImagePools[categoryKey] || categoryImagePools.default
  return pool[index % pool.length]
}

const inferMeta = (item: any) => {
  const category = String(item.category || "").toLowerCase()
  const style = String(item.style || "casual").toLowerCase()
  const existingTags = Array.isArray(item.tags) ? item.tags.map((tag: string) => String(tag).toLowerCase()) : []
  const existingColors = Array.isArray(item.colors) ? item.colors.map((color: string) => String(color).toLowerCase()) : []

  return {
    colors: existingColors.length > 0 ? existingColors : [category.includes("shoe") ? "black" : "white"],
    seasons: item.season ? [String(item.season).toLowerCase()] : [style === "formal" ? "winter" : "summer"],
    occasions: item.occasion ? [String(item.occasion).toLowerCase()] : [style],
    fabrics: item.fabric ? [String(item.fabric).toLowerCase()] : [style === "formal" ? "silk" : "cotton"],
    tags: existingTags.length > 0 ? existingTags : [item.is_new ? "new" : "minimal", style],
  }
}

const matchesAny = (source: string[] | undefined, target: string[] | undefined) => {
  if (!target || target.length === 0) {
    return true
  }

  if (!source || source.length === 0) {
    return false
  }

  return target.some((value) => source.includes(value))
}

const applyGalleryFilters = (items: any[], filters?: GalleryGridProps["filters"]) => {
  if (!filters) {
    return items
  }

  return items.filter((item) => {
    const meta = inferMeta(item)

    const categoryMatch = !filters.category || filters.category.length === 0 || filters.category.includes(String(item.category))
    const styleMatch = !filters.style || filters.style.length === 0 || filters.style.includes(String(item.style))
    const priceMatch = !filters.priceRange || (item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1])
    const searchMatch =
      !filters.search ||
      String(item.name).toLowerCase().includes(filters.search.toLowerCase()) ||
      String(item.category).toLowerCase().includes(filters.search.toLowerCase()) ||
      String(item.style || "").toLowerCase().includes(filters.search.toLowerCase())

    return (
      categoryMatch &&
      styleMatch &&
      priceMatch &&
      searchMatch &&
      matchesAny(meta.colors, filters.colors) &&
      matchesAny(meta.seasons, filters.seasons) &&
      matchesAny(meta.occasions, filters.occasions) &&
      matchesAny(meta.fabrics, filters.fabrics) &&
      matchesAny(meta.tags, filters.tags)
    )
  })
}

export default function GalleryGrid({ filters }: GalleryGridProps) {
  const { user } = useAuth()
  const gridRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<string>("newest")
  const prevFiltersRef = useRef<typeof filters>()

  // Sample fallback products with 3D models
  const fallbackProducts = [
    {
      id: "fb-1",
      name: "Classic White T-Shirt",
      price: 29.99,
      category: "tops",
      style: "casual",
      is_new: true,
      model_url: "/models/tshirt_white.glb",
    },
    {
      id: "fb-2",
      name: "Black Denim Jeans",
      price: 59.99,
      category: "bottoms",
      style: "casual",
      is_new: false,
      model_url: "/models/jeans_black.glb",
    },
    {
      id: "fb-3",
      name: "Leather Jacket",
      price: 199.99,
      category: "tops",
      style: "streetwear",
      is_new: true,
      model_url: "/models/jacket_leather.glb",
    },
    {
      id: "fb-4",
      name: "Running Shoes",
      price: 89.99,
      category: "shoes",
      style: "activewear",
      is_new: false,
      model_url: "/models/shoes_running.glb",
    },
    {
      id: "fb-5",
      name: "Summer Dress",
      price: 79.99,
      category: "tops",
      style: "casual",
      is_new: true,
      model_url: "/models/dress_summer.glb",
    },
    {
      id: "fb-6",
      name: "Formal Suit",
      price: 299.99,
      category: "men-marriage-wear",
      style: "formal",
      is_new: false,
      model_url: "/models/suit_formal.glb",
    },
    {
      id: "fb-7",
      name: "Winter Coat",
      price: 149.99,
      category: "women-fashion",
      style: "casual",
      is_new: false,
      model_url: "/models/coat_winter.glb",
    },
    {
      id: "fb-8",
      name: "Casual Sneakers",
      price: 69.99,
      category: "shoes",
      style: "casual",
      is_new: true,
      model_url: "/models/sneakers_casual.glb",
    },
    {
      id: "fb-9",
      name: "Silver Necklace",
      price: 49.99,
      category: "women-jewelry",
      style: "formal",
      is_new: false,
      model_url: "/models/necklace_silver.glb",
    },
    {
      id: "fb-10",
      name: "Baseball Cap",
      price: 24.99,
      category: "accessories",
      style: "casual",
      is_new: true,
      model_url: "/models/cap_baseball.glb",
    },
    {
      id: "fb-11",
      name: "Yoga Pants",
      price: 54.99,
      category: "bottoms",
      style: "activewear",
      is_new: false,
      model_url: "/models/pants_yoga.glb",
    },
    {
      id: "fb-12",
      name: "Designer Sunglasses",
      price: 129.99,
      category: "sunglasses",
      style: "streetwear",
      is_new: true,
      model_url: "/models/sunglasses_designer.glb",
    },
    {
      id: "fb-13",
      name: "Formal Dress Shoes",
      price: 119.99,
      category: "men-shoes",
      style: "formal",
      is_new: false,
      model_url: "/models/shoes_formal.glb",
    },
    {
      id: "fb-14",
      name: "Wool Sweater",
      price: 79.99,
      category: "tops",
      style: "casual",
      is_new: false,
      model_url: "/models/sweater_wool.glb",
    },
    {
      id: "fb-15",
      name: "Leather Belt",
      price: 39.99,
      category: "accessories",
      style: "formal",
      is_new: true,
      model_url: "/models/belt_leather.glb",
    },
  ]

  // Memoize the fetchProducts function to avoid recreating it on every render
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)

    try {
      let query = supabase.from("products").select("*")

      // Apply filters
      if (filters) {
        if (filters.category && filters.category.length > 0) {
          query = query.in("category", filters.category)
        }

        if (filters.style && filters.style.length > 0) {
          query = query.in("style", filters.style)
        }

        if (filters.priceRange) {
          query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1])
        }

        if (filters.search) {
          query = query.ilike("name", `%${filters.search}%`)
        }
      }

      // Apply sorting
      if (sortBy === "price-low-high") {
        query = query.order("price", { ascending: true })
      } else if (sortBy === "price-high-low") {
        query = query.order("price", { ascending: false })
      } else {
        // Default to newest
        query = query.order("created_at", { ascending: false })
      }

      // Apply pagination
      query = query.range((page - 1) * 12, page * 12 - 1)

      const { data, error } = await query

      if (error) throw error

      const filteredData = applyGalleryFilters(data || [], filters)

      setProducts(filteredData)
      setHasMore(Boolean(data && data.length === 12))
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error loading products",
        description: "There was a problem loading the products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, page, sortBy])

  // Fetch products when filters, page, or sortBy change
  useEffect(() => {
    // Check if filters have actually changed to avoid unnecessary fetches
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)

    if (filtersChanged || prevFiltersRef.current === undefined) {
      // Reset to page 1 when filters change
      if (filtersChanged && page !== 1) {
        setPage(1)
        return // The page change will trigger another useEffect call
      }

      fetchProducts()
      prevFiltersRef.current = filters
    }
  }, [filters, page, sortBy, fetchProducts])

  // Fetch user favorites
  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", user.id)

        if (error) throw error

        setFavorites(data.map((fav) => fav.product_id))
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
  }, [user])

  // GSAP animations
  useEffect(() => {
    if (!gridRef.current || isLoading || products.length === 0) return

    // Clear existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // Grid items animation
    gsap.from(".gallery-item", {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      // Clean up ScrollTriggers when component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isLoading, products])

  // Toggle favorite
  const toggleFavorite = async (productId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      })
      return
    }

    try {
      if (favorites.includes(productId)) {
        // Remove from favorites
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)

        setFavorites(favorites.filter((id) => id !== productId))
      } else {
        // Add to favorites
        await supabase.from("favorites").insert({
          user_id: user.id,
          product_id: productId,
        })

        setFavorites([...favorites, productId])
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "There was a problem updating your favorites",
        variant: "destructive",
      })
    }
  }

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    setPage(1) // Reset to first page when sorting changes
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Curated Results</h2>
          <p className="text-zinc-400">Showing {products.length} matching items</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="bg-[#121212] border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-[#00C4B4]" />
        </div>
      ) : products.length === 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Suggested Gallery Items</h2>
              <p className="text-zinc-400">Showing curated samples while your filters load no matches</p>
            </div>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackProducts.map((item, index) => (
              <Card
                key={item.id}
                className="gallery-item bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg overflow-hidden group"
              >
                <div className="relative h-[350px] overflow-hidden">
                  <img
                    src={getCardImage(item, index)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {item.is_new && <Badge className="absolute top-3 left-3 bg-[#00C4B4] text-black">New</Badge>}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-white text-white hover:bg-white/20"
                    >
                      <Link href={`/outfit-picker?item=${item.id}`}>
                        <Eye className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-white text-white hover:bg-white/20"
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-[#00C4B4] font-bold">${item.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      {getFashionCategoryLabel(item.category)}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      {item.style.charAt(0).toUpperCase() + item.style.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item, index) => (
            <Card
              key={item.id}
              className="gallery-item bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg overflow-hidden group"
            >
              <div className="relative h-[350px] overflow-hidden">
                <img
                  src={getCardImage(item, index)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {item.is_new && <Badge className="absolute top-3 left-3 bg-[#00C4B4] text-black">New</Badge>}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-white text-white hover:bg-white/20"
                  >
                    <Link href={`/outfit-picker?item=${item.id}`}>
                      <Eye className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 rounded-full ${
                      favorites.includes(item.id)
                        ? "bg-[#00C4B4]/20 border-[#00C4B4] text-[#00C4B4]"
                        : "border-white text-white hover:bg-white/20"
                    }`}
                    onClick={(e) => toggleFavorite(item.id, e)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className="text-[#00C4B4] font-bold">${item.price}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                    {getFashionCategoryLabel(item.category)}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                    {item.style.charAt(0).toUpperCase() + item.style.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="border-[#00C4B4] text-[#00C4B4] hover:bg-[#00C4B4]/10"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
