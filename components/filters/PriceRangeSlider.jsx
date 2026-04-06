"use client"

import { useEffect, useMemo, useRef, useState } from "react"

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export default function PriceRangeSlider({ minLimit, maxLimit, minValue, maxValue, onChange, presets = [] }) {
  const [inputMin, setInputMin] = useState(String(minValue))
  const [inputMax, setInputMax] = useState(String(maxValue))
  const trackRef = useRef(null)
  const dragStateRef = useRef(null)
  const minValueRef = useRef(minValue)
  const maxValueRef = useRef(maxValue)

  useEffect(() => {
    setInputMin(String(minValue))
    setInputMax(String(maxValue))
    minValueRef.current = minValue
    maxValueRef.current = maxValue
  }, [maxValue, minValue])

  const minPercent = useMemo(() => ((minValue - minLimit) / (maxLimit - minLimit)) * 100, [maxLimit, minLimit, minValue])
  const maxPercent = useMemo(() => ((maxValue - minLimit) / (maxLimit - minLimit)) * 100, [maxLimit, minLimit, maxValue])

  const valueFromClientX = (clientX) => {
    const track = trackRef.current
    if (!track) return minValue

    const rect = track.getBoundingClientRect()
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return Math.round(minLimit + ratio * (maxLimit - minLimit))
  }

  const applyDragMove = (clientX) => {
    const dragState = dragStateRef.current
    if (!dragState) return

    const currentMinValue = minValueRef.current
    const currentMaxValue = maxValueRef.current
    const nextValue = valueFromClientX(clientX)
    const rangeWidth = dragState.startMax - dragState.startMin

    if (dragState.mode === "range") {
      const maxStart = maxLimit - rangeWidth
      const nextMin = clamp(dragState.startMin + (nextValue - dragState.startValue), minLimit, maxStart)
      onChange(nextMin, nextMin + rangeWidth)
      return
    }

    if (dragState.mode === "min") {
      onChange(clamp(nextValue, minLimit, currentMaxValue), currentMaxValue)
      return
    }

    if (dragState.mode === "max") {
      onChange(currentMinValue, clamp(nextValue, currentMinValue, maxLimit))
    }
  }

  const stopDragging = () => {
    dragStateRef.current = null
    window.removeEventListener("pointermove", handleWindowPointerMove)
    window.removeEventListener("pointerup", stopDragging)
    window.removeEventListener("pointercancel", stopDragging)
  }

  const handleWindowPointerMove = (event) => {
    applyDragMove(event.clientX)
  }

  const handleTrackPointerDown = (event) => {
    const nextValue = valueFromClientX(event.clientX)
    const isInsideSelection = nextValue >= minValue && nextValue <= maxValue
    const closerToMin = Math.abs(nextValue - minValue) <= Math.abs(nextValue - maxValue)

    dragStateRef.current = {
      mode: isInsideSelection ? "range" : closerToMin ? "min" : "max",
      startValue: nextValue,
      startMin: minValue,
      startMax: maxValue,
    }

    window.addEventListener("pointermove", handleWindowPointerMove)
    window.addEventListener("pointerup", stopDragging)
    window.addEventListener("pointercancel", stopDragging)
    applyDragMove(event.clientX)
  }

  const applyMinInput = () => {
    const parsed = Number.parseInt(inputMin, 10)
    if (Number.isNaN(parsed)) {
      setInputMin(String(minValue))
      return
    }

    const nextMin = clamp(parsed, minLimit, maxValue)
    onChange(nextMin, maxValue)
  }

  const applyMaxInput = () => {
    const parsed = Number.parseInt(inputMax, 10)
    if (Number.isNaN(parsed)) {
      setInputMax(String(maxValue))
      return
    }

    const nextMax = clamp(parsed, minValue, maxLimit)
    onChange(minValue, nextMax)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-200">Rs {minValue} - Rs {maxValue}</p>

      {presets.length ? (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const selected = minValue === preset.min && maxValue === preset.max

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.min, preset.max)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "border-[#00c4b4] bg-[#00c4b4]/10 text-[#00c4b4]"
                    : "border-white/20 bg-white/5 text-gray-200 hover:border-[#00c4b4]/60"
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div ref={trackRef} className="relative h-8 touch-none select-none">
        <button
          type="button"
          aria-label="Drag price range"
          onPointerDown={handleTrackPointerDown}
          className="absolute inset-0 cursor-pointer rounded-full bg-white/20"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#00c4b4]"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minValue}
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), maxValue)
            onChange(next, maxValue)
          }}
          className="pointer-events-none absolute z-10 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00c4b4] [&::-webkit-slider-thumb]:shadow"
          aria-label="Minimum price"
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxValue}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), minValue)
            onChange(minValue, next)
          }}
          className="pointer-events-none absolute z-10 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00c4b4] [&::-webkit-slider-thumb]:shadow"
          aria-label="Maximum price"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-gray-300">
          Enter your preferred price
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={inputMin}
            onChange={(event) => setInputMin(event.target.value)}
            onBlur={applyMinInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyMinInput()
              }
            }}
            className="mt-1 w-full rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none transition focus:border-[#00c4b4]"
          />
        </label>

        <label className="text-xs text-gray-300">
          Max
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={inputMax}
            onChange={(event) => setInputMax(event.target.value)}
            onBlur={applyMaxInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyMaxInput()
              }
            }}
            className="mt-1 w-full rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none transition focus:border-[#00c4b4]"
          />
        </label>
      </div>
    </div>
  )
}
