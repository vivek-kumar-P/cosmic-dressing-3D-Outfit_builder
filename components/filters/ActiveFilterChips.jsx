"use client"

import { X } from "lucide-react"

export default function ActiveFilterChips({ chips, onRemove, onClearAll, showClear }) {
  const safeChips = Array.isArray(chips) ? chips : []

  if (safeChips.length === 0) {
    return null
  }

  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-300">Active Filters</p>
        {showClear ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[#00c4b4] transition-colors hover:text-[#00e0cc]"
          >
            Clear All
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {safeChips.map((chip) => (
          <div
            key={chip.id}
            className="inline-flex items-center gap-1 rounded-full border border-[#00c4b4] bg-[#00c4b4]/10 px-2.5 py-1 text-xs font-medium text-[#00c4b4]"
          >
            <span>{chip.label}</span>
            <button
              type="button"
              onClick={() => onRemove(chip)}
              className="rounded-full p-0.5 transition-colors hover:bg-[#00c4b4]/20"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
