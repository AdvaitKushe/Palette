import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const ChatPreview = ({
  title,
  isActive = false,
  className,
  ...props
}: ComponentProps<'button'> & { title: string; isActive: boolean }) => {
  return (
    <button
      className={twMerge(
        'flex flex-row items-center m-1 justify-center border border-white/20 text-white/50 text-sm rounded-md p-2 overflow-hidden hover:bg-zinc-200/50 transition-all duration-300 active:scale-95 w-full whitespace-nowrap',

        isActive ? 'bg-zinc-400/75 text-white' : 'hover:bg-zinc-500/75',
        className
      )}
      {...props}
    >
      <span className="truncate">{title}</span>
    </button>
  )
}
