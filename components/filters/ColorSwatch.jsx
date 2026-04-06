"use client"

export default function ColorSwatch({ color, selected, onToggle }) {
  return (
    <button
      type="button"
      title={color.name}
      onClick={() => onToggle(color.name)}
      className={`h-8 w-8 rounded-full border transition-all duration-200 ${
        selected
          ? "border-[#00c4b4] ring-2 ring-[#00c4b4] ring-offset-2 ring-offset-[#1a1a3a]"
          : "border-white/30 hover:scale-105"
      }`}
      style={{ backgroundColor: color.hex }}
      aria-label={`Filter by ${color.name}`}
      aria-pressed={selected}
    />
  )
}
