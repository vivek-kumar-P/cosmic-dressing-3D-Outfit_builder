"use client"

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} brand
 * @property {string} category
 * @property {string} subcategory
 * @property {number} price
 * @property {number} originalPrice
 * @property {number} discountPercent
 * @property {string} priceTier
 * @property {number} rating
 * @property {number} reviews
 * @property {boolean} inStock
 * @property {number} stockCount
 * @property {string[]} colors
 * @property {string[]} sizes
 * @property {string} image
 * @property {boolean} isNew
 * @property {boolean} isBestseller
 * @property {string} gender
 * @property {string[]} occasions
 * @property {string[]} seasons
 * @property {string[]} styleTags
 * @property {string} material
 * @property {string} fit
 * @property {string} description
 * @property {string[]} tags
 * @property {string} voiceDescription
 */

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"]
const PRICE_MIN_LIMIT = 100
const PRICE_MAX_LIMIT = 10000

export const COLOR_OPTIONS = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#F9FAFB" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Olive", hex: "#4D7C0F" },
  { name: "Green", hex: "#16A34A" },
  { name: "Beige", hex: "#D6D3C7" },
  { name: "Brown", hex: "#7C4A2D" },
  { name: "Red", hex: "#DC2626" },
  { name: "Pink", hex: "#EC4899" },
]

const FASHION_FILES = [
  "01_fashion_30816952.jpg",
  "02_fashion_10131765.jpg",
  "03_fashion_21390399.jpg",
  "04_fashion_6069975.jpg",
  "05_fashion_17143539.jpg",
  "06_fashion_8396314.jpg",
  "07_fashion_20441555.jpg",
  "08_fashion_8126157.jpg",
  "09_fashion_12942612.jpg",
  "10_fashion_5325696.jpg",
  "11_fashion_33572883.jpg",
  "12_fashion_8945179.jpg",
  "13_fashion_6069954.jpg",
  "14_fashion_7969812.jpg",
  "15_fashion_12585895.jpg",
  "16_fashion_9821877.jpg",
  "17_fashion_29265225.jpg",
  "18_fashion_18428517.jpg",
  "19_fashion_8443638.jpg",
  "20_fashion_19198606.jpg",
  "21_fashion_5560606.jpg",
  "22_fashion_23947090.jpg",
  "23_fashion_9811232.jpg",
  "24_fashion_29708198.jpg",
]

const WATCH_FILES = [
  "25_watches_30799588.jpg",
  "26_watches_31642725.jpg",
  "27_watches_33558595.jpg",
  "28_watches_33690507.jpg",
  "29_watches_33558596.jpg",
  "30_watches_32528934.jpg",
  "31_watches_8968349.jpg",
  "32_watches_36812411.jpg",
  "33_watches_33409535.jpg",
  "34_watches_30838490.jpg",
  "35_watches_33409525.jpg",
  "36_watches_6098254.jpg",
  "37_watches_31513715.jpg",
]

const SUNGLASSES_FILES = [
  "38_sunglasses_31259705.jpg",
  "39_sunglasses_2767694.jpg",
  "40_sunglasses_20106424.jpg",
  "41_sunglasses_29538714.jpg",
  "42_sunglasses_29274468.jpg",
  "43_sunglasses_31658880.jpg",
  "44_sunglasses_31538078.jpg",
  "45_sunglasses_27347004.jpg",
  "46_sunglasses_343720.jpg",
  "47_sunglasses_26575039.jpg",
  "48_sunglasses_16692930.jpg",
  "49_sunglasses_5202051.jpg",
  "50_sunglasses_27353347.jpg",
]

const BRACELET_FILES = [
  "105_bracelets_5103.jpg",
  "118_bracelets_5135.jpg",
  "133_bracelets_5183.jpg",
  "138_bracelets_5199.jpg",
]

const MEN_SHOE_FILES = [
  "01_loafers_9992899.jpg",
  "02_loafers_29258015.jpg",
  "03_brogue_6765524.jpg",
  "04_formal-black_292999.jpg",
  "05_oxford_15059774.jpg",
  "06_buckle_29494530.jpg",
  "07_sneakers_18972408.jpg",
  "08_sneakers_28819041.jpg",
  "09_sneakers_2048547.jpg",
  "10_sneakers_684152.jpg",
]

