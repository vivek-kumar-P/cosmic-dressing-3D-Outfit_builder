"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Play, Pause, ShoppingBag, Shirt, Footprints, BanIcon as PantsIcon, RotateCcw } from "lucide-react"
import { LightControl } from "@/components/3d-viewer/light-control"
import type { LightPosition } from "@/types"

interface PlaygroundPanelProps {
  show: boolean
  onClose: () => void
  mainLight: LightPosition
  onMainLightChange: (position: LightPosition) => void
  availableAnimations: string[]
  currentAnimation: string
  onAnimationChange: (animation: string) => void
  animationSpeed: number
  onAnimationSpeedChange: (speed: number) => void
  isPlaying: boolean
  onPlayPauseChange: (playing: boolean) => void
  onSaveOutfit: () => void
  shirtScale: number
  onShirtScaleChange: (scale: number) => void
  shoesScale: number
  onShoesScaleChange: (scale: number) => void
  pantsScale: number
  onPantsScaleChange: (scale: number) => void
  showShirt: boolean
  showShoes: boolean
  showPants: boolean
}

export function PlaygroundPanel({
  show,
  onClose,
  mainLight,
  onMainLightChange,
  availableAnimations,
  currentAnimation,
  onAnimationChange,
  animationSpeed,
  onAnimationSpeedChange,
  isPlaying,
  onPlayPauseChange,
  onSaveOutfit,
  shirtScale,
  onShirtScaleChange,
  shoesScale,
  onShoesScaleChange,
  pantsScale,
  onPantsScaleChange,
  showShirt,
  showShoes,
  showPants,
}: PlaygroundPanelProps) {
  const hasAnyClothing = showShirt || showShoes || showPants

  const handleResetAllScales = () => {
    onShirtScaleChange(1.0)
    onShoesScaleChange(1.0)
    onPantsScaleChange(1.0)
    console.log("[v0] All clothing scales reset to 1.0x")
  }

  return (
    <aside
      className={`fixed right-0 top-0 z-20 h-full w-80 transform border-l border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0 ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-lg font-semibold">Playground</h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-4 py-4">
            {hasAnyClothing && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Outfit Size Adjustment</Label>
                    <Button
                      onClick={handleResetAllScales}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      title="Reset all sizes to default"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adjust the size of each clothing item to fit perfectly
                  </p>

                  {/* Shirt Size Control */}
                  {showShirt && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-primary" />
                        <Label className="text-xs font-medium">Shirt Size</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Scale</span>
                          <span className="text-xs font-medium tabular-nums">{shirtScale.toFixed(2)}x</span>
                        </div>
                        <Slider
                          value={[shirtScale]}
                          onValueChange={([value]) => onShirtScaleChange(value)}
                          min={0.5}
                          max={1.5}
                          step={0.01}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0.5x</span>
                          <span>1.0x</span>
                          <span>1.5x</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shoes Size Control */}
                  {showShoes && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Footprints className="h-4 w-4 text-primary" />
                        <Label className="text-xs font-medium">Shoes Size</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Scale</span>
                          <span className="text-xs font-medium tabular-nums">{shoesScale.toFixed(2)}x</span>
                        </div>
                        <Slider
                          value={[shoesScale]}
                          onValueChange={([value]) => onShoesScaleChange(value)}
                          min={0.5}
                          max={1.5}
                          step={0.01}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0.5x</span>
                          <span>1.0x</span>
                          <span>1.5x</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pants Size Control */}
                  {showPants && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <PantsIcon className="h-4 w-4 text-primary" />
                        <Label className="text-xs font-medium">Pants Size</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Scale</span>
                          <span className="text-xs font-medium tabular-nums">{pantsScale.toFixed(2)}x</span>
                        </div>
                        <Slider
                          value={[pantsScale]}
                          onValueChange={([value]) => onPantsScaleChange(value)}
                          min={0.5}
                          max={1.5}
                          step={0.01}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0.5x</span>
                          <span>1.0x</span>
                          <span>1.5x</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />
              </>
            )}

            {/* Lighting Controls */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Lighting</Label>
              <LightControl label="Main Light" position={mainLight} onChange={onMainLightChange} />
            </div>

            <Separator />

            {/* Animation Controls */}
            {availableAnimations.length > 0 && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Animation</Label>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Select Animation</Label>
                    <Select value={currentAnimation} onValueChange={onAnimationChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose animation" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAnimations.map((anim) => (
                          <SelectItem key={anim} value={anim}>
                            {anim}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onPlayPauseChange(!isPlaying)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Speed</Label>
                      <span className="text-xs font-medium">{animationSpeed.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[animationSpeed]}
                      onValueChange={([value]) => onAnimationSpeedChange(value)}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Save Button */}
        <div className="shrink-0 border-t border-border bg-card/50 p-4 backdrop-blur-sm">
          <Button onClick={onSaveOutfit} className="w-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </aside>
  )
}
