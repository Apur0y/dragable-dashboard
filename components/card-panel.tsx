"use client"

import type { Card } from "@/types/card"
import DraggableCard from "./draggable-card"

interface CardPanelProps {
  cards: Card[]
}

export default function CardPanel({ cards }: CardPanelProps) {
  return (
    <div className="flex-1 p-4 space-y-3">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Available Cards</h3>
        <div className="space-y-2">
          {cards.slice().reverse().map((card) => (
            <DraggableCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