const WOMEN_FOOTWEAR_FILES = [
  "01_sandals_29096391.jpg",
  "02_sandals_17740564.jpg",
  "03_sandals_27204291.jpg",
  "04_sandals_27046150.jpg",
  "05_sandals_31450985.jpg",
  "06_slippers_17740561.jpg",
  "07_slippers_12969102.jpg",
  "08_slippers_14187813.jpg",
  "09_slippers_17740568.jpg",
  "10_slippers_9267584.jpg",
  "11_heels_3782789.jpg",
  "12_heels_10827097.jpg",
  "13_heels_29393718.jpg",
  "14_heels_34736060.jpg",
  "15_heels_29870211.jpg",
  "16_heels_3682290.jpg",
  "17_heels_26965806.jpg",
  "18_heels_5610717.jpg",
  "19_heels_27204295.jpg",
  "20_heels_27023941.jpg",
]

const MEN_SHIRT_FILES = [
  "01_men-shirt_11100290.jpg",
  "02_men-shirt_10952730.jpg",
  "03_men-shirt_11100293.jpg",
  "04_men-shirt_11176397.jpg",
  "05_men-shirt_7444126.jpg",
  "06_men-shirt_264726.jpg",
  "07_men-shirt_9558723.jpg",
  "08_men-shirt_28576630.jpg",
  "09_men-shirt_22441317.jpg",
  "10_men-shirt_28297697.jpg",
]

const MEN_PANT_FILES = [
  "01_men-pants_4109797.jpg",
  "02_men-pants_11176394.jpg",
  "03_men-pants_6069087.jpg",
  "04_men-pants_7764609.jpg",
  "05_men-pants_7764608.jpg",
  "06_men-pants_4546763.jpg",
  "07_men-pants_6764143.jpg",
  "08_men-pants_17265364.jpg",
  "09_men-pants_52518.jpg",
  "10_men-pants_4109759.jpg",
]

const WOMEN_WEAR_FILES = [
  "01_t-shirt_34156905.jpg",
  "02_t-shirt_34156906.jpg",
  "04_t-shirt_12025472.jpg",
  "05_t-shirt_4440572.jpg",
  "06_t-shirt_36908588.jpg",
  "07_pants_17630811.jpg",
  "08_pants_17720437.jpg",
  "09_pants_4043588.jpg",
  "10_pants_6167280.jpg",
  "11_pants_4602025.jpg",
  "12_pants_3927390.jpg",
  "13_shirts_12389567.jpg",
  "14_shirts_7444126.jpg",
  "16_shirts_35675692.jpg",
  "17_shirts_7988710.jpg",
  "18_shirts_14870714.jpg",
  "19_plazas_4452381.jpg",
  "20_plazas_4458521.jpg",
  "21_plazas_31961165.jpg",
  "22_plazas_12956068.jpg",
  "23_plazas_5405607.jpg",
  "24_leggings_3927388.jpg",
  "25_leggings_3927386.jpg",
  "26_leggings_3927387.jpg",
  "27_leggings_3927383.jpg",
  "28_leggings_5405606.jpg",
  "29_half-kurta_19895963.jpg",
  "30_half-kurta_26297709.jpg",
  "31_half-kurta_22441317.jpg",
  "32_half-kurta_35508907.jpg",
]

const WOMEN_JEWELRY_FILES = [
  "01_necklace_29385413.jpg",
  "02_necklace_19288669.jpg",
  "03_necklace_14041631.jpg",
  "04_necklace_32780784.jpg",
  "05_necklace_10862230.jpg",
  "06_necklace_4295010.jpg",
  "07_necklace_31970995.jpg",
  "08_necklace_29642394.jpg",
  "09_necklace_4295006.jpg",
  "10_necklace_19821929.jpg",
  "11_earrings_12145096.jpg",
  "12_earrings_12145058.jpg",
  "13_earrings_4225085.jpg",
  "14_earrings_32989029.jpg",
  "15_earrings_35270127.jpg",
]

const MEN_MARRIAGE_FILES = [
  "01_sherwani_36836731.jpg",
  "02_sherwani_36098422.jpg",
  "03_sherwani_33049965.jpg",
  "04_kurta-paijama_5465927.jpg",
  "05_kurta-paijama_5938772.jpg",
  "06_indo-western_24334708.jpg",
  "07_blazer_30324804.jpg",
  "08_blazer_30324799.jpg",
  "09_shirt-pant_30324809.jpg",
  "10_shirt-pant_34582583.jpg",
]

const ACCESSORY_BRANDS = ["Roadster", "Adidas", "Puma"]
const SUNGLASS_BRANDS = ["Nike", "Adidas", "Zara"]
const BRACELET_BRANDS = ["Zara", "H&M"]
const MEN_SHOE_BRANDS = ["Nike", "Puma", "Adidas", "Roadster"]
const WOMEN_FOOTWEAR_BRANDS = ["Zara", "H&M", "Uniqlo"]
const MEN_SHIRT_BRANDS = ["Levi's", "Roadster", "H&M", "Zara"]
const MEN_PANT_BRANDS = ["Levi's", "Puma", "Roadster", "Adidas"]
const WOMEN_WEAR_BRANDS = ["Zara", "H&M", "Uniqlo", "Levi's"]
const JEWELRY_BRANDS = ["Zara", "H&M"]
const MEN_MARRIAGE_BRANDS = ["Roadster", "Zara"]
const FASHION_BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Puma", "Levi's", "Roadster"]

