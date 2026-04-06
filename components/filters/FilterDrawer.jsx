"use client"

import { SlidersHorizontal, X } from "lucide-react"

export default function FilterDrawer({ open, onOpenChange, activeCount, children }) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#00c4b4] px-5 py-3 text-sm font-semibold text-black shadow-lg transition hover:bg-[#00e0cc] md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 ? <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">{activeCount}</span> : null}
      </button>

      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button
          type="button"
          className="h-full w-full"
          onClick={() => onOpenChange(false)}
          aria-label="Close filter drawer"
        />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl border border-white/10 bg-[#1a1a3a] text-white shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-200 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(85vh-56px)] overflow-y-auto p-4">{children}</div>
      </div>
    </>
  )
}
