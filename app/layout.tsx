import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { LikesProvider } from "@/contexts/likes-context"
import { Toaster } from "@/components/ui/toaster"
import { OrdersProvider } from "@/contexts/orders-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "3D Outfit Builder",
  description: "Create and customize your own 3D outfits",
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <CartProvider>
              <OrdersProvider>
                <LikesProvider>
                  <Navbar />
                  {children}
                  <Toaster />
                </LikesProvider>
              </OrdersProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
