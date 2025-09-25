"use client"

import type React from "react"

import type { Card } from "@/types/card"
import { useState } from "react"

interface CalendarGridProps {
  zoomLevel: number
  placedCards: Array<Card & { gridRow: number; gridCol: number }>
  onCardPlace: (card: Card, row: number, col: number) => void
  onCardRemove: (cardId: string) => void
}

export default function CalendarGrid({ zoomLevel, placedCards, onCardPlace, onCardRemove }: CalendarGridProps) {
  const [dragOverCell, setDragOverCell] = useState<{ row: number; col: number } | null>(null)

  // Calculate grid dimensions based on zoom level
  const totalColumns = Math.min(30 * zoomLevel, 1800) // Max 5 years worth of days
  const totalRows = 20 // Fixed number of rows
  const cellWidth = Math.max(40, 120 - (zoomLevel - 1) * 2) // Smaller cells when zoomed out

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDragOverCell({ row, col })
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    setDragOverCell(null)

    try {
      const cardData = JSON.parse(e.dataTransfer.getData("application/json")) as Card

      // Check if the card fits in the grid
      if (row + cardData.rows <= totalRows && col + cardData.columns <= totalColumns) {
        // Check for overlaps with existing cards
        const hasOverlap = placedCards.some((placedCard) => {
          const cardEndRow = placedCard.gridRow + placedCard.rows
          const cardEndCol = placedCard.gridCol + placedCard.columns
          const newCardEndRow = row + cardData.rows
          const newCardEndCol = col + cardData.columns

          return !(
            row >= cardEndRow ||
            newCardEndRow <= placedCard.gridRow ||
            col >= cardEndCol ||
            newCardEndCol <= placedCard.gridCol
          )
        })

        if (!hasOverlap) {
          onCardPlace(cardData, row, col)
        }
      }
    } catch (error) {
      console.error("Error parsing dropped card data:", error)
    }
  }

  const handleCardDoubleClick = (cardId: string) => {
    onCardRemove(cardId)
  }

  // Generate column headers
  const columnHeaders = Array.from({ length: totalColumns }, (_, i) => {
    if (zoomLevel === 1) {
      return (i % 30) + 1 
    } else {
      const dayOfYear = (i % 365) + 1
      const year = Math.floor(i / 365) + 1
      return `Y${year}D${dayOfYear}`
    }
  })

  return (
    <div className="p-4">
      <div className="overflow-auto border border-gray-200 rounded-lg bg-white">
        {/* Column Headers */}
        <div className="flex sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
          <div className="w-12 h-8 border-r border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
            #
          </div>
          {columnHeaders.map((header, colIndex) => (
            <div
              key={colIndex}
              className="border-r border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
              style={{ width: cellWidth, minWidth: cellWidth }}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {Array.from({ length: totalRows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex relative">
            {/* Row Header */}
            <div className="w-12 h-12 border-r border-b border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-50">
              {rowIndex + 1}
            </div>

            {/* Grid Cells */}
            {Array.from({ length: totalColumns }, (_, colIndex) => {
              const isDropTarget = dragOverCell?.row === rowIndex && dragOverCell?.col === colIndex

              return (
                <div
                  key={colIndex}
                  className={`border-r border-b border-gray-200 relative ${
                    isDropTarget ? "bg-blue-100" : "hover:bg-gray-50"
                  }`}
                  style={{ width: cellWidth, height: 48, minWidth: cellWidth }}
                  onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                />
              )
            })}

            {/* Placed Cards */}
            {placedCards
              .filter((card) => card.gridRow === rowIndex)
              .map((card) => (
                <div
                draggable={true}
                onDragStart={handlDragOn}
                  key={card.id}
                  className="absolute bg-green-100 border-2 border-green-300 rounded shadow-sm cursor-pointer hover:bg-green-200 transition-colors z-20"
                  style={{
                    left: 48 + card.gridCol * cellWidth,
                    width: card.columns * cellWidth - 2,
                    height: card.rows * 48 - 2,
                    top: 1,
                  }}
                  onDoubleClick={() => handleCardDoubleClick(card.id)}
                  title="Double-click to remove"
                >
                  <div className="p-2 h-full flex flex-col justify-center">
                    <div className="text-xs font-medium text-green-800 truncate">{card.title}</div>
                    <div className="text-xs text-green-600">
                      {card.rows}×{card.columns}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
