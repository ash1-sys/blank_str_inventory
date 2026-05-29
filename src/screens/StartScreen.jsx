import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ItemAvatar from '../components/ItemAvatar'
import PillButton from '../components/PillButton'

function formatDate() {
  const now = new Date()
  return now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
}

function ChevronUp() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function StartScreen({ animClass }) {
  const { dispatch, items, state } = useApp()
  const [editingOrder, setEditingOrder] = useState(false)

  const isDefaultOrder = JSON.stringify(state.itemOrder) === JSON.stringify(items.map(i => i.id).sort((a,b) => {
    const def = [1,2,3,4,5,6,7,8,9,10]
    return def.indexOf(a) - def.indexOf(b)
  }))

  return (
    <div className={`flex flex-col h-full bg-[#F0EDE8] ${animClass}`}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-32">
        <div className="px-5 pt-12 pb-4">
          <p className="text-xs font-sans font-semibold tracking-widest text-[#4A6741] mb-3">
            {formatDate()}
          </p>
          <h1 className="font-serif text-[2.6rem] leading-[1.1] text-[#1E1C1A] mb-3">
            Today's Inventory Count
          </h1>
          <p className="font-sans text-sm text-[#1E1C1A] font-semibold mb-1">
            {items.length} items
            <span className="text-[#9B9488] font-normal"> · estimated 3–5 minutes</span>
          </p>
          <p className="font-sans text-sm text-[#9B9488] mt-2 leading-relaxed">
            Count key shop items quickly and review before submitting.
          </p>
        </div>

        <div className="px-5 pb-2 pt-3">
          {/* Section header row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-sans font-semibold tracking-widest text-[#9B9488]">
              WHAT YOU'LL COUNT
            </p>
            <button
              onClick={() => setEditingOrder(o => !o)}
              className="text-[#4A6741] font-sans text-xs font-semibold underline underline-offset-2"
            >
              {editingOrder ? 'Done' : 'Edit order'}
            </button>
          </div>

          {/* Design rationale — shown only in edit mode */}
          {editingOrder && (
            <div className="bg-[#EBF0E8] border border-[#C8D8C2] rounded-xl px-4 py-3 mb-3">
              <p className="font-sans text-xs text-[#4A6741] leading-relaxed">
                <span className="font-semibold">Tip:</span> Adjust the order to match your shop's physical layout — counting items in the sequence you'll find them reduces backtracking and makes the count faster.
              </p>
            </div>
          )}

          {/* Item list */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b border-[#F0EDE8]' : ''}`}
              >
                <ItemAvatar item={item} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[#1E1C1A] text-sm leading-snug">{item.name}</p>
                  <p className="font-sans text-xs text-[#9B9488]">{item.unit}</p>
                </div>

                {editingOrder ? (
                  /* Move up / Move down controls */
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => dispatch({ type: 'REORDER_UP', index: i })}
                      disabled={i === 0}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0EDE8] text-[#4A4440] disabled:opacity-25 active:bg-[#E0DDD8] transition-colors"
                      aria-label={`Move ${item.name} up`}
                    >
                      <ChevronUp />
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'REORDER_DOWN', index: i })}
                      disabled={i === items.length - 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0EDE8] text-[#4A4440] disabled:opacity-25 active:bg-[#E0DDD8] transition-colors"
                      aria-label={`Move ${item.name} down`}
                    >
                      <ChevronDown />
                    </button>
                  </div>
                ) : (
                  /* Position number */
                  <span className="font-sans text-sm text-[#C8C4BC] tabular-nums flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Reset order link — shown in edit mode when order has been changed */}
          {editingOrder && (
            <button
              onClick={() => dispatch({ type: 'REORDER_RESET' })}
              className="w-full text-center font-sans text-xs text-[#9B9488] mt-3 py-2 underline underline-offset-2"
            >
              Reset to default order
            </button>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 bg-gradient-to-t from-[#F0EDE8] via-[#F0EDE8] to-transparent"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <PillButton onClick={() => { setEditingOrder(false); dispatch({ type: 'START' }) }}>
          Start Count →
        </PillButton>
      </div>
    </div>
  )
}
