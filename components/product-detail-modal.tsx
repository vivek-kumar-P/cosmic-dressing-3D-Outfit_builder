"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Heart,
  Wand2,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Check,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useLikes } from "@/contexts/likes-context"
import { toast } from "@/hooks/use-toast"
import ProductModelViewer from "@/components/3d/product-model-viewer"

export interface ProductDetailItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  modelUrl?: string
  color: string
  description?: string
  brand?: string
  gender?: string
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
}

interface ProductDetailModalProps {
  item: ProductDetailItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomize?: () => void
  similarItems?: ProductDetailItem[]
}

// Fallback similar items for recommendation
const getSimilarItems = (item: ProductDetailItem): ProductDetailItem[] => {
  const similarCategories = [
    { id: 101, name: "Stellar Hoodie", category: item.category, price: 59, image: "/placeholder.svg", color: "#4A90E2", description: "Premium quality matching piece" },
    { id: 102, name: "Cosmic Vest", category: item.category, price: 45, image: "/placeholder.svg", color: "#8E44AD", description: "Complementary style item" },
    { id: 103, name: "Galaxy Overlay", category: item.category, price: 52, image: "/placeholder.svg", color: "#00C4B4", description: "Perfect match for your style" },
  ]
  return similarCategories.slice(0, 3)
}

export default function ProductDetailModal({
  item,
  open,
  onOpenChange,
  onCustomize,
  similarItems: similarItemsProp,
}: ProductDetailModalProps) {
  const { addItem } = useCart()
  const { addLike, removeLike, isLiked } = useLikes()
  const [selectedColor, setSelectedColor] = useState(item?.color || "#4A90E2")
  const [selectedSize, setSelectedSize] = useState<string>("M")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!item) return

    setSelectedColor(item.color || "#4A90E2")
    setSelectedSize("M")
    setQuantity(1)
  }, [item])

  if (!item) return null

  const similarItems = similarItemsProp?.length ? similarItemsProp : getSimilarItems(item)
  const isItemLiked = isLiked(item.id)

  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
  const availableColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
  const stock = item.stockCount ?? 24

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        modelUrl: item.modelUrl || "",
        color: selectedColor,
      })
    }
    toast({
      title: "Added to cart",
      description: `${quantity} × ${item.name} added to your cart`,
    })
    setQuantity(1)
  }

  const handleToggleLike = () => {
    if (isItemLiked) {
      removeLike(item.id)
      toast({
        title: "Removed from likes",
        description: `${item.name} removed from your likes`,
      })
    } else {
      addLike({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        color: selectedColor,
        description: item.description,
      })
      toast({
        title: "Added to likes",
        description: `${item.name} added to your likes`,
      })
    }
  }

  const handleCustomize = () => {
    if (onCustomize) {
      onCustomize()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F1A] border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          <DialogDescription className="text-zinc-400">{item.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Product Image/Model Viewer */}
          <div className="space-y-4">
            <div className="h-[400px] bg-[#0A0A1A] rounded-lg overflow-hidden border border-zinc-700">
              {item.modelUrl ? (
                <ProductModelViewer
                  modelUrl={item.modelUrl}
                  interactive={true}
                  autoRotate={true}
                  height="400px"
                  modelColor={selectedColor}
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Floating badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Check className="h-3 w-3 mr-1" />
                In Stock ({stock} available)
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Star className="h-3 w-3 mr-1" />
                4.8/5 (234 reviews)
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#00C4B4]">${item.price}</span>
                  <span className="text-zinc-500 line-through text-lg">${(item.price * 1.2).toFixed(2)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleLike}
                  className={`h-12 w-12 rounded-full transition-all ${
                    isItemLiked
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isItemLiked ? "fill-current" : ""}`} />
                </Button>
              </div>
              <p className="text-zinc-400">Category: <span className="text-white capitalize">{item.category}</span></p>
              {item.brand ? <p className="text-zinc-400">Brand: <span className="text-white">{item.brand}</span></p> : null}
              {item.gender ? <p className="text-zinc-400">Gender: <span className="text-white">{item.gender}</span></p> : null}
            </div>

            <Separator className="bg-zinc-800" />

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 text-sm mt-4">
                <div>
                  <h4 className="font-semibold text-zinc-300 mb-1">Description</h4>
                  <p className="text-zinc-400">{item.description || "Premium quality clothing item with cosmic-inspired design."}</p>
                </div>
                {item.voiceDescription ? (
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Quick Summary</h4>
                    <p className="text-zinc-400">{item.voiceDescription}</p>
                  </div>
                ) : null}
                <div>
                  <h4 className="font-semibold text-zinc-300 mb-1">Material</h4>
                  <p className="text-zinc-400">{item.material || "100% Premium Cotton, Soft-touch finish"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-300 mb-1">Care Instructions</h4>
                  <p className="text-zinc-400">Machine wash cold. Tumble dry low. Do not bleach.</p>
                </div>
                {item.styleTags?.length ? (
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Style Tags</h4>
                    <p className="text-zinc-400">{item.styleTags.join(", ")}</p>
                  </div>
                ) : null}
                {item.occasions?.length ? (
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Occasions</h4>
                    <p className="text-zinc-400">{item.occasions.join(", ")}</p>
                  </div>
                ) : null}
                {item.seasons?.length ? (
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Seasons</h4>
                    <p className="text-zinc-400">{item.seasons.join(", ")}</p>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="specs" className="space-y-3 text-sm mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Brand</h4>
                    <p className="text-zinc-400">{item.brand || "Cosmic Apparel Co."}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Manufacturer</h4>
                    <p className="text-zinc-400">Made in Vietnam</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Design Type</h4>
                    <p className="text-zinc-400">Modern Casual</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Weight</h4>
                    <p className="text-zinc-400">~180g (M size)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Fit</h4>
                    <p className="text-zinc-400">{item.fit || "Regular Fit"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4 mt-4">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-[#00C4B4] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Free shipping on orders over $50</p>
                    <p className="text-zinc-400">Estimated delivery: 5-7 business days</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-[#00C4B4] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">30-day returns</p>
                    <p className="text-zinc-400">Full refund if not satisfied</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Size and Color Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-white shadow-lg scale-110"
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-md transition-all text-sm font-medium ${
                        selectedSize === size
                          ? "bg-[#00C4B4] text-black"
                          : "bg-zinc-900 text-white hover:bg-zinc-800"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Quantity</label>
                <div className="flex items-center border border-zinc-700 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-zinc-800"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#00C4B4] hover:bg-[#00C4B4]/90 text-black font-semibold py-6"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                onClick={handleCustomize}
                className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#00C4B4] hover:opacity-90 text-white font-semibold py-6"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <h3 className="text-xl font-bold mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarItems.map((similar) => (
              <Card
                key={similar.id}
                className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="h-[200px] bg-zinc-800 rounded-t-lg overflow-hidden group-hover:scale-105 transition-transform">
                    <img
                      src={similar.image}
                      alt={similar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{similar.name}</p>
                    <p className="text-[#00C4B4] font-bold text-sm">${similar.price}</p>
                    <p className="text-zinc-500 text-xs mt-1">{similar.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
