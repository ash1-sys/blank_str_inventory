import { useState, useCallback, useRef } from 'react'
import { useApp } from '../context/AppContext'
import ItemAvatar from '../components/ItemAvatar'
import PillButton from '../components/PillButton'
import NoteModal from '../components/NoteModal'

export default function CountScreen({ animClass }) {
  const { state, dispatch, items } = useApp()
  const { currentIndex, counts, notes } = state
  const item = items[currentIndex]
  const isLast = currentIndex === items.length - 1

  const rawCount = counts[item.id]
  const isSkipped = rawCount === null
  const qty = (rawCount === null || rawCount === undefined) ? 0 : rawCount

  const [popKey, setPopKey] = useState(0)
  const [showNote, setShowNote] = useState(false)

  // Tap-to-edit state
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef(null)

  const setQty = useCallback((val) => {
    const clamped = Math.max(0, Math.floor(val))
    dispatch({ type: 'SET_COUNT', itemId: item.id, value: clamped })
    setPopKey(k => k + 1)
  }, [dispatch, item.id])

  // ── Tap-to-edit handlers ──────────────────────────────────────
  function handleQuantityTap() {
    if (isSkipped) return
    setEditValue(String(qty))
    setEditing(true)
    // Focus after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => inputRef.current?.select())
    })
  }

  function commitEdit() {
    const parsed = parseInt(editValue, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      setQty(parsed)
    }
    setEditing(false)
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'Done') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  // ── Progress ──────────────────────────────────────────────────
  const progress = (currentIndex / items.length) * 100
  const activePreset = item.presets.includes(qty) ? qty : null

  return (
    <div className={`flex flex-col h-full bg-[#F0EDE8] ${animClass}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <button
          onClick={() => dispatch({ type: 'BACK' })}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#4A4440] active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center gap-2 flex-1 mx-3">
          <div className="flex-1 h-1 bg-[#E0DDD8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A6741] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-sans text-xs text-[#9B9488] whitespace-nowrap">
            {currentIndex + 1} of {items.length}
          </span>
        </div>
      </div>

      {/* Item focus area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-2">
        <ItemAvatar item={item} size="lg" />

        <h2 className="font-serif text-[2rem] leading-tight text-[#1E1C1A] mt-3 mb-1 text-center">
          {item.name}
        </h2>
        <p className="text-[10px] font-sans font-semibold tracking-widest text-[#4A6741] mb-5">
          COUNTED IN {item.unit.toUpperCase()}
        </p>

        {/* ── Stepper card (compact) ─────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm w-full px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Decrement */}
            <button
              onClick={() => { setEditing(false); setQty(qty - 1) }}
              disabled={qty === 0}
              className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl bg-[#F0EDE8] flex items-center justify-center text-2xl text-[#4A4440] disabled:opacity-30 active:scale-95 transition-all duration-100 font-light select-none"
              aria-label="Decrease"
            >
              −
            </button>

            {/* Quantity — tappable to edit */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {editing ? (
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleEditKeyDown}
                  className="font-serif font-bold text-5xl text-[#1E1C1A] leading-none text-center bg-transparent outline-none w-full border-b-2 border-[#4A6741] pb-0.5 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={handleQuantityTap}
                  className="font-serif font-bold text-5xl text-[#1E1C1A] leading-none text-center bg-transparent active:opacity-70 transition-opacity cursor-text select-none w-full"
                  aria-label={`Current quantity ${qty}, tap to edit`}
                >
                  <span key={popKey} className="pop inline-block">
                    {isSkipped ? '—' : qty}
                  </span>
                </button>
              )}
              <span className="font-sans text-sm text-[#9B9488] mt-1">{item.unit}</span>
            </div>

            {/* Increment */}
            <button
              onClick={() => { setEditing(false); setQty(qty + 1) }}
              className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl bg-[#F0EDE8] flex items-center justify-center text-2xl text-[#4A4440] active:scale-95 transition-all duration-100 font-light select-none"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        {/* ── Quick adjust presets ───────────────────────────── */}
        <div className="w-full mt-4">
          <p className="text-[10px] font-sans font-semibold tracking-widest text-[#9B9488] mb-2 text-left">
            QUICK ADJUST
          </p>
          <div className="flex gap-2">
            {item.presets.map(preset => {
              const isActive = !isSkipped && activePreset === preset
              return (
                <button
                  key={preset}
                  onClick={() => { setEditing(false); setQty(preset) }}
                  className="flex-1 min-h-[44px] rounded-full font-sans font-semibold text-sm border transition-colors duration-150 select-none active:scale-95 transition-transform"
                  style={{
                    backgroundColor: isActive ? '#4A6741' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#1E1C1A',
                    borderColor: isActive ? '#4A6741' : '#E0DDD8',
                    transitionProperty: 'background-color, color, border-color',
                    transitionDuration: '150ms',
                  }}
                  aria-label={`Set quantity to ${preset}`}
                  aria-pressed={isActive}
                >
                  {preset}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Secondary actions ──────────────────────────────── */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            onClick={() => setShowNote(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#C8C4BC] text-[#9B9488] font-sans text-sm"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            {notes[item.id] ? 'Edit note' : 'Add a note'}
          </button>

          {notes[item.id] && (
            <p className="text-xs text-[#9B9488] italic max-w-[200px] text-center truncate">
              "{notes[item.id]}"
            </p>
          )}

          <button
            onClick={() => {
              dispatch({ type: 'SKIP', itemId: item.id })
              dispatch({ type: 'NEXT' })
            }}
            className="text-[#9B9488] font-sans text-sm underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="px-5 pt-4"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <PillButton onClick={() => { setEditing(false); dispatch({ type: 'NEXT' }) }}>
          {isLast ? 'Review →' : 'Next →'}
        </PillButton>
      </div>

      {/* Note modal */}
      {showNote && (
        <NoteModal
          initialNote={notes[item.id] || ''}
          onSave={(text) => dispatch({ type: 'SET_NOTE', itemId: item.id, value: text })}
          onClose={() => setShowNote(false)}
        />
      )}
    </div>
  )
}
