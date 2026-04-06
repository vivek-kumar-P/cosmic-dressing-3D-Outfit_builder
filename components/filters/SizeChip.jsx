"use client"

export default function SizeChip({ size, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(size)}
      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-200 ${
        selected
          ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
          : "border-white/20 bg-white/5 text-gray-200 hover:border-[#00c4b4]/60"
      }`}
      aria-pressed={selected}
    >
      {size}
    </button>
  )
}
