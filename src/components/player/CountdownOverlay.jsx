// "When do we go?" Giant 3, 2, 1... צא! over the whole board.
export default function CountdownOverlay({ value }) {
  if (value === null || value === undefined) return null
  const go = value === 0
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-board/60" aria-live="assertive">
      <div
        key={value}
        className={`pop-in flex h-[42vmin] w-[42vmin] items-center justify-center rounded-full font-display shadow-2xl ${go ? 'bg-go text-white' : 'bg-gold text-board'}`}
        style={{ fontSize: go ? '14vmin' : '22vmin' }}
      >
        {go ? 'צא!' : value}
      </div>
    </div>
  )
}
