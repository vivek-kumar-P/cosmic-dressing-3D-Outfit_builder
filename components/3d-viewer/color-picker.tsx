"use client"

import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

const COLOR_PRESETS = [
  { color: "#cccccc", name: "Silver" },
  { color: "#ff6b6b", name: "Red" },
  { color: "#4ecdc4", name: "Teal" },
  { color: "#45b7d1", name: "Blue" },
  { color: "#f9ca24", name: "Gold" },
  { color: "#6c5ce7", name: "Purple" },
  { color: "#a29bfe", name: "Lavender" },
  { color: "#fd79a8", name: "Pink" },
]

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/50 p-3 shadow-sm lg:p-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
        <h3 className="text-xs font-bold text-foreground lg:text-sm">Model Color</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label className="mb-2 block text-xs font-medium text-muted-foreground">Color Picker</Label>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border-2 border-border/50 bg-background shadow-sm transition-all hover:border-primary/50 hover:shadow-md lg:h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground">Preview</Label>
            <div
              className="h-10 w-16 rounded-lg border-2 border-border/50 shadow-sm transition-all hover:scale-105 lg:h-12 lg:w-20"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 block text-xs font-medium text-muted-foreground">Quick Presets</Label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                onClick={() => onChange(preset.color)}
                className="group relative h-8 w-8 rounded-lg border-2 border-border/50 shadow-sm transition-all hover:scale-110 hover:border-primary/50 hover:shadow-md lg:h-10 lg:w-10"
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Current:</span> {color.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
}
