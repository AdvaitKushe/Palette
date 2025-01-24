import { ComponentProps } from 'react'

import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'

export const Search = ({ className, ...props }: ComponentProps<'button'>) => {
  return (
    <ActionButton
      className={twMerge('flex flex-row items-center justify-center mr-1', className)}
      {...props}
    >
      <i className="bi bi-search"></i>
    </ActionButton>
  )
}
