"use client"

import type React from "react"

import type { Card } from "@/types/card"

interface DraggableCardProps {
  card: Card
}

export default function DraggableCard({ card }: DraggableCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(card))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-move hover:bg-blue-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-blue-900">{card.title}</h4>
        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {card.rows}×{card.columns}
        </div>
      </div>
      <p className="text-xs text-blue-700 mt-1">
        Spans {card.rows} row{card.rows !== 1 ? "s" : ""} × {card.columns} column{card.columns !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
