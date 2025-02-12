import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { NewChat } from './Buttons'
export const SideBarActionRow = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'flex flex-row items-centertop-0 z-[1] overflow-hidden mb-4',
        className
      )}
      {...props}
    >
      <NewChat />
    </div>
  )
}
