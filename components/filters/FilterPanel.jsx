"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Star } from "lucide-react"
import ActiveFilterChips from "@/components/filters/ActiveFilterChips"
import ColorSwatch from "@/components/filters/ColorSwatch"
import PriceRangeSlider from "@/components/filters/PriceRangeSlider"
import SizeChip from "@/components/filters/SizeChip"

const SECTION_IDS = ["category", "price", "brand", "rating", "availability", "color", "size"]

const PRICE_PRESETS = [
  { label: "< Rs 500", min: 100, max: 500 },
  { label: "< Rs 1k", min: 100, max: 1000 },
  { label: "< Rs 2k", min: 100, max: 2000 },
  { label: "< Rs 4k", min: 100, max: 4000 },
  { label: "< Rs 6k", min: 100, max: 6000 },
  { label: "< Rs 10k", min: 100, max: 10000 },
]

function AccordionSection({ title, open, onToggle, children }) {
  return (
    <section className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-white"
      >
        {title}
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {open ? <div className="pb-3">{children}</div> : null}
    </section>
  )
}

export default function FilterPanel({
  filters,
  filterOptions,
  priceBounds,
  activeChips,
  hasActiveFilters,
  onToggleCategory,
  onSubcategoryChange,
  onPriceChange,
  onToggleBrand,
  onToggleRating,
  onStockToggle,
  onToggleColor,
  onToggleSize,
  onRemoveChip,
  onClearAll,
}) {
  const [sections, setSections] = useState(
    SECTION_IDS.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, {}),
  )

  const toggleSection = (id) => {
    setSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedCategory = filters.categories?.[0] || ""
  const categorySubcategories = selectedCategory ? filterOptions.subcategoriesByCategory?.[selectedCategory] || [] : []

  return (
    <div className="w-full">
      <ActiveFilterChips chips={activeChips} onRemove={onRemoveChip} onClearAll={onClearAll} showClear={hasActiveFilters} />

      <AccordionSection title="Category" open={sections.category} onToggle={() => toggleSection("category")}>
        <div className="space-y-2">
          {filterOptions.categories.map((category) => (
            <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="h-4 w-4 rounded border-white/30 bg-white/10 text-[#00c4b4] focus:ring-[#00c4b4]"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>

        {selectedCategory && categorySubcategories.length > 0 ? (
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSubcategoryChange("")}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  !filters.subcategory
                    ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                    : "border-white/20 bg-white/5 text-gray-300"
                }`}
              >
                All
              </button>
              {categorySubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => onSubcategoryChange(subcategory)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    filters.subcategory === subcategory
                      ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                      : "border-white/20 bg-white/5 text-gray-300"
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Price Range" open={sections.price} onToggle={() => toggleSection("price")}>
        <PriceRangeSlider
          minLimit={100}
          maxLimit={10000}
          minValue={filters.priceMin}
          maxValue={filters.priceMax}
          onChange={onPriceChange}
          presets={PRICE_PRESETS}
        />
      </AccordionSection>

      <AccordionSection title="Brand" open={sections.brand} onToggle={() => toggleSection("brand")}>
        <div className="space-y-2">
          {filterOptions.brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onToggleBrand(brand)}
                className="h-4 w-4 rounded border-white/20 bg-transparent text-[#00c4b4] focus:ring-[#00c4b4]"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Ratings" open={sections.rating} onToggle={() => toggleSection("rating")}>
        <div className="space-y-2">
          {filterOptions.ratings.map((rating) => {
            const selected = filters.ratings.includes(rating)

            return (
              <button
                key={rating}
                type="button"
                onClick={() => onToggleRating(rating)}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${
                  selected
                    ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                    : "border-white/10 bg-white/5 text-gray-200 hover:border-[#00c4b4]/60"
                }`}
              >
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${index <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </span>
                <span>& above</span>
                {selected ? <span className="ml-2 h-2 w-2 rounded-full bg-[#00c4b4]" /> : null}
              </button>
            )
          })}
        </div>
      </AccordionSection>

      <AccordionSection title="Availability" open={sections.availability} onToggle={() => toggleSection("availability")}>
        <div className="flex items-center justify-between gap-3 text-sm text-gray-200">
          <span className="pr-3">In Stock Only</span>
          <button
            type="button"
            onClick={() => onStockToggle(!filters.inStockOnly)}
            aria-pressed={filters.inStockOnly}
            aria-label="Toggle in stock only"
            className={`relative ml-auto h-6 w-12 shrink-0 overflow-hidden rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00c4b4]/70 focus:ring-offset-0 ${
              filters.inStockOnly ? "bg-[#00c4b4]" : "bg-white/20"
            }`}
          >
            <span
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: filters.inStockOnly ? 26 : 2 }}
            />
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Color" open={sections.color} onToggle={() => toggleSection("color")}>
        <div className="flex flex-wrap gap-2">
          {filterOptions.colors.map((color) => (
            <ColorSwatch
              key={color.name}
              color={color}
              selected={filters.colors.includes(color.name)}
              onToggle={onToggleColor}
            />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Size" open={sections.size} onToggle={() => toggleSection("size")}>
        <div className="flex flex-wrap gap-2">
          {filterOptions.sizes.map((size) => (
            <SizeChip key={size} size={size} selected={filters.sizes.includes(size)} onToggle={onToggleSize} />
          ))}
        </div>
      </AccordionSection>
    </div>
  )
}
