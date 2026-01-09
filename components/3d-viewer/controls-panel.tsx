"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"
import type { ControlsPanelProps } from "@/types"
import { LightControl } from "./light-control"
import { ColorPicker } from "./color-picker"

export function ControlsPanel({
  showControls,
  onClose,
  mainLight,
  onMainLightChange,
  modelColor,
  onColorChange,
  shirtColor,
  onShirtColorChange,
  showShirt,
  onShowShirtChange,
  availableAnimations,
  currentAnimation,
  onAnimationChange,
  animationSpeed,
  onAnimationSpeedChange,
  isPlaying,
  onPlayPauseChange,
}: ControlsPanelProps) {
  if (!showControls) return null

  return (
    <>
      <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm xl:hidden" onClick={onClose} />

      <div
        className={`fixed z-20 transition-all duration-300 xl:right-0 xl:top-0 xl:h-screen xl:w-[400px] ${
          showControls ? "xl:translate-x-0" : "xl:translate-x-full"
        } inset-x-4 bottom-4 top-20 md:inset-x-auto md:right-4 md:w-96 xl:inset-x-auto`}
      >
        <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-b from-card/95 to-card/90 shadow-2xl backdrop-blur-md xl:rounded-none xl:border-l xl:border-r-0 xl:border-t-0 xl:border-b-0">
          <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-5">
            <h2 className="text-lg font-bold text-foreground lg:text-xl">Customization</h2>
            <p className="text-xs text-muted-foreground">Adjust lighting and appearance</p>
          </div>

          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="space-y-4 p-4 lg:space-y-6 lg:p-5">
              {availableAnimations.length > 0 && (
                <div className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/50 p-3 shadow-sm lg:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    <h3 className="text-xs font-bold text-foreground lg:text-sm">Animations</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-xs font-medium text-muted-foreground">Select Animation</Label>
                      <Select value={currentAnimation} onValueChange={onAnimationChange}>
                        <SelectTrigger className="w-full">
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

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">Speed</Label>
                        <span className="text-xs font-semibold text-foreground">{animationSpeed.toFixed(1)}x</span>
                      </div>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => onAnimationSpeedChange(value[0])}
                        min={0.1}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>0.1x</span>
                        <span>3.0x</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <LightControl label="Main Light Position" position={mainLight} onChange={onMainLightChange} />
              <ColorPicker color={modelColor} onChange={onColorChange} />

              <div className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/50 p-3 shadow-sm lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                    <h3 className="text-xs font-bold text-foreground lg:text-sm">Shirt</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="shirt-toggle" className="text-xs text-muted-foreground">
                      {showShirt ? "On" : "Off"}
                    </Label>
                    <Switch id="shirt-toggle" checked={showShirt} onCheckedChange={onShowShirtChange} />
                  </div>
                </div>

                {showShirt && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label className="mb-2 block text-xs font-medium text-muted-foreground">Shirt Color</Label>
                        <input
                          type="color"
                          value={shirtColor}
                          onChange={(e) => onShirtColorChange(e.target.value)}
                          className="h-10 w-full cursor-pointer rounded-lg border-2 border-border/50 bg-background shadow-sm transition-all hover:border-primary/50 hover:shadow-md lg:h-12"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Preview</Label>
                        <div
                          className="h-10 w-16 rounded-lg border-2 border-border/50 shadow-sm transition-all hover:scale-105 lg:h-12 lg:w-20"
                          style={{ backgroundColor: shirtColor }}
                        />
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Current:</span> {shirtColor.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </>
  )
}
