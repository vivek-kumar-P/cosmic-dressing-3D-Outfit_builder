"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Share2, TrendingUp, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"

const trendingOutfits = [
  {
    id: 1,
    title: "Summer Breeze Collection",
    creator: "Sarah M.",
    image: "/images/curated-fashion-50/women-wear-products-50/06_t-shirt_36908588.jpg",
    likes: 1234,
    views: 5678,
    tags: ["Summer", "Casual", "Trendy"],
    trending: true,
    price: 89.99,
    colors: ["White", "Blue"],
    season: "Summer",
    occasion: "Casual",
    fabric: "Cotton",
  },
  {
    id: 2,
    title: "Urban Street Style",
    creator: "Alex K.",
    image: "/images/curated-fashion-50/fashion/07_fashion_20441555.jpg",
    likes: 987,
    views: 3456,
    tags: ["Street", "Urban", "Cool"],
    trending: true,
    price: 129.99,
    colors: ["Black", "Gray"],
    season: "Autumn",
    occasion: "Streetwear",
    fabric: "Denim",
  },
  {
    id: 3,
    title: "Elegant Evening Wear",
    creator: "Emma R.",
    image: "/images/curated-fashion-50/women-wear-products-50/44_saaree_30592270.jpg",
    likes: 2156,
    views: 7890,
    tags: ["Elegant", "Evening", "Formal"],
    trending: true,
    price: 199.99,
    colors: ["Gold", "Red"],
    season: "Winter",
    occasion: "Formal",
    fabric: "Silk",
  },
  {
    id: 4,
    title: "Cozy Autumn Vibes",
    creator: "Mike D.",
    image: "/images/curated-fashion-50/men-shirts-10/07_men-shirt_9558723.jpg",
    likes: 876,
    views: 2345,
    tags: ["Autumn", "Cozy", "Warm"],
    trending: false,
    price: 79.99,
    colors: ["Brown", "Beige"],
    season: "Autumn",
    occasion: "Casual",
    fabric: "Wool",
  },
  {
    id: 5,
    title: "Business Professional",
    creator: "Lisa W.",
    image: "/images/curated-fashion-50/fashion/22_fashion_23947090.jpg",
    likes: 654,
    views: 1987,
    tags: ["Business", "Professional", "Smart"],
    trending: false,
    price: 159.99,
    colors: ["Navy", "White"],
    season: "Spring",
    occasion: "Work",
    fabric: "Cotton",
  },
  {
    id: 6,
    title: "Bohemian Chic",
    creator: "Maya P.",
    image: "/images/curated-fashion-50/fashion/16_fashion_9821877.jpg",
    likes: 1543,
    views: 4321,
    tags: ["Bohemian", "Chic", "Artistic"],
    trending: true,
    price: 109.99,
    colors: ["Green", "Beige"],
    season: "Summer",
    occasion: "Party",
    fabric: "Linen",
  },
]

export default function TrendingOutfits() {
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set())
  const { addItem } = useCart()

  const handleLike = (outfitId: number) => {
    setLikedOutfits((prev) => {
      const newLikes = new Set(prev)
      if (newLikes.has(outfitId)) {
        newLikes.delete(outfitId)
        toast({
          title: "Removed from favorites",
          description: "Outfit removed from your favorites",
        })
      } else {
        newLikes.add(outfitId)
        toast({
          title: "Added to favorites",
          description: "Outfit added to your favorites",
        })
      }
      return newLikes
    })
  }

  const handleAddToCart = (outfit: typeof trendingOutfits[number]) => {
    addItem({
      id: outfit.id,
      name: outfit.title,
      category: "Outfit Collection",
      price: outfit.price,
      image: outfit.image,
      modelUrl: "",
      color: "#ffffff",
      description: `Created by ${outfit.creator} • ${outfit.tags.join(", ")}`,
    })
    toast({
      title: "Added to cart",
      description: `${outfit.title} has been added to your cart`,
    })
  }

  const handleShare = (outfit: typeof trendingOutfits[number]) => {
    if (navigator.share) {
      navigator.share({
        title: outfit.title,
        text: `Check out ${outfit.title} by ${outfit.creator}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Outfit link copied to clipboard",
      })
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trending
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Outfits
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular and inspiring outfit creations from our community of fashion enthusiasts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingOutfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:border-purple-300">
                <div className="relative overflow-hidden">
                  <Link href="/gallery">
                    <Image
                      src={outfit.image || "/placeholder.svg"}
                      alt={outfit.title}
                      width={300}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    />
                  </Link>
                  {outfit.trending && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      onClick={() => handleLike(outfit.id)}
                      className={`w-9 h-9 p-0 rounded-full backdrop-blur-sm transition-all ${
                        likedOutfits.has(outfit.id)
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-white/90 hover:bg-white text-gray-700"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedOutfits.has(outfit.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(outfit)}
                      className="w-9 h-9 p-0 rounded-full bg-purple-600 hover:bg-purple-700 text-white backdrop-blur-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleShare(outfit)}
                      className="w-9 h-9 p-0 rounded-full bg-white/90 hover:bg-white text-gray-700 backdrop-blur-sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-md text-lg font-bold px-3 py-1">
                      ${outfit.price}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Link href="/gallery">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-purple-700 transition-colors cursor-pointer">
                          {outfit.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">by {outfit.creator}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {outfit.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-purple-200 text-purple-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {outfit.colors.map((color) => (
                        <Badge key={color} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {color}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>{outfit.season}</span>
                      <span>{outfit.occasion}</span>
                      <span>{outfit.fabric}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Heart className={`w-4 h-4 ${likedOutfits.has(outfit.id) ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{(outfit.likes + (likedOutfits.has(outfit.id) ? 1 : 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{outfit.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <Link href="/gallery">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/gallery">
            <Button
              size="lg"
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View All Trending Outfits
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
