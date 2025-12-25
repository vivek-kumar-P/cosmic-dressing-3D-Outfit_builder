"use client"

import { useLikes } from "@/contexts/likes-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LikedItems() {
  const { likedItems, removeLike } = useLikes()
  const { addItem } = useCart()

  if (likedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Liked Items Yet</h3>
        <p className="text-gray-500">Items you like will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Total liked items: {likedItems.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {likedItems.map((item) => (
          <Card key={item.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all">
            <CardContent className="p-4">
              <div className="relative h-[200px] rounded-lg overflow-hidden mb-4 bg-zinc-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#00C4B4] font-bold">${item.price}</span>
                  {item.color && (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: item.color }}
                      title={`Color: ${item.color}`}
                    />
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Liked {new Date(item.likedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      price: item.price,
                      image: item.image,
                      modelUrl: "",
                      color: item.color,
                    })
                    toast({
                      title: "Added to cart",
                      description: `${item.name} added to your cart`,
                    })
                  }}
                  className="flex-1 bg-[#00C4B4] hover:bg-[#00C4B4]/90 text-black font-medium"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>

                <Button
                  onClick={() => {
                    removeLike(item.id)
                    toast({
                      title: "Removed",
                      description: `${item.name} removed from your likes`,
                    })
                  }}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
