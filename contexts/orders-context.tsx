"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem } from "@/contexts/cart-context"

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

export type OrderItem = Pick<CartItem, "id" | "name" | "price" | "image" | "modelUrl" | "color"> & {
  quantity: number
}

export type OrderRecord = {
  id: string
  orderNumber: string
  createdAt: number
  email?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  trackingNumber?: string
  shippingAddress?: {
    name: string
    address: string
    city: string
    zipCode: string
  }
  statusHistory: Array<{ status: OrderStatus; at: number }>
}

export type OrdersContextType = {
  orders: OrderRecord[]
  placeOrder: (payload: {
    email?: string
    items: OrderItem[]
    shippingAddress?: OrderRecord["shippingAddress"]
    subtotal: number
    shipping: number
    tax: number
    total: number
  }) => string
  getOrderById: (id: string) => OrderRecord | undefined
  updateOrderStatus: (id: string, status: OrderStatus) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

function generateOrderId() {
  return `ORD-${Date.now()}`
}
function generateOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `#${n}`
}
function generateTrackingNumber() {
  const n = Math.floor(100000000 + Math.random() * 900000000)
  return `TRK${n}`
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem("cosmic-orders")
    if (raw) {
      try {
        setOrders(JSON.parse(raw))
      } catch {
        localStorage.removeItem("cosmic-orders")
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cosmic-orders", JSON.stringify(orders))
  }, [orders])

  const placeOrder: OrdersContextType["placeOrder"] = ({ email, items, shippingAddress, subtotal, shipping, tax, total }) => {
    const id = generateOrderId()
    const record: OrderRecord = {
      id,
      orderNumber: generateOrderNumber(),
      createdAt: Date.now(),
      email,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: "processing",
      trackingNumber: generateTrackingNumber(),
      shippingAddress,
      statusHistory: [{ status: "processing", at: Date.now() }],
    }
    setOrders((prev) => [record, ...prev])
    return id
  }

  const getOrderById = (id: string) => orders.find((o) => o.id === id)

  const updateOrderStatus: OrdersContextType["updateOrderStatus"] = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status, statusHistory: [...o.statusHistory, { status, at: Date.now() }] }
          : o,
      ),
    )
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}
