"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Star, ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useLikes } from "@/contexts/likes-context"
import ProductDetailModal, { type ProductDetailItem } from "@/components/product-detail-modal"
import { useRouter } from "next/navigation"
import { getFashionCategoryLabel } from "@/lib/constants/fashion-taxonomy"
import { useFilters } from "@/hooks/useFilters"
import FilterSidebar from "@/components/filters/FilterSidebar"
import FilterDrawer from "@/components/filters/FilterDrawer"
import FilterPanel from "@/components/filters/FilterPanel"

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

function ProductListingContent() {
  const {
    products,
    filteredProducts,
    filters,
    filterOptions,
    priceBounds,
    activeChips,
    hasActiveFilters,
    setCategory,
    setPriceRange,
    setRating,
    setInStockOnly,
    toggleBrand,
    toggleColor,
    toggleSize,
    clearAll,
    removeActiveChip,
  } = useFilters()
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { addItem } = useCart()
  const { addLike, removeLike, isLiked } = useLikes()
  const router = useRouter()
  const [detailItem, setDetailItem] = useState<ProductDetailItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const productsPerPage = 12

  const sortedProducts = useMemo(() => {
    let nextProducts = [...filteredProducts]

    switch (sortBy) {
      case "newest":
        nextProducts = [...nextProducts].reverse()
        break
      case "price-low":
        nextProducts = [...nextProducts].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        nextProducts = [...nextProducts].sort((a, b) => b.price - a.price)
        break
      case "rating":
        nextProducts = [...nextProducts].sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return nextProducts
  }, [filteredProducts, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const toggleLike = (product: any) => {
    if (isLiked(product.id)) {
      removeLike(product.id)
    } else {
      addLike({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        color: "#ffffff",
        description: `${product.brand} • ${product.category}`,
      })
    }
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      modelUrl: "",
      color: "#ffffff",
      description: `${product.brand} • ${product.category}`,
    })
  }

  const openDetails = (product: any) => {
    const item: ProductDetailItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      modelUrl: "",
      color: "#ffffff",
      description: `${product.brand} • ${product.category}`,
    }
    setDetailItem(item)
    setDetailOpen(true)
  }

  const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1A] via-[#1A1A3A] to-[#2A1A4A] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Products</h1>
          <p className="text-gray-400">Discover curated fashion picks across categories, colors, and sizes.</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              priceBounds={priceBounds}
              activeChips={activeChips}
              hasActiveFilters={hasActiveFilters}
              onCategoryChange={setCategory}
              onPriceChange={setPriceRange}
              onToggleBrand={toggleBrand}
              onRatingChange={setRating}
              onStockToggle={setInStockOnly}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onRemoveChip={removeActiveChip}
              onClearAll={clearAll}
            />
          </FilterSidebar>

          <FilterDrawer open={showFilters} onOpenChange={setShowFilters} activeCount={activeChips.length}>
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              priceBounds={priceBounds}
              activeChips={activeChips}
              hasActiveFilters={hasActiveFilters}
              onCategoryChange={setCategory}
              onPriceChange={setPriceRange}
              onToggleBrand={toggleBrand}
              onRatingChange={setRating}
              onStockToggle={setInStockOnly}
              onToggleColor={toggleColor}
              onToggleSize={toggleSize}
              onRemoveChip={removeActiveChip}
              onClearAll={clearAll}
            />
          </FilterDrawer>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-300">Showing {sortedProducts.length} of {products.length} products</p>

            {/* Controls */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex border border-white/20 rounded-lg bg-white/10 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 rounded-none ${
                      viewMode === "grid" ? "bg-[#00C4B4] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`px-3 rounded-none ${
                      viewMode === "list" ? "bg-[#00C4B4] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/20">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 overflow-hidden hover:border-[#00C4B4]/50 transition-all duration-300 hover:scale-105 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                      {/* Product Image */}
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                        }`}
                      >
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                          {product.isBestseller && (
                            <Badge className="bg-orange-500 text-white text-xs">Bestseller</Badge>
                          )}
                          {!product.inStock && <Badge className="bg-red-500 text-white text-xs">Out of Stock</Badge>}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toggleLike(product)}
                            className={`w-8 h-8 p-0 backdrop-blur-sm border-0 ${
                              isLiked(product.id) ? "bg-red-500 text-white" : "bg-white/20 text-white"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${isLiked(product.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 p-0 bg-[#00C4B4] text-white border-0"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openDetails(product)}
                            className="w-8 h-8 p-0 bg-white/20 text-white border-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Discount */}
                        {product.originalPrice > product.price && (
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-red-500 text-white text-xs">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <Link href={`/products/${product.id}`}>
                                <h3 className="font-semibold text-white group-hover:text-[#00C4B4] transition-colors cursor-pointer line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-400">
                                {product.brand} • {getFashionCategoryLabel(product.category)}
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {product.rating.toFixed(1)} ({product.reviews})
                            </span>
                          </div>

                          {/* Colors */}
                          <div className="flex items-center gap-1 mb-3">
                            {product.colors.slice(0, 3).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#00C4B4]">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          {viewMode === "list" && (
                            <Button
                              size="sm"
                              onClick={() => openDetails(product)}
                              className="bg-gradient-to-r from-[#00C4B4] to-[#007BFF] text-white"
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-[#00C4B4] text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Product Detail Modal */}
      <ProductDetailModal
        item={detailItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onCustomize={() => {
          setDetailOpen(false)
          router.push("/customize")
        }}
      />
    </div>
  )
}

export default function ProductListingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A1A] via-[#1A1A3A] to-[#2A1A4A] text-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#00C4B4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductListingContent />
    </Suspense>
  )
}

// Modal host at page root to avoid z-index issues
export function ProductDetailHost() {
  const [open, setOpen] = useState(false)
  return null
}
