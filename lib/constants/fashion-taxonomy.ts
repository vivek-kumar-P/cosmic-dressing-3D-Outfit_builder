export interface FashionCategoryOption {
  id: string
  label: string
}

export interface FashionCategorySection {
  title: string
  items: FashionCategoryOption[]
}

export interface FashionMetaOption {
  id: string
  label: string
}

export const fashionCategoryOptions: FashionCategoryOption[] = [
  { id: "all", label: "All" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "dresses", label: "Dresses" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
  { id: "fashion", label: "Fashion" },
  { id: "women-fashion", label: "Women Fashion" },
  { id: "men-shirts", label: "Men Shirts" },
  { id: "men-pants", label: "Men Pants" },
  { id: "men-shoes", label: "Men Shoes" },
  { id: "men-marriage-wear", label: "Men Marriage Wear" },
  { id: "women-wear-products", label: "Women Wear Products" },
  { id: "women-footwear", label: "Women Footwear" },
  { id: "women-jewelry", label: "Women Jewelry" },
  { id: "indian-women-marriage-wear", label: "Indian Women Marriage Wear" },
  { id: "watches", label: "Watches" },
  { id: "sunglasses", label: "Sunglasses" },
  { id: "bracelets", label: "Bracelets" },
  { id: "indian-wedding-kids", label: "Indian Wedding Kids" },
]

export const fashionCategorySections: FashionCategorySection[] = [
  {
    title: "Core Apparel",
    items: fashionCategoryOptions.filter((option) => ["tops", "bottoms", "dresses", "shoes", "accessories"].includes(option.id)),
  },
  {
    title: "Men",
    items: fashionCategoryOptions.filter((option) => ["men-shirts", "men-pants", "men-shoes", "men-marriage-wear"].includes(option.id)),
  },
  {
    title: "Women",
    items: fashionCategoryOptions.filter((option) => ["women-wear-products", "women-footwear", "women-jewelry", "women-fashion", "indian-women-marriage-wear"].includes(option.id)),
  },
  {
    title: "Collections",
    items: fashionCategoryOptions.filter((option) => ["fashion", "watches", "sunglasses", "bracelets", "indian-wedding-kids"].includes(option.id)),
  },
]

export const fashionStyles = [
  { id: "casual", label: "Cosmic Casual" },
  { id: "formal", label: "Stardust Formal" },
  { id: "streetwear", label: "Nebula Streetwear" },
  { id: "activewear", label: "Orbit Activewear" },
]

export const fashionSeasons: FashionMetaOption[] = [
  { id: "all", label: "All Seasons" },
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" },
]

export const fashionOccasions: FashionMetaOption[] = [
  { id: "all", label: "All Occasions" },
  { id: "casual", label: "Casual" },
  { id: "work", label: "Work" },
  { id: "party", label: "Party" },
  { id: "formal", label: "Formal" },
  { id: "travel", label: "Travel" },
  { id: "wedding", label: "Wedding" },
]

export const fashionFabrics: FashionMetaOption[] = [
  { id: "all", label: "All Fabrics" },
  { id: "cotton", label: "Cotton" },
  { id: "linen", label: "Linen" },
  { id: "denim", label: "Denim" },
  { id: "silk", label: "Silk" },
  { id: "wool", label: "Wool" },
  { id: "polyester", label: "Polyester" },
]

export const fashionColors: FashionMetaOption[] = [
  { id: "all", label: "All Colors" },
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
  { id: "beige", label: "Beige" },
  { id: "brown", label: "Brown" },
  { id: "gold", label: "Gold" },
  { id: "silver", label: "Silver" },
]

export const fashionTags: FashionMetaOption[] = [
  { id: "new", label: "New" },
  { id: "bestseller", label: "Bestseller" },
  { id: "eco", label: "Eco" },
  { id: "premium", label: "Premium" },
  { id: "minimal", label: "Minimal" },
  { id: "luxury", label: "Luxury" },
  { id: "workwear", label: "Workwear" },
  { id: "street", label: "Street" },
]

export const fashionPriceBands: FashionMetaOption[] = [
  { id: "all", label: "All Prices" },
  { id: "budget", label: "Budget" },
  { id: "mid", label: "Mid-range" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" },
]

export const landingHeroCategories = [
  { id: "all", label: "All", count: 1200, active: true },
  { id: "fashion", label: "Fashion", count: 24 },
  { id: "watches", label: "Watches", count: 13 },
  { id: "sunglasses", label: "Sunglasses", count: 13 },
  { id: "women-fashion", label: "Women Fashion", count: 3 },
  { id: "bracelets", label: "Bracelets", count: 4 },
  { id: "indian-wedding-kids", label: "Indian Wedding Kids", count: 1 },
]

export const getFashionCategoryLabel = (id: string) => {
  const match = fashionCategoryOptions.find((option) => option.id === id)

  if (match) {
    return match.label
  }

  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export const getFashionMetaLabel = (items: FashionMetaOption[], id: string) => {
  const match = items.find((option) => option.id === id)

  if (match) {
    return match.label
  }

  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}