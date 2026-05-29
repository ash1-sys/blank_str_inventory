export default function ItemAvatar({ item, size = 'md' }) {
  const sizes = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-2xl',
  }
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-serif font-semibold flex-shrink-0`}
      style={{ backgroundColor: item.bg, color: item.fg }}
    >
      {item.initial}
    </div>
  )
}