const WATCH_NAMES = [
  "Minimalist Analog Watch",
  "Chronograph Sport Watch",
  "Mesh Strap Watch",
  "Classic Dial Watch",
]
const SUNGLASS_NAMES = ["Polarized Wayfarer", "Retro Round Frames", "Aviator Gradient Lens", "Oversized Chic Shades"]
const BRACELET_NAMES = ["Gold Charm Bracelet", "Pearl Beaded Bracelet", "Minimal Link Bracelet", "Boho Layered Bracelet"]
const MEN_SHIRT_NAMES = ["Oxford Button Shirt", "Linen Casual Shirt", "Checked Slim Shirt", "Textured Formal Shirt"]
const MEN_PANT_NAMES = ["Slim Fit Chinos", "Cargo Joggers", "Tailored Trousers", "Relaxed Fit Pants"]
const WOMEN_FOOTWEAR_NAMES = ["Strappy Heeled Sandals", "Block Heel Pumps", "Comfort Slides", "Elegant Party Heels"]

const COLOR_POOL = ["Black", "White", "Navy", "Blue", "Beige", "Brown", "Red", "Pink", "Green", "Olive"]

const priceTierFor = (price) => {
  if (price < 1000) return "Budget"
  if (price < 2500) return "Mid Range"
  if (price < 5000) return "Premium"
  return "Luxury"
}

const normalizeTokens = (value) =>
  String(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

const toSentenceCase = (value) =>
  String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

const buildDescription = ({ name, brand, fit, material, occasions, gender, styleTags }) => {
  const firstOccasion = occasions[0] || "everyday wear"
  const secondOccasion = occasions[1] ? ` and ${occasions[1].toLowerCase()}` : ""
  const styleLabel = styleTags[0] || "versatile"

  return `A ${fit.toLowerCase()} ${material.toLowerCase()} ${name.toLowerCase()} by ${brand}, ideal for ${firstOccasion.toLowerCase()}${secondOccasion}. Designed in a ${styleLabel.toLowerCase()} style for ${gender} shoppers.`
}

const buildTags = ({ name, brand, category, subcategory, gender, occasions, seasons, styleTags, material, fit, colors, sizes, priceTier, rating, isBestseller, isNew, inStock }) => {
  const rawTags = [
    ...normalizeTokens(name),
    brand,
    category,
    subcategory,
    gender,
    ...occasions,
    ...seasons,
    ...styleTags,
    material,
    fit,
    ...colors,
    ...sizes,
    priceTier,
    rating >= 4 ? "top rated" : "",
    isBestseller ? "bestseller" : "",
    isNew ? "new arrival" : "",
    inStock ? "in stock" : "out of stock",
  ]

  return [...new Set(rawTags.flatMap((tag) => normalizeTokens(tag)))]
}

const buildVoiceDescription = ({ name, brand, description, colors, sizes, price, priceTier, discountPercent, rating, reviews, inStock, stockCount, occasions, seasons, styleTags, material, fit, gender }) =>
  `${name} by ${brand}. ${description} Available in ${colors.join(", ")}. Sizes: ${sizes.join(", ")}. Price: Rs ${price} (${priceTier}, ${discountPercent}% off). Rated ${rating} stars with ${reviews} reviews. ${inStock ? `In stock (${stockCount} units available)` : "Currently out of stock"}. Occasions: ${occasions.join(", ")}. Season: ${seasons.join(", ")}. Style: ${styleTags.join(", ")}. Material: ${material}. Fit: ${fit}. Gender: ${gender}.`

const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => String(a).localeCompare(String(b)))
const toList = (raw) => (raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [])
const cycle = (arr, index) => arr[index % arr.length]
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const toTitle = (value) =>
  String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const priceInRange = (min, max, index) => min + ((index * 137) % (max - min + 1))

const metricByIndex = (index) => ({
  rating: Number((3.8 + ((index % 12) * 0.1)).toFixed(1)),
  inStock: index % 5 !== 0,
  colors: [COLOR_POOL[index % COLOR_POOL.length], COLOR_POOL[(index + 3) % COLOR_POOL.length]],
  reviews: 20 + ((index * 13) % 181),
  isNew: index % 5 === 0,
  isBestseller: index % 7 === 0,
})

