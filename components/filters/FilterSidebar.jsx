"use client"

export default function FilterSidebar({ children }) {
  return (
    <aside className="hidden w-[260px] shrink-0 md:block" aria-label="Filters sidebar">
      <div className="md:sticky md:top-0 md:h-screen md:w-[260px]">
        <div className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-lg backdrop-blur-sm">
          {children}
        </div>
      </div>
    </aside>
  )
}
