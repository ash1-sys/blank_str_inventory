import { useState, useEffect, useRef } from 'react'

export default function NoteModal({ initialNote = '', onSave, onClose }) {
  const [text, setText] = useState(initialNote)
  const ref = useRef(null)

  useEffect(() => { ref.current?.focus() }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl p-6 shadow-2xl"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#E0DDD8] rounded-full mx-auto mb-5" />
        <h3 className="font-serif text-xl text-[#2A2420] mb-3">Add a note</h3>
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Low stock, checked back fridge…"
          rows={3}
          className="w-full rounded-xl border border-[#E0DDD8] bg-[#F8F6F3] p-3 text-[#2A2420] font-sans text-sm resize-none focus:outline-none focus:border-[#4A6741] transition-colors"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-[#E0DDD8] text-[#9B9488] font-sans font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(text); onClose() }}
            className="flex-1 py-3 rounded-full bg-[#4A6741] text-white font-sans font-semibold text-sm"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  )
}
