"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ArrowLeft, Save, Wand2 } from "lucide-react"
import Link from "next/link"
import { useSnapshot } from "valtio"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CanvasStage from "@/components/customizer/CanvasStage"
import ColorPicker from "@/components/customizer/controls/ColorPicker"
import FilePicker from "@/components/customizer/controls/FilePicker"
import LogoGrid from "@/components/customizer/controls/LogoGrid"
import LogoPresets from "@/components/customizer/controls/LogoPresets"
import ScreenshotButton from "@/components/customizer/ScreenshotButton"
import { customizationState } from "@/components/customizer/CustomizationStore"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"

export default function CustomizePage() {
  const snap = useSnapshot(customizationState)
  const { addItem } = useCart()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Page entrance animations
    gsap.fromTo(".customize-header", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })

    gsap.fromTo(
      ".customize-content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" },
    )
  }, [])

  const handleSaveToCart = async () => {
    setIsSaving(true)
    const fallbackImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="

    try {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement | null
      const image = canvas ? canvas.toDataURL("image/png") : fallbackImage
      const id = Date.now()

      addItem({
        id,
        name: "Custom T-Shirt",
        category: "custom",
        price: 49,
        image,
        modelUrl: "/models/shirt_baked.glb",
        color: snap.color,
        description: snap.isLogoTexture || snap.isFullTexture ? "Custom print applied" : "Solid color tee",
      })

      toast({
        title: "Added to cart",
        description: "Your custom tee was saved with the current color and logo.",
      })
    } catch (error) {
      console.error("Failed to save custom tee", error)
      toast({
        title: "Could not save",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#2a1a4a] text-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="customize-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00c4b4] to-[#007bff]">
                3D Outfit Builder
              </h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">Create your perfect look</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSaveToCart}
              size="sm"
              className="bg-gradient-to-r from-[#00c4b4] to-[#007bff] text-white hover:opacity-90 flex-1 sm:flex-none"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save to Cart"}
            </Button>
            <ScreenshotButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="customize-content grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 h-[400px] md:h-[600px]">
              <CardContent className="p-4 md:p-6 h-full">
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a3a] to-[#2a1a4a] rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0">
                    <CanvasStage />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Panel */}
          <div className="order-1 lg:order-2">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <Wand2 className="h-4 w-4" /> Live T-Shirt Customizer
                    </h2>
                    <p className="text-xs text-gray-400">Changes apply instantly to the 3D preview.</p>
                  </div>
                  <span className="text-xs text-gray-400">Color: {snap.color.toUpperCase()}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-300">Color</h3>
                  <ColorPicker />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-300">Logo & Texture</h3>
                  <FilePicker />
                  <LogoPresets />
                  <LogoGrid />
                  <div className="flex flex-col gap-2 text-xs text-gray-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={snap.isLogoTexture}
                        onChange={(e) => (customizationState.isLogoTexture = e.target.checked)}
                        className="accent-[#00c4b4]"
                      />
                      Show chest logo
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={snap.isFullTexture}
                        onChange={(e) => (customizationState.isFullTexture = e.target.checked)}
                        className="accent-[#00c4b4]"
                      />
                      Full-shirt texture
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSaveToCart}
                    className="flex-1 bg-gradient-to-r from-[#00c4b4] to-[#007bff] hover:opacity-90"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save to Cart"}
                  </Button>
                  <ScreenshotButton />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
