"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect, useRef } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Menu, X, AlertCircle, RefreshCw, Upload, Package, Database } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { LightPosition } from "@/types"
import { useModelUpload } from "@/hooks/use-model-upload"
import { Scene } from "@/components/3d-viewer/scene"
import { CategorySidebar } from "@/components/outfit-builder/category-sidebar"
import { PlaygroundPanel } from "@/components/outfit-builder/playground-panel"
import { AssetLibraryModal } from "@/components/asset-manager/asset-library-modal"
import * as THREE from "three"
import { clearModelCache } from "@/lib/model-utils"
import { useGLTF } from "@react-three/drei"
import { seedDefaultModels } from "@/lib/actions/model-actions"

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </div>
  )
}

export default function Page() {
  const [showCategorySidebar, setShowCategorySidebar] = useState(true)
  const [showPlaygroundPanel, setShowPlaygroundPanel] = useState(true)
  const [showAssetLibrary, setShowAssetLibrary] = useState(false)
  const [isSeedingModels, setIsSeedingModels] = useState(false)
  const hasAttemptedSeed = useRef(false)

  const { toast } = useToast()

  const [mainLight, setMainLight] = useState<LightPosition>({ x: 0, y: 3, z: 5 })
  const [modelColor, setModelColor] = useState<string>("#cccccc")
  const [shirtColor, setShirtColor] = useState<string>("#4a90e2")
  const [showShirt, setShowShirt] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [currentAnimation, setCurrentAnimation] = useState<string>("")
  const [animationSpeed, setAnimationSpeed] = useState<number>(1)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  const [modelReloadKey, setModelReloadKey] = useState(0)

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({})
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({})

  const [bodyModelUrl, setBodyModelUrl] = useState<string>(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_body-rcOZSRE7s6nyArblYSi6fF9yertTgD.glb",
  )

  const [shoesUrl, setShoesUrl] = useState<string | undefined>()
  const [showShoes, setShowShoes] = useState<boolean>(false)
  const [shoesColor, setShoesColor] = useState<string>("#2c3e50")

  const [pantsUrl, setPantsUrl] = useState<string | undefined>()
  const [showPants, setShowPants] = useState<boolean>(false)
  const [pantsColor, setPantsColor] = useState<string>("#34495e")

  const [shirtUrl, setShirtUrl] = useState<string | undefined>()

  const [shirtScale, setShirtScale] = useState<number>(1.0)
  const [shoesScale, setShoesScale] = useState<number>(1.0)
  const [pantsScale, setPantsScale] = useState<number>(1.0)

  const {
    uploadedModels,
    activeModelUrl,
    setActiveModelUrl,
    fileInputRef,
    handleFileUpload,
    saveModel,
    deleteModel,
    renameModel,
    isLoadingFromDb,
    needsDatabaseSetup,
    refreshDatabase,
    resetToDefaultModel,
  } = useModelUpload()

  const handleModelError = (error: string) => {
    setLoadingError(error)
  }

  const handleAnimationsDetected = (animations: string[]) => {
    setAvailableAnimations(animations)
    setCurrentAnimation(animations[0] || "")
  }

  const handleSaveOutfit = () => {
    console.log("[3D Builder] Add to Cart clicked")
    
    // Build outfit data object
    const outfitData = {
      character: selectedItems.character || "default-body",
      shirt: selectedItems.shirt || (showShirt && shirtUrl ? "default-shirt" : null),
      pants: selectedItems.pants || (showPants && pantsUrl ? "default-pants" : null),
      shoes: selectedItems.shoes || (showShoes && shoesUrl ? "default-shoes" : null),
      accessories: selectedItems.accessories || null,
      colors: {
        shirt: shirtColor,
        pants: pantsColor,
        shoes: shoesColor,
      },
      urls: {
        body: bodyModelUrl,
        shirt: shirtUrl,
        pants: pantsUrl,
        shoes: shoesUrl,
      },
      timestamp: new Date().toISOString(),
    }

    console.log("[3D Builder] Outfit data:", outfitData)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedOutfit", JSON.stringify(outfitData))
      
      toast({
        title: "Outfit saved! 🎉",
        description: "Redirecting to cart...",
      })

      // Redirect to main app's cart page
      setTimeout(() => {
        window.location.href = "/cart"
      }, 500)
    }
  }

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason)

      if (errorMessage.includes("Missing closing }") || errorMessage.includes("@utility")) {
        event.preventDefault()
        return
      }

      if (
        errorMessage.includes("not valid JSON") ||
        errorMessage.includes("Invalid re") ||
        errorMessage.includes("Too Many")
      ) {
        event.preventDefault()
        return
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  const handleModelSelect = (url: string) => {
    setActiveModelUrl(url)
    setLoadingError(null)
    setAvailableAnimations([])
    setCurrentAnimation("")
    setModelReloadKey((prev) => prev + 1)
    setShowAssetLibrary(false)
    setBodyModelUrl(url)
  }

  const handleDefaultBodyClick = () => {
    console.log("[v0] Default Body clicked - resetting to naked body")

    const defaultBodyUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_body-rcOZSRE7s6nyArblYSi6fF9yertTgD.glb"

    setBodyModelUrl(defaultBodyUrl)
    setActiveModelUrl(defaultBodyUrl)

    setShowShirt(false)
    setShowShoes(false)
    setShowPants(false)
    setShirtUrl(undefined)
    setShoesUrl(undefined)
    setPantsUrl(undefined)

    setShirtScale(1.0)
    setShoesScale(1.0)
    setPantsScale(1.0)

    setSelectedItems({ character: "default-body" })

    setCategoryColors({
      character: "#f5d5c8",
      shoes: "#2c3e50",
      pants: "#34495e",
      tshirt: "#ffffff",
      shirt: "#4a90e2",
      accessories: "#95a5a6",
    })

    setModelReloadKey((prev) => prev + 1)

    console.log("[v0] Body reset complete - showing naked body only")
  }

  const handleWomanDefaultClick = () => {
    console.log("[v0] Woman Default clicked - loading female body")

    const womanBodyUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl_body-fnVrNBzImBXQXAXZQuNrMARzUXlOeh.glb"

    setBodyModelUrl(womanBodyUrl)
    setActiveModelUrl(womanBodyUrl)

    setShowShirt(false)
    setShowShoes(false)
    setShowPants(false)
    setShirtUrl(undefined)
    setShoesUrl(undefined)
    setPantsUrl(undefined)

    setShirtScale(1.0)
    setShoesScale(1.0)
    setPantsScale(1.0)

    setSelectedItems({ character: "woman-default" })

    setCategoryColors({
      character: "#f5d5c8",
      shoes: "#2c3e50",
      pants: "#34495e",
      tshirt: "#ffffff",
      shirt: "#4a90e2",
      accessories: "#95a5a6",
    })

    setModelReloadKey((prev) => prev + 1)

    console.log("[v0] Woman body loaded - showing naked female body only")
  }

  const handleDefaultShirtClick = () => {
    console.log("[v0] Default Shirt clicked - loading just_shirt.glb")

    setShirtUrl("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/just_shirt-KiWazVV6pBTrQh3ibHOgJuq7nQchd7.glb")
    setShowShirt(true)
    setShirtColor("#4a90e2")
    setCategoryColors({ ...categoryColors, shirt: "#4a90e2" })
  }

  const handleLadiesShirtClick = () => {
    console.log("[v0] Ladies Turtle Neck T-Shirt clicked")
    setShirtUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/turtle_neck_tshirt_for_ladies-3NyJJn7c9oUEewWpAVAsTxNyM0Ywh0.glb",
    )
    setShowShirt(true)
    setShirtColor("#ffffff")
    setCategoryColors({ ...categoryColors, shirt: "#ffffff" })
    setSelectedItems({ ...selectedItems, shirt: "ladies-turtle-neck" })
  }

  const handleLadiesShoesClick = () => {
    console.log("[v0] Ladies Full Shoes clicked")
    setShoesUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fullShoes_for_ladies-Pa3caedOdHia5UQhzHbZaQF5UxL7VR.glb",
    )
    setShowShoes(true)
    setShoesColor("#2c3e50")
    setCategoryColors({ ...categoryColors, shoes: "#2c3e50" })
    setSelectedItems({ ...selectedItems, shoes: "ladies-full-shoes" })
  }

  const handleLadiesPantsClick = () => {
    console.log("[v0] Ladies Black Pants clicked")
    setPantsUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blackpants_for_ladies-dXHiPee6STtgkvIi4Cwu62dfz9YlY8.glb",
    )
    setShowPants(true)
    setPantsColor("#000000")
    setCategoryColors({ ...categoryColors, pants: "#000000" })
    setSelectedItems({ ...selectedItems, pants: "ladies-black-pants" })
  }

  const handlePrintedShoesClick = () => {
    console.log("[v0] Printed Shoes for Ladies clicked")
    setShoesUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/printed_fullshoes_for_ladies-h1J65nxUJ5MzyK1WW3Td2WPt8DuVi3.glb",
    )
    setShowShoes(true)
    setShoesColor("#8b4513")
    setCategoryColors({ ...categoryColors, shoes: "#8b4513" })
    setSelectedItems({ ...selectedItems, shoes: "printed-shoes-ladies" })
  }

  const handleLeatherDressClick = () => {
    console.log("[v0] Leather Full Dress for Ladies clicked")
    setShirtUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leather_fulldress_for_ladies-G5dJvzw4zMilPerVFOVLGsjY1VhOmp.glb",
    )
    setShowShirt(true)
    setShirtColor("#654321")
    setCategoryColors({ ...categoryColors, shirt: "#654321" })
    setSelectedItems({ ...selectedItems, tshirt: "leather-dress-ladies" })
  }

  const handleResetModelSize = () => {
    console.log("[v0] Resetting model sizes - clearing all caches")

    clearModelCache()
    useGLTF.clear()

    if (activeModelUrl) {
      const timestamp = Date.now()
      const separator = activeModelUrl.includes("?") ? "&" : "?"
      const urlWithCacheBust = `${activeModelUrl}${separator}_t=${timestamp}`

      console.log("[v0] Forcing model reload with cache-bust URL")

      handleModelSelect("")

      setTimeout(() => {
        setActiveModelUrl(activeModelUrl)
        setModelReloadKey((prev) => prev + 1)
      }, 100)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSeedModels = async () => {
    hasAttemptedSeed.current = true
    setIsSeedingModels(true)

    const result = await seedDefaultModels()

    if (result.needsSetup) {
      toast({
        title: "Database Setup Required",
        description: "Please set up the database table first using the 'Setup Database' button.",
        variant: "destructive",
      })
    } else if (result.success) {
      toast({
        title: "Models Seeded Successfully",
        description: `Added ${result.insertedCount} models to the database.`,
      })
      await refreshDatabase()
    } else {
      toast({
        title: "Seeding Failed",
        description: result.error || "Failed to seed models",
        variant: "destructive",
      })
    }

    setIsSeedingModels(false)
  }

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-background">
      <Toaster />

      <input
        ref={fileInputRef}
        type="file"
        accept=".gltf,.glb,.bin,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <AssetLibraryModal
        open={showAssetLibrary}
        onOpenChange={setShowAssetLibrary}
        uploadedModels={uploadedModels}
        onModelSelect={handleModelSelect}
        onDeleteModel={deleteModel}
        onRenameModel={renameModel}
        onUploadClick={handleUploadClick}
        isLoading={isLoadingFromDb}
        activeModelUrl={activeModelUrl}
      />

      <div className="absolute left-4 top-4 z-30 lg:hidden">
        <Button
          onClick={() => setShowCategorySidebar(!showCategorySidebar)}
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-card/95 shadow-lg backdrop-blur-sm"
        >
          {showCategorySidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {showCategorySidebar && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowCategorySidebar(false)}
        />
      )}

      <CategorySidebar
        show={showCategorySidebar}
        onClose={() => setShowCategorySidebar(false)}
        shirtColor={shirtColor}
        onShirtColorChange={setShirtColor}
        showShirt={showShirt}
        onShowShirtChange={setShowShirt}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        categoryColors={categoryColors}
        onCategoryColorsChange={setCategoryColors}
        onDefaultBodyClick={handleDefaultBodyClick}
        onDefaultShirtClick={handleDefaultShirtClick}
        onWomanDefaultClick={handleWomanDefaultClick}
        onLadiesShirtClick={handleLadiesShirtClick}
        onLadiesShoesClick={handleLadiesShoesClick}
        onLadiesPantsClick={handleLadiesPantsClick}
        onPrintedShoesClick={handlePrintedShoesClick}
        onLeatherDressClick={handleLeatherDressClick}
        shoesColor={shoesColor}
        onShoesColorChange={setShoesColor}
        showShoes={showShoes}
        onShowShoesChange={setShowShoes}
        pantsColor={pantsColor}
        onPantsColorChange={setPantsColor}
        showPants={showPants}
        onShowPantsChange={setShowPants}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">3D</span>
            </div>
            <h1 className="text-lg font-semibold">Outfit Builder</h1>
          </div>

          <div className="flex items-center gap-2">
            {needsDatabaseSetup && (
              <Button
                onClick={handleSeedModels}
                variant="outline"
                size="sm"
                className="hidden md:flex bg-transparent"
                disabled={isSeedingModels}
                title="Seed default models into database after setup"
              >
                {isSeedingModels ? <Spinner className="mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
                Seed Models
              </Button>
            )}

            <Button
              onClick={() => setShowAssetLibrary(true)}
              variant="outline"
              size="sm"
              className="hidden md:flex bg-transparent"
              title="Open Asset Library"
            >
              <Package className="mr-2 h-4 w-4" />
              Asset Library
            </Button>

            <Button
              onClick={handleResetModelSize}
              variant="outline"
              size="sm"
              className="hidden md:flex bg-transparent"
              title="Reset model to original size and position"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Model Size
            </Button>

            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              className="hidden md:flex bg-transparent"
              title="Upload a new 3D model"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Model
            </Button>

            <Button
              onClick={() => setShowPlaygroundPanel(!showPlaygroundPanel)}
              variant="outline"
              size="sm"
              className="lg:hidden"
            >
              {showPlaygroundPanel ? "Hide" : "Show"} Controls
            </Button>
          </div>
        </div>

        <div className="relative flex-1">
          {loadingError && (
            <div className="absolute left-4 top-4 z-10 w-[calc(100%-2rem)] max-w-md">
              <Alert variant="destructive" className="shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{loadingError}</AlertDescription>
              </Alert>
            </div>
          )}

          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              key={modelReloadKey}
              shadows
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
              }}
              dpr={[1, 2]}
              className="h-full w-full"
            >
              <Scene
                modelUrl={activeModelUrl}
                mainLight={mainLight}
                modelColor={modelColor}
                onModelError={handleModelError}
                shirtColor={shirtColor}
                showShirt={showShirt}
                onAnimationsDetected={handleAnimationsDetected}
                currentAnimation={currentAnimation}
                animationSpeed={animationSpeed}
                isPlaying={isPlaying}
                bodyModelUrl={bodyModelUrl}
                shoesUrl={shoesUrl}
                showShoes={showShoes}
                shoesColor={shoesColor}
                pantsUrl={pantsUrl}
                showPants={showPants}
                pantsColor={pantsColor}
                shirtUrl={shirtUrl}
                shirtScale={shirtScale}
                shoesScale={shoesScale}
                pantsScale={pantsScale}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>

      <PlaygroundPanel
        show={showPlaygroundPanel}
        onClose={() => setShowPlaygroundPanel(false)}
        mainLight={mainLight}
        onMainLightChange={setMainLight}
        availableAnimations={availableAnimations}
        currentAnimation={currentAnimation}
        onAnimationChange={setCurrentAnimation}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isPlaying={isPlaying}
        onPlayPauseChange={setIsPlaying}
        onSaveOutfit={handleSaveOutfit}
        shirtScale={shirtScale}
        onShirtScaleChange={setShirtScale}
        shoesScale={shoesScale}
        onShoesScaleChange={setShoesScale}
        pantsScale={pantsScale}
        onPantsScaleChange={setPantsScale}
        showShirt={showShirt}
        showShoes={showShoes}
        showPants={showPants}
      />
    </main>
  )
}
