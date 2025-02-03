import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Search, NewChat } from './Buttons'
export const SideBarActionRow = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('flex flex-row items-center', className)} {...props}>
      <Search />
      <NewChat />
    </div>
  )
}
