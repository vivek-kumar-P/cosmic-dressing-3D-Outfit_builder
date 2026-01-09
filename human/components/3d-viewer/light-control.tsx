"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { LightControlProps } from "@/types"

export function LightControl({ label, position, onChange }: LightControlProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/50 p-3 shadow-sm lg:p-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
        <h3 className="text-xs font-bold text-foreground lg:text-sm">{label}</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">X Axis</Label>
            <span className="text-xs font-semibold text-foreground">{position.x.toFixed(1)}</span>
          </div>
          <Slider
            value={[position.x]}
            onValueChange={([x]) => onChange({ ...position, x })}
            min={-10}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Y Axis</Label>
            <span className="text-xs font-semibold text-foreground">{position.y.toFixed(1)}</span>
          </div>
          <Slider
            value={[position.y]}
            onValueChange={([y]) => onChange({ ...position, y })}
            min={-5}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Z Axis</Label>
            <span className="text-xs font-semibold text-foreground">{position.z.toFixed(1)}</span>
          </div>
          <Slider
            value={[position.z]}
            onValueChange={([z]) => onChange({ ...position, z })}
            min={-10}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
