"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Eye, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getFashionCategoryLabel } from "@/lib/constants/fashion-taxonomy"
import { useFilters, DUMMY_PRODUCTS } from "@/hooks/useFilters.js"
import FilterSidebar from "@/components/filters/FilterSidebar"
import FilterDrawer from "@/components/filters/FilterDrawer"
import FilterPanel from "@/components/filters/FilterPanel.jsx"
import ProductDetailModal, { type ProductDetailItem } from "@/components/product-detail-modal"
import { useCart } from "@/contexts/cart-context"
import { useLikes } from "@/contexts/likes-context"
import { toast } from "@/hooks/use-toast"

type GalleryProduct = {
  id: number
  name: string
  brand: string
  category: string
  subcategory?: string
  price: number
  image: string
  isNew?: boolean
  modelUrl?: string
  description?: string
  color?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  stockCount?: number
  occasions?: string[]
  seasons?: string[]
  styleTags?: string[]
  material?: string
  fit?: string
  voiceDescription?: string
  gender?: string
  colors?: string[]
  sizes?: string[]
}

export default function GalleryPage() {
  const {
    filteredProducts,
    filters,
    filterOptions,
    priceBounds,
    activeChips,
    hasActiveFilters,
    toggleCategory,
    setSubcategory,
    setPriceRange,
    toggleRating,
    setInStockOnly,
    toggleBrand,
    toggleColor,
    toggleSize,
    clearAll,
    removeActiveChip,
  } = useFilters()
  const { addItem } = useCart()
  const { addLike, removeLike, isLiked } = useLikes()

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const galleryProducts = filteredProducts as GalleryProduct[]
  const visibleProducts = galleryProducts.slice(0, visibleCount)
  const subcategoriesByCategory = (filterOptions.subcategoriesByCategory || {}) as Record<string, string[]>
  const selectedCategory = filters.categories[0] || ""
  const categorySubcategories: string[] = selectedCategory ? subcategoriesByCategory[selectedCategory] || [] : []

  const openProductDetails = (product: GalleryProduct) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      modelUrl: product.modelUrl,
      color: product.color || product.colors?.[0] || "#00c4b4",
      description: product.description,
      brand: product.brand,
      gender: product.gender,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      stockCount: product.stockCount,
      occasions: product.occasions,
      seasons: product.seasons,
      styleTags: product.styleTags,
      material: product.material,
      fit: product.fit,
      voiceDescription: product.voiceDescription,
    })
    setIsDetailOpen(true)
  }

  const suggestedProducts = selectedProduct
    ? DUMMY_PRODUCTS.filter(
        (product) => product.id !== selectedProduct.id && product.category === selectedProduct.category,
      )
        .slice(0, 3)
        .map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          color: product.colors?.[0] || "#00c4b4",
          description: product.description,
          brand: product.brand,
          gender: product.gender,
          rating: product.rating,
          reviews: product.reviews,
          inStock: product.inStock,
          stockCount: product.stockCount,
          occasions: product.occasions,
          seasons: product.seasons,
          styleTags: product.styleTags,
          material: product.material,
          fit: product.fit,
          voiceDescription: product.voiceDescription,
        }))
    : []

  useEffect(() => {
    gsap.fromTo(
      ".gallery-header",
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform" },
    )
    gsap.fromTo(
      ".gallery-content",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.2, clearProps: "transform" },
    )
  }, [])

  useEffect(() => {
    setVisibleCount(12)
    setIsLoadingMore(false)
  }, [filteredProducts])

  useEffect(() => {
    const sentinelNode = sentinelRef.current

    if (!sentinelNode) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry.isIntersecting &&
          !isLoadingMore &&
          visibleCount < galleryProducts.length
        ) {
          setIsLoadingMore(true)
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 12, galleryProducts.length))
            setIsLoadingMore(false)
          }, 300)
        }
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 },
    )

    observer.observe(sentinelNode)

    return () => observer.disconnect()
  }, [galleryProducts.length, isLoadingMore, visibleCount])

  const handleAddToCart = (product: GalleryProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      modelUrl: product.modelUrl || "",
      color: product.color || product.colors?.[0] || "#00c4b4",
      description: product.description,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  const handleToggleLike = (product: GalleryProduct) => {
    const liked = isLiked(product.id)
    const likeColor = product.color || product.colors?.[0] || "#00c4b4"

    if (liked) {
      removeLike(product.id)
      toast({
        title: "Removed from likes",
        description: `${product.name} removed from your liked items`,
      })
      return
    }

    addLike({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      color: likeColor,
      description: product.description,
    })
    toast({
      title: "Added to likes",
      description: `${product.name} added to your liked items`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#2a1a4a] text-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="gallery-header mb-6 md:mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-white via-[#00c4b4] to-[#007bff] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl lg:text-5xl">
            Curated Outfit Gallery
          </h1>
          <p className="text-sm text-gray-400 md:text-base">Explore the collection and refine results instantly with smart filters.</p>
        </div>

        <div className="gallery-content grid grid-cols-1 items-start gap-8 md:grid-cols-[260px_1fr]">
          <FilterSidebar>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              priceBounds={priceBounds}
              activeChips={activeChips}
              hasActiveFilters={hasActiveFilters}
              onToggleCategory={toggleCategory}
              onSubcategoryChange={setSubcategory}
              onPriceChange={setPriceRange}
              onToggleBrand={toggleBrand}
              onToggleRating={toggleRating}
              onStockToggle={setInStockOnly}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onRemoveChip={removeActiveChip}
              onClearAll={clearAll}
            />
          </FilterSidebar>

          <FilterDrawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen} activeCount={activeChips.length}>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              priceBounds={priceBounds}
              activeChips={activeChips}
              hasActiveFilters={hasActiveFilters}
              onToggleCategory={toggleCategory}
              onSubcategoryChange={setSubcategory}
              onPriceChange={setPriceRange}
              onToggleBrand={toggleBrand}
              onToggleRating={toggleRating}
              onStockToggle={setInStockOnly}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onRemoveChip={removeActiveChip}
              onClearAll={clearAll}
            />
          </FilterDrawer>

          <div>
            <p className="mb-4 text-sm text-gray-300">Showing {visibleProducts.length} of {galleryProducts.length} products</p>

            {selectedCategory && categorySubcategories.length > 0 ? (
              <div className="mb-6 overflow-x-auto">
                <div className="flex min-w-max gap-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setSubcategory("")}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      !filters.subcategory
                        ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                        : "border-white/20 bg-white/5 text-gray-200 hover:border-[#00c4b4]/60"
                    }`}
                  >
                    All
                  </button>
                  {categorySubcategories.map((subcategory: string) => (
                    <button
                      key={subcategory}
                      type="button"
                      onClick={() => setSubcategory(subcategory)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        filters.subcategory === subcategory
                          ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                          : "border-white/20 bg-white/5 text-gray-200 hover:border-[#00c4b4]/60"
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {galleryProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-gray-300">No products found for the selected filters.</p>
                <Button onClick={clearAll} variant="ghost" className="mt-4 text-[#00C4B4] hover:bg-[#00C4B4]/10">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((item) => (
                  <Card
                    key={item.id}
                    className="gallery-item group overflow-hidden border-[#00C4B4]/30 bg-[#1A1A1A]/80 backdrop-blur-lg"
                  >
                    <div className="relative h-[350px] overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={String(item.name)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />

                      {item.isNew && <Badge className="absolute left-3 top-3 bg-[#00C4B4] text-black">New</Badge>}

                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-white/40 bg-black/30 px-4 text-white hover:bg-white/20"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Add to cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-white/40 bg-black/30 px-4 text-white hover:bg-white/20"
                          onClick={() => openProductDetails(item)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View info
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full px-4 ${
                            isLiked(item.id)
                              ? "border-[#00c4b4] bg-[#00c4b4]/20 text-[#00c4b4]"
                              : "border-white/40 bg-black/30 text-white hover:bg-white/20"
                          }`}
                          onClick={() => handleToggleLike(item)}
                        >
                          <Heart className={`mr-2 h-4 w-4 ${isLiked(item.id) ? "fill-current" : ""}`} />
                          Like
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <span className="font-bold text-[#00C4B4]">Rs {item.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-zinc-700 text-xs text-zinc-400">
                          {getFashionCategoryLabel(String(item.category))}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-700 text-xs text-zinc-400">
                          {item.brand}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>

                <div ref={sentinelRef} className="h-1 w-full mt-4" />

                {isLoadingMore && visibleProducts.length < galleryProducts.length ? (
                  <div className="flex items-center justify-center py-3">
                    <div className="flex items-center gap-2 text-[#00c4b4]">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#00c4b4] [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#00c4b4] [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#00c4b4]" />
                    </div>
                  </div>
                ) : null}

                {!isLoadingMore && visibleProducts.length >= galleryProducts.length ? (
                  <p className="py-4 text-center text-sm text-gray-300">You've seen it all! 🎉</p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <ProductDetailModal
        item={selectedProduct}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        similarItems={suggestedProducts}
      />
    </div>
  )
}