const defaultFilterState = (minPrice, maxPrice) => ({
  categories: [],
  subcategory: "",
  priceMin: minPrice,
  priceMax: maxPrice,
  brands: [],
  ratings: [],
  inStockOnly: false,
  colors: [],
  sizes: [],
})

const buildCatalog = () => {
  const products = []

  const pushProduct = ({
    name,
    brand,
    category,
    subcategory = "",
    price,
    sizes,
    image,
    gender,
    occasions,
    seasons,
    styleTags,
    material,
    fit,
  }) => {
    const index = products.length
    const id = index + 1
    const metrics = metricByIndex(index)
    const originalPrice = Math.round(price * (1.18 + (index % 4) * 0.06))
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100)
    const priceTier = priceTierFor(price)
    const stockCount = metrics.inStock ? (id * 7) % 50 + 1 : 0
    const description = buildDescription({ name, brand, fit, material, occasions, gender, styleTags })
    const tags = buildTags({
      name,
      brand,
      category,
      subcategory,
      gender,
      occasions,
      seasons,
      styleTags,
      material,
      fit,
      colors: metrics.colors,
      sizes,
      priceTier,
      rating: metrics.rating,
      isBestseller: metrics.isBestseller,
      isNew: metrics.isNew,
      inStock: metrics.inStock,
    })
    const voiceDescription = buildVoiceDescription({
      name,
      brand,
      description,
      colors: metrics.colors,
      sizes,
      price,
      priceTier,
      discountPercent,
      rating: metrics.rating,
      reviews: metrics.reviews,
      inStock: metrics.inStock,
      stockCount,
      occasions,
      seasons,
      styleTags,
      material,
      fit,
      gender,
    })

    products.push({
      id,
      name,
      brand,
      category,
      subcategory,
      price,
      originalPrice,
      discountPercent,
      priceTier,
      rating: metrics.rating,
      reviews: metrics.reviews,
      inStock: metrics.inStock,
      stockCount,
      colors: metrics.colors,
      sizes,
      image,
      isNew: metrics.isNew,
      isBestseller: metrics.isBestseller,
      gender,
      occasions,
      seasons,
      styleTags,
      material,
      fit,
      description,
      tags,
      voiceDescription,
    })
  }

  FASHION_FILES.forEach((file, index) => {
    const category = index % 2 === 0 ? "Men" : "Women"
    pushProduct({
      name: `${category} Fashion Look ${index + 1}`,
      brand: cycle(FASHION_BRANDS, index),
      category,
      subcategory: "Fashion",
      price: priceInRange(999, 3199, index),
      sizes: ["S", "M", "L", "XL"],
      image: `/images/curated-fashion-50/fashion/${file}`,
      gender: category,
      occasions: ["Casual", "Daily Wear", "Date Night"],
      seasons: ["Summer", "All Season"],
      styleTags: ["Contemporary", "Streetwear"],
      material: cycle(["Cotton", "Linen", "Polyester"], index),
      fit: cycle(["Slim Fit", "Regular Fit", "Relaxed Fit"], index),
    })
  })

  WATCH_FILES.forEach((file, index) => {
    pushProduct({
      name: cycle(WATCH_NAMES, index),
      brand: cycle(ACCESSORY_BRANDS, index),
      category: "Accessories",
      subcategory: "Watches",
      price: priceInRange(1499, 4999, index),
      sizes: ["Free Size"],
      image: `/images/curated-fashion-50/watches/${file}`,
      gender: "Unisex",
      occasions: ["Casual", "Formal", "Daily Wear", "Party"],
      seasons: ["All Season"],
      styleTags: ["Minimalist", "Classic", "Contemporary"],
      material: cycle(["Stainless Steel", "Leather", "Synthetic"], index),
      fit: "Free Size",
    })
  })

  SUNGLASSES_FILES.forEach((file, index) => {
    pushProduct({
      name: cycle(SUNGLASS_NAMES, index),
      brand: cycle(SUNGLASS_BRANDS, index),
      category: "Accessories",
      subcategory: "Sunglasses",
      price: priceInRange(799, 2499, index),
      sizes: ["Free Size"],
      image: `/images/curated-fashion-50/sunglasses/${file}`,
      gender: "Unisex",
      occasions: ["Casual", "Beach", "Sports", "Daily Wear"],
      seasons: ["Summer", "All Season"],
      styleTags: ["Streetwear", "Minimalist", "Classic"],
      material: cycle(["Acetate", "Metal", "Plastic"], index),
      fit: "Free Size",
    })
  })

  BRACELET_FILES.forEach((file, index) => {
    pushProduct({
      name: cycle(BRACELET_NAMES, index),
      brand: cycle(BRACELET_BRANDS, index),
      category: "Accessories",
      subcategory: "Jewellery",
      price: priceInRange(499, 1499, index),
      sizes: ["Free Size"],
      image: `/images/curated-fashion-50/bracelets/${file}`,
      gender: "Women",
      occasions: ["Casual", "Party", "Festive", "Date Night"],
      seasons: ["All Season"],
      styleTags: ["Boho", "Minimalist", "Classic"],
      material: cycle(["Gold Plated", "Pearl", "Silver"], index),
      fit: "Free Size",
    })
  })

  MEN_SHOE_FILES.forEach((file, index) => {
    const typeLabel = toTitle(file.split("_")[1])
    const occasionSets = [["Formal", "Workwear"], ["Casual", "Daily Wear"], ["Sports", "Casual"]]
    const styleSets = [["Classic"], ["Streetwear"], ["Minimalist"]]
    pushProduct({
      name: `Men ${typeLabel}`,
      brand: cycle(MEN_SHOE_BRANDS, index),
      category: "Footwear",
      subcategory: "Men Shoes",
      price: priceInRange(1299, 3999, index),
      sizes: ["7", "8", "9", "10", "11"],
      image: `/images/curated-fashion-50/men-shoes-10/${file}`,
      gender: "Men",
      occasions: cycle(occasionSets, index),
      seasons: ["All Season"],
      styleTags: cycle(styleSets, index),
      material: cycle(["Leather", "Synthetic", "Canvas", "Suede"], index),
      fit: "Regular Fit",
    })
  })

  WOMEN_FOOTWEAR_FILES.forEach((file, index) => {
    const occasionSets = [["Casual", "Daily Wear"], ["Party", "Date Night"], ["Festive", "Wedding"]]
    const seasonSets = [["Summer", "All Season"], ["All Season"]]
    const styleSets = [["Classic"], ["Contemporary"], ["Boho"]]
    pushProduct({
      name: cycle(WOMEN_FOOTWEAR_NAMES, index),
      brand: cycle(WOMEN_FOOTWEAR_BRANDS, index),
      category: "Footwear",
      subcategory: "Women Shoes",
      price: priceInRange(899, 3499, index),
      sizes: ["5", "6", "7", "8"],
      image: `/images/curated-fashion-50/women-footwear-20/${file}`,
      gender: "Women",
      occasions: cycle(occasionSets, index),
      seasons: cycle(seasonSets, index),
      styleTags: cycle(styleSets, index),
      material: cycle(["Leather", "Synthetic", "Fabric"], index),
      fit: "Regular Fit",
    })
  })

  MEN_SHIRT_FILES.forEach((file, index) => {
    const occasionSets = [["Casual", "Daily Wear"], ["Formal", "Workwear"]]
    const seasonSets = [["Summer", "All Season"], ["All Season", "Winter"]]
    const styleSets = [["Slim Fit", "Classic"], ["Regular Fit", "Minimalist"]]
    pushProduct({
      name: cycle(MEN_SHIRT_NAMES, index),
      brand: cycle(MEN_SHIRT_BRANDS, index),
      category: "Men",
      subcategory: "Shirts",
      price: priceInRange(799, 2199, index),
      sizes: ["S", "M", "L", "XL", "XXL"],
      image: `/images/curated-fashion-50/men-shirts-10/${file}`,
      gender: "Men",
      occasions: cycle(occasionSets, index),
      seasons: cycle(seasonSets, index),
      styleTags: cycle(styleSets, index),
      material: cycle(["Cotton", "Linen", "Polyester", "Oxford"], index),
      fit: cycle(["Slim Fit", "Regular Fit"], index),
    })
  })

  MEN_PANT_FILES.forEach((file, index) => {
    const occasionSets = [["Casual", "Daily Wear"], ["Formal", "Workwear"], ["Sports", "Casual"]]
    const styleSets = [["Slim Fit", "Classic"], ["Relaxed Fit", "Streetwear"]]
    pushProduct({
      name: cycle(MEN_PANT_NAMES, index),
      brand: cycle(MEN_PANT_BRANDS, index),
      category: "Men",
      subcategory: "Pants",
      price: priceInRange(999, 2799, index),
      sizes: ["28", "30", "32", "34", "36"],
      image: `/images/curated-fashion-50/men-pants-10/${file}`,
      gender: "Men",
      occasions: cycle(occasionSets, index),
      seasons: ["All Season"],
      styleTags: cycle(styleSets, index),
      material: cycle(["Denim", "Chino", "Polyester", "Cotton"], index),
      fit: cycle(["Slim Fit", "Regular Fit", "Relaxed Fit"], index),
    })
  })

  WOMEN_WEAR_FILES.slice(0, 30).forEach((file, index) => {
    const styleToken = file.split("_")[1]
    const styleKey = String(styleToken).toLowerCase()
    const occasionByStyle = {
      "t-shirt": ["Casual", "Daily Wear", "Sports"],
      pants: ["Casual", "Formal", "Daily Wear"],
      shirts: ["Casual", "Workwear", "Formal"],
      plazas: ["Casual", "Festive", "Daily Wear"],
      leggings: ["Sports", "Casual", "Daily Wear"],
      "half-kurta": ["Festive", "Ethnic", "Casual"],
      "full-kurtas": ["Festive", "Ethnic", "Wedding"],
      saaree: ["Wedding", "Festive", "Ethnic"],
    }
    const styleByStyle = {
      "saaree": ["Traditional", "Ethnic", "Flared"],
      "full-kurtas": ["Traditional", "Ethnic", "Flared"],
      "half-kurta": ["Traditional", "Ethnic", "Flared"],
      leggings: ["Streetwear", "Casual", "Bodycon"],
      "t-shirt": ["Streetwear", "Casual", "Bodycon"],
      plazas: ["Boho", "Flared", "Casual"],
    }
    const fitByStyle = {
      leggings: "Bodycon",
      plazas: "Flared",
      saaree: "Flared",
    }
    const subcategoryByStyle = {
      "t-shirt": "T Shirts",
      pants: "Pants",
      shirts: "Shirts",
      plazas: "Plazas",
      leggings: "Leggings",
      "half-kurta": "Half Kurta",
      "full-kurtas": "Full Kurtas",
      saaree: "Saaree",
    }
    pushProduct({
      name: `Women ${toTitle(styleToken)} ${index + 1}`,
      brand: cycle(WOMEN_WEAR_BRANDS, index),
      category: "Women",
      subcategory: subcategoryByStyle[styleKey] || toTitle(styleToken),
      price: priceInRange(699, 3999, index),
      sizes: ["XS", "S", "M", "L", "XL"],
      image: `/images/curated-fashion-50/women-wear-products-50/${file}`,
      gender: "Women",
      occasions: occasionByStyle[styleKey] || ["Casual", "Daily Wear"],
      seasons: cycle([["Summer", "All Season"], ["All Season"], ["Winter", "All Season"]], index),
      styleTags: styleByStyle[styleKey] || ["Regular Fit", "Contemporary"],
      material: cycle(["Cotton", "Polyester", "Chiffon", "Silk", "Knit"], index),
      fit: fitByStyle[styleKey] || cycle(["Regular Fit", "Slim Fit", "Relaxed Fit"], index),
    })
  })

  WOMEN_JEWELRY_FILES.forEach((file, index) => {
    const typeToken = file.split("_")[1]
    const jewelryType = typeToken.replace(/s$/, "")
    pushProduct({
      name: `${toTitle(typeToken)} ${index + 1}`,
      brand: cycle(JEWELRY_BRANDS, index),
      category: "Accessories",
      subcategory: "Jewellery",
      price: priceInRange(399, 2499, index),
      sizes: ["Free Size"],
      image: `/images/curated-fashion-50/women-jewelry-30/${file}`,
      gender: "Women",
      occasions: ["Festive", "Wedding", "Party", "Date Night", "Casual"],
      seasons: ["All Season"],
      styleTags: ["Traditional", "Boho", "Minimalist", "Classic"],
      material: cycle(
        jewelryType === "necklace"
          ? ["Gold Plated", "Silver", "Pearl"]
          : jewelryType === "earring"
            ? ["Gold Plated", "Silver", "Oxidised"]
            : ["Gold Plated", "Pearl", "Silver"],
        index,
      ),
      fit: "Free Size",
    })
  })

  pushProduct({
    name: "Kids Festive Sherwani Set",
    brand: "Zara",
    category: "Kids",
    subcategory: "Ethnic",
    price: 1999,
    sizes: ["S", "M", "L"],
    image: "/images/curated-fashion-50/indian-wedding-kids/135_indian-wedding-kids_9002.jpg",
    gender: "Kids",
    occasions: ["Wedding", "Festive", "Ethnic"],
    seasons: ["All Season"],
    styleTags: ["Traditional", "Ethnic"],
    material: "Silk Blend",
    fit: "Regular Fit",
  })

  MEN_MARRIAGE_FILES.forEach((file, index) => {
    const typeToken = file.split("_")[1]
    const subcategoryByType = {
      sherwani: "Sherwani",
      "kurta-paijama": "Kurta Paijama",
      "indo-western": "Indo Western",
      blazer: "Blazer",
      "shirt-pant": "Shirt Pant",
    }
    pushProduct({
      name: `Men ${toTitle(typeToken)} Set`,
      brand: cycle(MEN_MARRIAGE_BRANDS, index),
      category: "Men",
      subcategory: "Ethnic",
      price: priceInRange(2499, 6999, index),
      sizes: ["S", "M", "L", "XL"],
      image: `/images/curated-fashion-50/men-marriage-10/${file}`,
      gender: "Men",
      occasions: ["Wedding", "Festive", "Ethnic", "Party"],
      seasons: ["All Season"],
      styleTags: ["Traditional", "Ethnic", "Contemporary"],
      material: cycle(["Silk", "Cotton Blend", "Brocade", "Wool"], index),
      fit: cycle(["Regular Fit", "Slim Fit"], index),
    })
  })

  return products
}

