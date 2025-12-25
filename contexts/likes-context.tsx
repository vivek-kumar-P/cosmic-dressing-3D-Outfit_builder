"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type LikedItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
  color: string
  description?: string
  likedAt: number
}

type LikesContextType = {
  likedItems: LikedItem[]
  addLike: (item: Omit<LikedItem, "likedAt">) => void
  removeLike: (itemId: number) => void
  isLiked: (itemId: number) => boolean
  totalLikes: number
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([])

  // Load likes from localStorage on initial render
  useEffect(() => {
    if (typeof window === "undefined") return
    const savedLikes = localStorage.getItem("cosmic-likes")
    if (savedLikes) {
      try {
        setLikedItems(JSON.parse(savedLikes))
      } catch (error) {
        console.error("Failed to parse saved likes:", error)
        localStorage.removeItem("cosmic-likes")
      }
    }
  }, [])

  // Save likes to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cosmic-likes", JSON.stringify(likedItems))
  }, [likedItems])

  const addLike = (newItem: Omit<LikedItem, "likedAt">) => {
    setLikedItems((prevItems) => {
      // Check if item already exists in likes
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex >= 0) {
        // Item already liked, don't add again
        return prevItems
      } else {
        // Add new item with current timestamp
        return [...prevItems, { ...newItem, likedAt: Date.now() }]
      }
    })
  }

  const removeLike = (itemId: number) => {
    setLikedItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const isLiked = (itemId: number) => {
    return likedItems.some((item) => item.id === itemId)
  }

  const totalLikes = likedItems.length

  return (
    <LikesContext.Provider
      value={{
        likedItems,
        addLike,
        removeLike,
        isLiked,
        totalLikes,
      }}
    >
      {children}
    </LikesContext.Provider>
  )
}

export const useLikes = () => {
  const context = useContext(LikesContext)
  if (context === undefined) {
    throw new Error("useLikes must be used within a LikesProvider")
  }
  return context
}
