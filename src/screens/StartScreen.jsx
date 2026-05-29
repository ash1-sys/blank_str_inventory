import { useApp } from '../context/AppContext'
import ItemAvatar from '../components/ItemAvatar'
import PillButton from '../components/PillButton'

function formatDate() {
  const now = new Date()
  return now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
}

export default function StartScreen({ animClass }) {
  const { dispatch, items } = useApp()

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
          <p className="text-[10px] font-sans font-semibold tracking-widest text-[#9B9488] mb-3">
            WHAT YOU'LL COUNT
          </p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < items.length - 1 ? 'border-b border-[#F0EDE8]' : ''}`}
              >
                <ItemAvatar item={item} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[#1E1C1A] text-sm leading-snug">{item.name}</p>
                  <p className="font-sans text-xs text-[#9B9488]">{item.unit}</p>
                </div>
                <span className="font-sans text-sm text-[#C8C4BC] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 bg-gradient-to-t from-[#F0EDE8] via-[#F0EDE8] to-transparent"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <PillButton onClick={() => dispatch({ type: 'START' })}>
          Start Count →
        </PillButton>
      </div>
    </div>
  )
}
