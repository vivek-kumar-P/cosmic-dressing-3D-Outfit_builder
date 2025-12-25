"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Check, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useOrders } from "@/contexts/orders-context"
import { useAuth } from "@/contexts/auth-context"
import { calculateTotals } from "@/lib/pricing"

export default function CheckoutForm() {
  const router = useRouter()
  const { items: cartItems, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const { profile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")

  useEffect(() => {
    if (!profile) return
    // Split full name conservatively into first/last tokens
    const tokens = (profile.full_name || "").trim().split(" ")
    setFirstName(tokens[0] || "")
    setLastName(tokens.slice(1).join(" "))
    setEmail(profile.email || "")
    setAddress(profile.street_address || "")
    setCity(profile.city || "")
    setZipCode(profile.postal_code || "")
  }, [profile])

  const { subtotal, shipping, tax, total } = calculateTotals({ items: cartItems })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      setFormError("Your cart is empty. Add items before checkout.")
      router.push("/cart")
      return
    }
    setIsSubmitting(true)
    const name = `${firstName.trim()} ${lastName.trim()}`.trim()

    setTimeout(() => {
      // Build order items from cart
      const itemsForOrder = cartItems.map((ci) => ({
        id: ci.id,
        name: ci.name,
        price: ci.price,
        quantity: ci.quantity,
        image: ci.image,
        modelUrl: ci.modelUrl,
        color: ci.color,
      }))

      const orderId = placeOrder({
        email,
        items: itemsForOrder,
        shippingAddress: name || address ? { name, address, city, zipCode } : undefined,
        subtotal,
        shipping,
        tax,
        total,
      })

      clearCart()
      setIsSubmitting(false)
      router.push(`/order-confirmation/${orderId}`)
    }, 1200)
  }

  return (
    <Card className="bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg">
      {!isComplete ? (
        <CardContent className="p-6 checkout-form">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-zinc-800" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
                <span className="text-[#00C4B4]">${total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

            {formError && <p className="text-red-400 text-sm mb-3">{formError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your street address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Enter your zip code"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="bg-[#0A0A1A] border-zinc-700"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="border-zinc-700 flex-1" disabled={isSubmitting}>
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#007BFF] to-[#00C4B4] hover:opacity-90 border-0 flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Complete Purchase (Demo)</>
                )}
              </Button>
            </div>

            <p className="text-xs text-zinc-500 text-center mt-4">
              This is a demo checkout. No actual payment will be processed.
            </p>
          </form>
        </CardContent>
      ) : (
        <CardContent className="p-6 success-message">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#00C4B4] rounded-full mx-auto flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-black" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Thanks for shopping!</h2>
            <p className="text-zinc-400 mb-8">Your order has been confirmed</p>

            <div className="flex justify-center gap-4 mb-8">
              <Star className="success-star h-6 w-6 text-yellow-400" />
              <Star className="success-star h-8 w-8 text-yellow-400" />
              <Star className="success-star h-10 w-10 text-yellow-400" />
              <Star className="success-star h-8 w-8 text-yellow-400" />
              <Star className="success-star h-6 w-6 text-yellow-400" />
            </div>

            {/* Receipt Card */}
            <Card className="mb-8 mx-auto max-w-sm bg-[#0A0A1A] border-[#00C4B4]/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-center mb-4 text-[#00C4B4]">Order Receipt</h3>
                <div className="space-y-2 text-left mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-2 bg-zinc-800" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    // Create receipt content
                    const receiptContent = `
                      ORDER RECEIPT
                      -----------------------------
                      ${items.map((item) => `${item.name}: $${item.price.toFixed(2)}`).join("\n")}
                      -----------------------------
                      Total: $${totalPrice.toFixed(2)}
                      
                      Thank you for shopping with 3D Outfit Builder!
                      Order Date: ${new Date().toLocaleDateString()}
                    `

                    // Create blob and download link
                    const blob = new Blob([receiptContent], { type: "text/plain" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `receipt-${Date.now()}.txt`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#00C4B4]/30 hover:bg-[#00C4B4]/10"
                >
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-gradient-to-r from-[#007BFF] to-[#00C4B4] hover:opacity-90 border-0">
                <Link href="/outfit-picker">Continue Shopping</Link>
              </Button>

              <Button asChild variant="outline" className="border-zinc-700">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
