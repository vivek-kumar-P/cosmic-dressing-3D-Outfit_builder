import type { CartItem } from "@/contexts/cart-context"

export type PricingConfig = {
  taxRate: number
  shippingRate: number
  freeShippingThreshold: number
}

export const defaultPricingConfig: PricingConfig = {
  taxRate: 0.08,
  shippingRate: 9.99,
  freeShippingThreshold: 50,
}

export type PricingTotals = {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function calculateTotals({
  items,
  discount = 0,
  config = defaultPricingConfig,
}: {
  items: Pick<CartItem, "price" | "quantity">[]
  discount?: number
  config?: PricingConfig
}): PricingTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= config.freeShippingThreshold || subtotal === 0 ? 0 : config.shippingRate
  const taxable = Math.max(0, subtotal - discount)
  const tax = taxable * config.taxRate
  const total = subtotal - discount + shipping + tax
  return { subtotal, shipping, tax, total }
}
