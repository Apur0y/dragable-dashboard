"use client";

import { useState } from "react";
import CardPanel from "@/components/card-panel";
import CalendarGrid from "@/components/calendar-grid";
import type { Card } from "@/types/card";
import NewCardAdd from "@/components/new-card-add";

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([
    { id: "1", rows: 1, columns: 5, title: "Task A" },
    { id: "2", rows: 2, columns: 7, title: "Task B" },
    { id: "3", rows: 1, columns: 9, title: "Task C" },
    { id: "4", rows: 1, columns: 4, title: "Task D" },
  ]);

  const [barInfo, setBarInfo] = useState([
    { id: 1, title: "Dashboard Cards", cards: [  { id: "1", rows: 1, columns: 5, title: "Task A" }] as Card[] },
  ]);

  const [placedCards, setPlacedCards] = useState<
    Array<Card & { gridRow: number; gridCol: number }>
  >([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleAddBar = () => {
    const newBar = {
      id: Date.now(), // unique id
      title: `New Bar ${barInfo.length + 1}`,
      cards: [] as Card[],
    };
    setBarInfo([...barInfo, newBar]);
  };

  // ✅ Delete a bar
  const handleDeleteBar = (id: number) => {
    setBarInfo(barInfo.filter((bar) => bar.id !== id));
  };

  const handleAddCardToBar = (barId: number, card: Card) => {
  setBarInfo(prev =>
    prev.map(bar =>
      bar.id === barId
        ? { ...bar, cards: [...bar.cards, card] }
        : bar
    )
  )
}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="relative flex">
        {barInfo.map((bar) => (
          <div key={bar.id} className="flex gap-2 relative">
            <NewCardAdd bar={bar} onAddCard={handleAddCardToBar} />
            {barInfo.length > 1 && (
              <button
                onClick={() => handleDeleteBar(bar.id)}
                className="bg-red-200 hover:bg-red-300 px-2 py-1 rounded text-sm absolute right-0 m-3 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Add new bar button */}
        <button
          onClick={handleAddBar}
          className="absolute top-12 right-2 bg-gray-200 cursor-pointer hover:bg-gray-300 transition p-3 rounded-full"
        >
          +
        </button>
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
              setPlacedCards((prev) => [
                ...prev,
                { ...card, gridRow: row, gridCol: col },
              ]);
            }}
            onCardRemove={(cardId) => {
              setPlacedCards((prev) =>
                prev.filter((card) => card.id !== cardId)
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
