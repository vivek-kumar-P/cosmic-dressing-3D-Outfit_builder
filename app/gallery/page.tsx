"use client"

import { useState, useEffect } from "react"
import { gsap } from "gsap"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fashionCategoryOptions, getFashionCategoryLabel } from "@/lib/constants/fashion-taxonomy"
import GalleryFilters from "@/components/gallery/gallery-filters"
import GalleryGrid from "@/components/gallery/gallery-grid"
import { useRouter, useSearchParams } from "next/navigation"

const categories = fashionCategoryOptions.map((option) => option.id)

type GalleryFilterState = {
  category: string[]
  style: string[]
  priceRange: [number, number]
  colors: string[]
  seasons: string[]
  occasions: string[]
  fabrics: string[]
  tags: string[]
}

export default function GalleryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<GalleryFilterState>({
    category: [],
    style: [],
    priceRange: [0, 200],
    colors: [],
    seasons: [],
    occasions: [],
    fabrics: [],
    tags: [],
  })

  const selectedCategory = filters.category[0] || "all"
  const activeFilterCount =
    filters.category.length +
    filters.style.length +
    filters.colors.length +
    filters.seasons.length +
    filters.occasions.length +
    filters.fabrics.length +
    filters.tags.length +
    (searchQuery ? 1 : 0)

  const clearAll = () => {
    setSearchQuery("")
    setShowFilters(false)
    setFilters({
      category: [],
      style: [],
      priceRange: [0, 200],
      colors: [],
      seasons: [],
      occasions: [],
      fabrics: [],
      tags: [],
    })
    router.replace("/gallery")
  }

  useEffect(() => {
    const initialSearch = searchParams.get("search") || ""
    const parseList = (value: string | null) => (value ? value.split(",").filter(Boolean) : [])

    setSearchQuery(initialSearch)
    setFilters({
      category: parseList(searchParams.get("category")),
      style: parseList(searchParams.get("style")),
      priceRange: [
        Number(searchParams.get("minPrice") || 0),
        Number(searchParams.get("maxPrice") || 200),
      ],
      colors: parseList(searchParams.get("color")),
      seasons: parseList(searchParams.get("season")),
      occasions: parseList(searchParams.get("occasion")),
      fabrics: parseList(searchParams.get("fabric")),
      tags: parseList(searchParams.get("tag")),
    })
  }, [searchParams])

  useEffect(() => {
    // Page entrance animations
    gsap.fromTo(".gallery-header", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })

    gsap.fromTo(".gallery-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2 })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#2a1a4a] text-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="gallery-header mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00c4b4] to-[#007bff] mb-2 tracking-tight">
                Curated Outfit Gallery
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Discover and customize polished fashion looks with filters for color, season, occasion, fabric, and style.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search outfits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#00c4b4] focus:ring-[#00c4b4] h-10 md:h-12"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 h-10 md:h-12 px-3 md:px-4"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-200">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} filters active`
                    : "Showing the full curated catalog"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Clean filters, faster decisions, and a single catalog experience.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="self-start md:self-center text-[#00C4B4] hover:bg-[#00C4B4]/10"
              >
                Clear all
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: category === "all" ? [] : [category],
                      }))
                    }
                    className={`whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-[#00c4b4] to-[#007bff] text-white border-0"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {getFashionCategoryLabel(category)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gallery-content grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Desktop filter panel */}
          <div className="hidden lg:block">
            <GalleryFilters onFiltersChange={setFilters} initialFilters={filters} />
          </div>

          {/* Mobile controlled filter drawer */}
          <div className="lg:hidden">
            <GalleryFilters
              onFiltersChange={setFilters}
              initialFilters={filters}
              showMobileFilters={showFilters}
              onShowMobileFiltersChange={setShowFilters}
              hideMobileTrigger={true}
            />
          </div>

          <div>
            <GalleryGrid
              filters={{
                ...filters,
                search: searchQuery || undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
