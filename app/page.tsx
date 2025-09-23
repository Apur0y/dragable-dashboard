"use client"

import { useState } from "react"
import CardPanel from "@/components/card-panel"
import CalendarGrid from "@/components/calendar-grid"
import type { Card } from "@/types/card"

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([
    { id: "1", rows: 1, columns: 3, title: "Task A" },
    { id: "2", rows: 2, columns: 2, title: "Task B" },
    { id: "3", rows: 1, columns: 4, title: "Task C" },
    { id: "4", rows: 3, columns: 1, title: "Task D" },
  ])

  const [placedCards, setPlacedCards] = useState<Array<Card & { gridRow: number; gridCol: number }>>([])
  const [zoomLevel, setZoomLevel] = useState(1) // 1 = month view, up to 60 for 5 years

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard Cards</h1>
          <p className="text-sm text-gray-600 mt-1">Drag cards to the calendar grid</p>
        </div>
        <CardPanel cards={cards} />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header with zoom controls */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Calendar Grid</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Zoom:</span>
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              disabled={zoomLevel <= 1}
            >
              -
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {zoomLevel === 1 ? "1M" : `${Math.ceil(zoomLevel / 12)}Y`}
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(60, zoomLevel + 1))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              disabled={zoomLevel >= 60}
            >
              +
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <CalendarGrid
            zoomLevel={zoomLevel}
            placedCards={placedCards}
            onCardPlace={(card, row, col) => {
              setPlacedCards((prev) => [...prev, { ...card, gridRow: row, gridCol: col }])
            }}
            onCardRemove={(cardId) => {
              setPlacedCards((prev) => prev.filter((card) => card.id !== cardId))
            }}
          />
        </div>
      </div>
    </div>
  )
}
