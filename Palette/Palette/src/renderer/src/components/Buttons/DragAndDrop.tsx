import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const DragAndDrop = ({ className, ...props }: ComponentProps<'input'>) => {
  const [isClicked, setIsClicked] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div
      className={twMerge(
        'bg-zinc-900/70 border border-white/20 p-4 rounded-full flex items-center justify-center absolute bottom-[10px] left-2 h-2 w-2 hover:bg-zinc-900/20 transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <i className="bi bi-plus-lg cursor-pointer"></i>
      <input
        {...props}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', inset: 0, opacity: 0 }}
      />
    </div>
  )
}
