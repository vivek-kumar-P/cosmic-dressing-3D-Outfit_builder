"use client"

import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Filter, X } from "lucide-react"
import {
  fashionCategorySections,
  fashionStyles,
  fashionColors,
  fashionSeasons,
  fashionOccasions,
  fashionFabrics,
  fashionTags,
} from "@/lib/constants/fashion-taxonomy"

interface GalleryFiltersProps {
  onFiltersChange: (filters: {
    category: string[]
    style: string[]
    priceRange: [number, number]
    colors: string[]
    seasons: string[]
    occasions: string[]
    fabrics: string[]
    tags: string[]
  }) => void
  initialFilters: {
    category: string[]
    style: string[]
    priceRange: [number, number]
    colors: string[]
    seasons: string[]
    occasions: string[]
    fabrics: string[]
    tags: string[]
  }
  showMobileFilters?: boolean
  onShowMobileFiltersChange?: (show: boolean) => void
  hideMobileTrigger?: boolean
}

export default function GalleryFilters({
  onFiltersChange,
  initialFilters,
  showMobileFilters,
  onShowMobileFiltersChange,
  hideMobileTrigger = false,
}: GalleryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.category)
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialFilters.style)
  const [selectedColors, setSelectedColors] = useState<string[]>(initialFilters.colors)
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(initialFilters.seasons)
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(initialFilters.occasions)
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(initialFilters.fabrics)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.tags)
  const [internalShowMobileFilters, setInternalShowMobileFilters] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const isMobileFiltersOpen = showMobileFilters ?? internalShowMobileFilters

  const setMobileFiltersOpen = (show: boolean) => {
    if (onShowMobileFiltersChange) {
      onShowMobileFiltersChange(show)
      return
    }

    setInternalShowMobileFilters(show)
  }

  // Sync with initialFilters when they change
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      return
    }

    setPriceRange(initialFilters.priceRange)
    setSelectedCategories(initialFilters.category)
    setSelectedStyles(initialFilters.style)
    setSelectedColors(initialFilters.colors)
    setSelectedSeasons(initialFilters.seasons)
    setSelectedOccasions(initialFilters.occasions)
    setSelectedFabrics(initialFilters.fabrics)
    setSelectedTags(initialFilters.tags)
  }, [initialFilters, isInitialized])

  const applyFilters = () => {
    // Update URL with filter params
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    if (selectedStyles.length > 0) {
      params.set("style", selectedStyles.join(","))
    }

    if (selectedColors.length > 0) {
      params.set("color", selectedColors.join(","))
    }

    if (selectedSeasons.length > 0) {
      params.set("season", selectedSeasons.join(","))
    }

    if (selectedOccasions.length > 0) {
      params.set("occasion", selectedOccasions.join(","))
    }

    if (selectedFabrics.length > 0) {
      params.set("fabric", selectedFabrics.join(","))
    }

    if (selectedTags.length > 0) {
      params.set("tag", selectedTags.join(","))
    }

    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    router.push(`/gallery?${params.toString()}`)

    // Notify parent component
    onFiltersChange({
      category: selectedCategories,
      style: selectedStyles,
      priceRange,
      colors: selectedColors,
      seasons: selectedSeasons,
      occasions: selectedOccasions,
      fabrics: selectedFabrics,
      tags: selectedTags,
    })

    setMobileFiltersOpen(false)
  }

  const resetFilters = () => {
    setPriceRange([0, 200])
    setSelectedCategories([])
    setSelectedStyles([])

    // Clear URL params
    router.push("/gallery")

    // Notify parent component
    onFiltersChange({
      category: [],
      style: [],
      priceRange: [0, 200],
      colors: [],
      seasons: [],
      occasions: [],
      fabrics: [],
      tags: [],
    })

    setMobileFiltersOpen(false)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) => (prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]))
  }

  const toggleMeta = (
    value: string,
    current: string[],
    setCurrent: Dispatch<SetStateAction<string[]>>,
  ) => {
    setCurrent((prev) => (prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]))
  }

  return (
    <>
      {/* Mobile filter button */}
      {!hideMobileTrigger && (
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <Button
            variant="outline"
            className="border-zinc-700 flex items-center gap-2"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      )}

      {/* Mobile filter drawer */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/80 z-50 transition-opacity duration-300 ${isMobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-[300px] bg-[#1A1A1A] p-6 transition-transform duration-300 ${isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Filters</h3>
            <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Filter content - same as desktop */}
          <div className="space-y-8">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                min={0}
                max={200}
                step={5}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between mt-2 text-sm text-zinc-400">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-5">
                {fashionCategorySections.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{section.title}</p>
                    <div className="space-y-3">
                      {section.items.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <Label htmlFor={`mobile-category-${category.id}`} className="text-zinc-300">
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Styles */}
            <div>
              <h3 className="font-medium mb-4">Styles</h3>
              <div className="space-y-3">
                {fashionStyles.map((style) => (
                  <div key={style.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-style-${style.id}`}
                      checked={selectedStyles.includes(style.id)}
                      onCheckedChange={() => toggleStyle(style.id)}
                    />
                    <Label htmlFor={`mobile-style-${style.id}`} className="text-zinc-300">
                      {style.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h3 className="font-medium mb-4">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {fashionColors
                  .filter((color) => color.id !== "all")
                  .map((color) => (
                    <Button
                      key={color.id}
                      variant={selectedColors.includes(color.id) ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedColors.includes(color.id)
                          ? "bg-[#00C4B4] text-black"
                          : "border-zinc-700 bg-transparent"
                      }
                      onClick={() => toggleMeta(color.id, selectedColors, setSelectedColors)}
                    >
                      {color.label}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Seasons</h3>
              <div className="flex flex-wrap gap-2">
                {fashionSeasons
                  .filter((season) => season.id !== "all")
                  .map((season) => (
                    <Button
                      key={season.id}
                      variant={selectedSeasons.includes(season.id) ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedSeasons.includes(season.id)
                          ? "bg-[#00C4B4] text-black"
                          : "border-zinc-700 bg-transparent"
                      }
                      onClick={() => toggleMeta(season.id, selectedSeasons, setSelectedSeasons)}
                    >
                      {season.label}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Occasions</h3>
              <div className="flex flex-wrap gap-2">
                {fashionOccasions
                  .filter((occasion) => occasion.id !== "all")
                  .map((occasion) => (
                    <Button
                      key={occasion.id}
                      variant={selectedOccasions.includes(occasion.id) ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedOccasions.includes(occasion.id)
                          ? "bg-[#00C4B4] text-black"
                          : "border-zinc-700 bg-transparent"
                      }
                      onClick={() => toggleMeta(occasion.id, selectedOccasions, setSelectedOccasions)}
                    >
                      {occasion.label}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Fabrics</h3>
              <div className="flex flex-wrap gap-2">
                {fashionFabrics
                  .filter((fabric) => fabric.id !== "all")
                  .map((fabric) => (
                    <Button
                      key={fabric.id}
                      variant={selectedFabrics.includes(fabric.id) ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedFabrics.includes(fabric.id)
                          ? "bg-[#00C4B4] text-black"
                          : "border-zinc-700 bg-transparent"
                      }
                      onClick={() => toggleMeta(fabric.id, selectedFabrics, setSelectedFabrics)}
                    >
                      {fabric.label}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {fashionTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    size="sm"
                    className={
                      selectedTags.includes(tag.id) ? "bg-[#00C4B4] text-black" : "border-zinc-700 bg-transparent"
                    }
                    onClick={() => toggleMeta(tag.id, selectedTags, setSelectedTags)}
                  >
                    {tag.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button className="w-full bg-gradient-to-r from-[#007BFF] to-[#00C4B4]" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full border-zinc-700" onClick={resetFilters}>
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block sticky top-24 space-y-8">
        <div>
          <h3 className="font-medium mb-4">Price Range</h3>
          <Slider
            value={priceRange}
            min={0}
            max={200}
            step={5}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-zinc-400">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Categories</h3>
          <div className="space-y-5">
            {fashionCategorySections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{section.title}</p>
                <div className="space-y-3">
                  {section.items.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-zinc-300">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Styles</h3>
          <div className="space-y-3">
            {fashionStyles.map((style) => (
              <div key={style.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`style-${style.id}`}
                  checked={selectedStyles.includes(style.id)}
                  onCheckedChange={() => toggleStyle(style.id)}
                />
                <Label htmlFor={`style-${style.id}`} className="text-zinc-300">
                  {style.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {fashionColors
              .filter((color) => color.id !== "all")
              .map((color) => (
                <Button
                  key={color.id}
                  variant={selectedColors.includes(color.id) ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedColors.includes(color.id)
                      ? "bg-[#00C4B4] text-black"
                      : "border-zinc-700 bg-transparent"
                  }
                  onClick={() => toggleMeta(color.id, selectedColors, setSelectedColors)}
                >
                  {color.label}
                </Button>
              ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Seasons</h3>
          <div className="flex flex-wrap gap-2">
            {fashionSeasons
              .filter((season) => season.id !== "all")
              .map((season) => (
                <Button
                  key={season.id}
                  variant={selectedSeasons.includes(season.id) ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedSeasons.includes(season.id)
                      ? "bg-[#00C4B4] text-black"
                      : "border-zinc-700 bg-transparent"
                  }
                  onClick={() => toggleMeta(season.id, selectedSeasons, setSelectedSeasons)}
                >
                  {season.label}
                </Button>
              ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Occasions</h3>
          <div className="flex flex-wrap gap-2">
            {fashionOccasions
              .filter((occasion) => occasion.id !== "all")
              .map((occasion) => (
                <Button
                  key={occasion.id}
                  variant={selectedOccasions.includes(occasion.id) ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedOccasions.includes(occasion.id)
                      ? "bg-[#00C4B4] text-black"
                      : "border-zinc-700 bg-transparent"
                  }
                  onClick={() => toggleMeta(occasion.id, selectedOccasions, setSelectedOccasions)}
                >
                  {occasion.label}
                </Button>
              ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Fabrics</h3>
          <div className="flex flex-wrap gap-2">
            {fashionFabrics
              .filter((fabric) => fabric.id !== "all")
              .map((fabric) => (
                <Button
                  key={fabric.id}
                  variant={selectedFabrics.includes(fabric.id) ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedFabrics.includes(fabric.id)
                      ? "bg-[#00C4B4] text-black"
                      : "border-zinc-700 bg-transparent"
                  }
                  onClick={() => toggleMeta(fabric.id, selectedFabrics, setSelectedFabrics)}
                >
                  {fabric.label}
                </Button>
              ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div>
          <h3 className="font-medium mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {fashionTags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                size="sm"
                className={
                  selectedTags.includes(tag.id) ? "bg-[#00C4B4] text-black" : "border-zinc-700 bg-transparent"
                }
                onClick={() => toggleMeta(tag.id, selectedTags, setSelectedTags)}
              >
                {tag.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="pt-2 space-y-3">
          <Button className="w-full bg-gradient-to-r from-[#007BFF] to-[#00C4B4]" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full border-zinc-700" onClick={resetFilters}>
            Reset All
          </Button>
        </div>
      </div>
    </>
  )
}
