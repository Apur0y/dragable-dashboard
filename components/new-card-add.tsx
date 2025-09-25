import React, { useState } from 'react'
import CardPanel from './card-panel';
import { Card } from '@/types/card';

export default function NewCardAdd({setCards,cards,bar,onAddCard }:any) {
   const [showInput, setShowInput] = useState(false);
   const [title,setTitle]=useState(false)
  const [newTitle, setNewTitle] = useState("");
  const [newRows, setNewRows] = useState(1);
  const [newCols, setNewCols] = useState(1);

  const handleAddCard = () => {
    if (!newTitle.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      rows: newRows,
      columns: newCols,
      title: newTitle,
    };

    onAddCard(bar.id, newCard); // ✅ pass card to parent
    setNewTitle("");
    setShowInput(false);
  };
  console.log("This sis naj", bar.cards);

  return (
    <div>
        <div className="md:min-w-80  bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 ">
          <div
          onDoubleClick={()=>setTitle(!title)}
          
          >
          {
            title? <input type='text' defaultValue={bar.title} className='border rounded text-lg font-semibold'/> :<h1 className="text-xl font-semibold text-gray-900">
            {bar.title}
          </h1>
          }
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            Drag cards to the calendar grid
          </p>
          {!showInput ? (
            <button
              className="bg-green-200 px-3 rounded my-3 cursor-pointer text-sm"
              onClick={() => setShowInput(true)}
            >
              + Add Card
            </button>
          ) : (
            <div className="flex flex-col gap-2 my-3 border p-3 rounded bg-gray-50 w-72">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border px-2 py-1 rounded"
                placeholder="Enter card title"
              />
              <div className="">
                <label>Row:</label>
                <input
                  type="text"
                  value={newRows}
                  onChange={(e) => setNewRows(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                  placeholder="Rows"
                  min={1}
                />
              </div>

              <label>Column:</label>
              <input
                type="text"
                value={newCols}
                onChange={(e) => setNewCols(Number(e.target.value))}
                className="border px-2 py-1 rounded"
                placeholder="Columns"
                min={1}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAddCard}
                  className="bg-green-200 px-3 py-1 rounded cursor-pointer text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-red-200 px-3 py-1 rounded cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <CardPanel cards={ bar.cards} />
      </div>
    </div>
  )
}
