import { useApp } from '../context/AppContext'
import PillButton from '../components/PillButton'

function formatElapsed(ms) {
  if (!ms || ms <= 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SuccessScreen({ animClass }) {
  const { state, dispatch, items } = useApp()
  const { counts, startedAt, submittedAt } = state

  const elapsed = startedAt && submittedAt ? submittedAt - startedAt : null
  const counted = items.filter(item => counts[item.id] !== null && counts[item.id] !== undefined).length

  return (
    <div className={`flex flex-col h-full bg-[#F0EDE8] ${animClass}`}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Check circle */}
        <div className="w-20 h-20 rounded-full bg-[#4A6741] flex items-center justify-center mb-7 check-pop">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-serif text-[2.4rem] leading-tight text-[#1E1C1A] mb-3">
          Count Submitted
        </h1>
        <p className="font-sans text-sm text-[#9B9488] leading-relaxed max-w-[260px]">
          Nicely done. Your numbers are in — thanks for keeping the shop running smoothly.
        </p>

        {/* Stats */}
        <div className="flex gap-3 mt-8 w-full">
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="font-serif font-bold text-4xl text-[#1E1C1A] leading-none mb-1">
              {counted}
            </p>
            <p className="font-sans text-xs text-[#9B9488]">of {items.length} items</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="font-serif font-bold text-4xl text-[#1E1C1A] leading-none mb-1">
              {formatElapsed(elapsed)}
            </p>
            <p className="font-sans text-xs text-[#9B9488]">time taken</p>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="px-5 pt-4"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <PillButton onClick={() => dispatch({ type: 'RESET' })}>
          Done
        </PillButton>
      </div>
    </div>
  )
}
