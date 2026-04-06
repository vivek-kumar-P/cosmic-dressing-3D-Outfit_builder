"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, Mail, Package, Truck, Home, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { useOrders } from "@/contexts/orders-context"

interface OrderDetailsUI {
  orderId: string
  orderNumber: string
  date: string
  items: { id: number; name: string; price: number; quantity: number; image?: string }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  email?: string
  shippingAddress?: {
    name: string
    address: string
    city: string
    zipCode: string
  }
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetailsUI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getOrderById } = useOrders()

  useEffect(() => {
    const id = params?.orderId as string
    if (!id) return
    const rec = getOrderById(id)
    if (rec) {
      setOrder({
        orderId: rec.id,
        orderNumber: rec.orderNumber,
        date: new Date(rec.createdAt).toLocaleString(),
        items: rec.items,
        subtotal: rec.subtotal,
        shipping: rec.shipping,
        tax: rec.tax,
        total: rec.total,
        status: rec.status,
        email: rec.email,
        shippingAddress: rec.shippingAddress,
      })
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [params, getOrderById])

  const handleDownloadInvoice = () => {
    if (!order) return

    const lines = [
      "INVOICE",
      `Order Number: ${order.orderNumber}`,
      `Order ID: ${order.orderId}`,
      `Date: ${order.date}`,
      `Status: ${order.status}`,
      `Email: ${order.email || ""}`,
      "",
      "Items:",
      ...order.items.map((item) => `- ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)}`),
      "",
      "Totals:",
      `Subtotal: $${order.subtotal.toFixed(2)}`,
      `Shipping: $${order.shipping.toFixed(2)}`,
      `Tax: $${order.tax.toFixed(2)}`,
      `Total: $${order.total.toFixed(2)}`,
      "",
      "Shipping Address:",
      order.shippingAddress
        ? `${order.shippingAddress.name}\n${order.shippingAddress.address}\n${order.shippingAddress.city}, ${order.shippingAddress.zipCode}`
        : "Not provided",
      "",
      "Thank you for shopping with Cosmic Outfits!",
    ]

    const blob = new Blob([lines.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${order.orderNumber || order.orderId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A1A] to-[#1A1A3A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C4B4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A1A] to-[#1A1A3A] flex items-center justify-center">
        <Card className="bg-[#1A1A1A] border-zinc-800 max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
            <p className="text-zinc-400 mb-6">We couldn't find the order you're looking for.</p>
            <Button asChild className="bg-gradient-to-r from-[#007BFF] to-[#00C4B4]">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A1A] to-[#1A1A3A] text-white py-20 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-zinc-400 text-lg">Thank you for your purchase</p>
          <Badge className="mt-4 bg-[#00C4B4] text-black">
            Order {order.orderNumber}
          </Badge>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Confirmation email sent</p>
              <p className="text-sm text-zinc-400">
                We've sent a confirmation email to <span className="text-[#00C4B4]">{order.email}</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Items */}
            <Card className="bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#00C4B4]" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#00C4B4]" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-zinc-400">{order.shippingAddress.address}</p>
                    <p className="text-zinc-400">
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-400">No shipping address provided</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="bg-[#1A1A1A]/80 border-[#00C4B4]/30 backdrop-blur-lg sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-zinc-700" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#00C4B4]">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <strong className="text-white">Order Date:</strong>
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white">Status:</strong>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleDownloadInvoice}
                  variant="outline"
                  className="w-full border-zinc-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button
            asChild
            variant="outline"
            className="flex-1 border-zinc-700 hover:bg-zinc-800"
          >
            <Link href="/orders">
              <Package className="h-4 w-4 mr-2" />
              View All Orders
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-[#007BFF] to-[#00C4B4] hover:opacity-90"
          >
            <Link href="/gallery">
              <Home className="h-4 w-4 mr-2" />
              Continue Browsing
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
