import { Suspense } from "react"
import CartPage from "@/components/cart/cart-page"

export default function Cart() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#0A0A1A] via-[#1A1A3A] to-[#2A1A4A] flex items-center justify-center"><div className="text-white">Loading cart...</div></div>}>
      <CartPage />
    </Suspense>
  )
}