export const DUMMY_PRODUCTS = buildCatalog()

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const priceBounds = useMemo(() => {
    return {
      minPrice: PRICE_MIN_LIMIT,
      maxPrice: PRICE_MAX_LIMIT,
    }
  }, [])

  const filterOptions = useMemo(() => {
    const categories = uniqueSorted(DUMMY_PRODUCTS.map((product) => product.category))
    const brands = uniqueSorted(DUMMY_PRODUCTS.map((product) => product.brand))

    const subcategoriesByCategory = DUMMY_PRODUCTS.reduce((acc, product) => {
      if (!product.subcategory) {
        return acc
      }

      if (!acc[product.category]) {
        acc[product.category] = new Set()
      }

      acc[product.category].add(product.subcategory)
      return acc
    }, {})

    const normalizedSubcategories = Object.keys(subcategoriesByCategory).reduce((acc, category) => {
      acc[category] = [...subcategoriesByCategory[category]].sort((a, b) => a.localeCompare(b))
      return acc
    }, {})

    return {
      categories,
      brands,
      sizes: DEFAULT_SIZES,
      colors: COLOR_OPTIONS,
      ratings: [4, 3],
      subcategoriesByCategory: normalizedSubcategories,
    }
  }, [])

  const parseFromParams = useMemo(() => {
    const rawMinParam = searchParams.get("priceMin")
    const rawMaxParam = searchParams.get("priceMax")
    const rawMin = rawMinParam === null ? Number.NaN : Number(rawMinParam)
    const rawMax = rawMaxParam === null ? Number.NaN : Number(rawMaxParam)
    const base = defaultFilterState(priceBounds.minPrice, priceBounds.maxPrice)

    const nextMin = Number.isFinite(rawMin) ? clamp(rawMin, priceBounds.minPrice, priceBounds.maxPrice) : base.priceMin
    const nextMax = Number.isFinite(rawMax) ? clamp(rawMax, priceBounds.minPrice, priceBounds.maxPrice) : base.priceMax

    return {
      categories: toList(searchParams.get("categories")),
      subcategory: searchParams.get("subcategory") || "",
      priceMin: Math.min(nextMin, nextMax),
      priceMax: Math.max(nextMin, nextMax),
      brands: toList(searchParams.get("brands")),
      ratings: toList(searchParams.get("ratings")).map(Number).filter((value) => Number.isFinite(value)),
      inStockOnly: searchParams.get("stock") === "1",
      colors: toList(searchParams.get("colors")),
      sizes: toList(searchParams.get("sizes")),
    }
  }, [priceBounds.maxPrice, priceBounds.minPrice, searchParams])

  const [filters, setFilters] = useState(() => parseFromParams)

  useEffect(() => {
    setFilters((prev) => {
      const current = JSON.stringify(prev)
      const next = JSON.stringify(parseFromParams)

      if (current === next) {
        return prev
      }

      return parseFromParams
    })
  }, [parseFromParams])

  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.categories.length) params.set("categories", filters.categories.join(","))
    if (filters.subcategory) params.set("subcategory", filters.subcategory)
    if (filters.brands.length) params.set("brands", filters.brands.join(","))
    if (filters.ratings.length) params.set("ratings", filters.ratings.join(","))
    if (filters.inStockOnly) params.set("stock", "1")
    if (filters.colors.length) params.set("colors", filters.colors.join(","))
    if (filters.sizes.length) params.set("sizes", filters.sizes.join(","))
    if (filters.priceMin !== priceBounds.minPrice) params.set("priceMin", String(filters.priceMin))
    if (filters.priceMax !== priceBounds.maxPrice) params.set("priceMax", String(filters.priceMax))

    const nextQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (nextQuery !== currentQuery) {
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      router.replace(nextUrl, { scroll: false })
    }
  }, [filters, pathname, priceBounds.maxPrice, priceBounds.minPrice, router, searchParams])

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter((product) => {
      if (filters.categories.length && !filters.categories.includes(product.category)) return false
      if (filters.subcategory && product.subcategory !== filters.subcategory) return false
      if (filters.brands.length && !filters.brands.includes(product.brand)) return false
      if (product.price < filters.priceMin || product.price > filters.priceMax) return false
      if (filters.ratings.length && !filters.ratings.some((rating) => product.rating >= rating)) return false
      if (filters.inStockOnly && !product.inStock) return false
      if (filters.colors.length && !filters.colors.some((color) => product.colors.includes(color))) return false
      if (filters.sizes.length && !filters.sizes.some((size) => product.sizes.includes(size))) return false
      return true
    })
  }, [filters])

  const updateFilters = (next) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }

  const toggleListValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const setPriceRange = (min, max) => {
    const safeMin = clamp(Number.isFinite(min) ? min : priceBounds.minPrice, priceBounds.minPrice, priceBounds.maxPrice)
    const safeMax = clamp(Number.isFinite(max) ? max : priceBounds.maxPrice, priceBounds.minPrice, priceBounds.maxPrice)

    updateFilters({
      priceMin: Math.min(safeMin, safeMax),
      priceMax: Math.max(safeMin, safeMax),
    })
  }

  const clearAll = () => {
    setFilters(defaultFilterState(priceBounds.minPrice, priceBounds.maxPrice))
  }

  const activeChips = useMemo(() => {
    const chips = []

    filters.categories.forEach((category) => {
      chips.push({ id: `category:${category}`, type: "category", value: category, label: category })
    })

    if (filters.subcategory) {
      chips.push({
        id: `subcategory:${filters.subcategory}`,
        type: "subcategory",
        value: filters.subcategory,
        label: filters.subcategory,
      })
    }

    if (filters.priceMin !== priceBounds.minPrice || filters.priceMax !== priceBounds.maxPrice) {
      chips.push({
        id: `price:${filters.priceMin}-${filters.priceMax}`,
        type: "price",
        value: "price",
        label: `Rs ${filters.priceMin} - Rs ${filters.priceMax}`,
      })
    }

    filters.brands.forEach((brand) => {
      chips.push({ id: `brand:${brand}`, type: "brand", value: brand, label: brand })
    })

    filters.ratings.forEach((rating) => {
      chips.push({
        id: `rating:${rating}`,
        type: "rating",
        value: rating,
        label: `${rating}★ & above`,
      })
    })

    if (filters.inStockOnly) {
      chips.push({ id: "stock:1", type: "stock", value: "1", label: "In Stock Only" })
    }

    filters.colors.forEach((color) => {
      chips.push({ id: `color:${color}`, type: "color", value: color, label: color })
    })

    filters.sizes.forEach((size) => {
      chips.push({ id: `size:${size}`, type: "size", value: size, label: size })
    })

    return chips
  }, [filters, priceBounds.maxPrice, priceBounds.minPrice])

  const removeActiveChip = (chip) => {
    switch (chip.type) {
      case "category":
        updateFilters({
          categories: filters.categories.filter((category) => category !== chip.value),
          subcategory: filters.categories.length === 1 ? "" : filters.subcategory,
        })
        break
      case "subcategory":
        updateFilters({ subcategory: "" })
        break
      case "price":
        setPriceRange(priceBounds.minPrice, priceBounds.maxPrice)
        break
      case "brand":
        toggleListValue("brands", chip.value)
        break
      case "rating":
        updateFilters({ ratings: filters.ratings.filter((rating) => rating !== chip.value) })
        break
      case "stock":
        updateFilters({ inStockOnly: false })
        break
      case "color":
        toggleListValue("colors", chip.value)
        break
      case "size":
        toggleListValue("sizes", chip.value)
        break
      default:
        break
    }
  }

  return {
    products: DUMMY_PRODUCTS,
    filteredProducts,
    filters,
    filterOptions,
    priceBounds,
    activeChips,
    hasActiveFilters: activeChips.length > 0,
    toggleCategory: (category) => {
      const next = filters.categories.includes(category)
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category]

      updateFilters({
        categories: next,
        subcategory: next.length === 0 ? "" : filters.subcategory,
      })
    },
    setSubcategory: (subcategory) => updateFilters({ subcategory }),
    setPriceRange,
    toggleRating: (rating) => toggleListValue("ratings", rating),
    setInStockOnly: (inStockOnly) => updateFilters({ inStockOnly }),
    toggleBrand: (brand) => toggleListValue("brands", brand),
    toggleColor: (color) => toggleListValue("colors", color),
    toggleSize: (size) => toggleListValue("sizes", size),
    clearAll,
    removeActiveChip,
  }
}
