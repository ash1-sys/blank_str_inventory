import { useApp } from '../context/AppContext'
import ItemAvatar from '../components/ItemAvatar'
import PillButton from '../components/PillButton'

export default function ReviewScreen({ animClass }) {
  const { state, dispatch, items } = useApp()
  const { counts, notes } = state

  const counted = items.filter(item => counts[item.id] !== null && counts[item.id] !== undefined).length
  const skipped = items.filter(item => counts[item.id] === null).length

  return (
    <div className={`flex flex-col h-full bg-[#F0EDE8] ${animClass}`}>
      <div className="flex-1 overflow-y-auto overscroll-contain pb-32">
        {/* Header */}
        <div className="px-5 pt-12 pb-5">
          <button
            onClick={() => dispatch({ type: 'BACK_TO_COUNT', index: items.length - 1 })}
            className="flex items-center gap-1 text-[#4A6741] font-sans text-sm mb-5"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to count
          </button>
          <h1 className="font-serif text-[2.4rem] leading-tight text-[#1E1C1A] mb-1">Review Count</h1>
          <p className="font-sans text-sm">
            <span className="text-[#1E1C1A] font-semibold">{counted} counted</span>
            {skipped > 0 && (
              <span className="text-[#C8944A]"> · {skipped} skipped</span>
            )}
            {skipped === 0 && (
              <span className="text-[#9B9488]"> · 0 skipped</span>
            )}
          </p>
        </div>

        {/* Item list */}
        <div className="px-5">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {items.map((item, i) => {
              const count = counts[item.id]
              const isSkipped = count === null
              const hasCount = count !== null && count !== undefined
              const note = notes[item.id]

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i < items.length - 1 ? 'border-b border-[#F0EDE8]' : ''}`}
                >
                  <ItemAvatar item={item} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-[#1E1C1A] text-sm leading-snug">{item.name}</p>
                    <p className="font-sans text-xs text-[#9B9488]">{item.unit}</p>
                    {note && (
                      <p className="font-sans text-xs text-[#9B9488] italic mt-0.5 truncate">"{note}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSkipped ? (
                      <span className="font-sans text-xs font-medium text-[#C8944A] bg-[#FFF3E0] px-2 py-0.5 rounded-full">
                        Skipped
                      </span>
                    ) : (
                      <span className="font-sans text-sm font-bold text-[#1E1C1A] tabular-nums">
                        {hasCount ? count : 0}
                        <span className="font-normal text-[#9B9488] text-xs ml-1">{item.unit}</span>
                      </span>
                    )}
                    <button
                      onClick={() => dispatch({ type: 'BACK_TO_COUNT', index: i })}
                      className="font-sans text-sm text-[#4A4440] border border-[#E0DDD8] rounded-full px-3 py-1 active:bg-[#F0EDE8] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 bg-gradient-to-t from-[#F0EDE8] via-[#F0EDE8] to-transparent"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <PillButton onClick={() => dispatch({ type: 'SUBMIT' })}>
          Submit Count ✓
        </PillButton>
      </div>
    </div>
  )
}
