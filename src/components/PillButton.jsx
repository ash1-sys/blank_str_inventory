export default function PillButton({ children, onClick, variant = 'primary', className = '', disabled = false }) {
  const base = 'w-full rounded-full font-sans font-semibold text-base py-4 px-6 transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2 min-h-[56px]'
  const variants = {
    primary: 'bg-[#4A6741] text-white shadow-sm active:bg-[#3a5433]',
    ghost: 'bg-transparent text-[#4A6741] border border-[#4A6741]/30',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
