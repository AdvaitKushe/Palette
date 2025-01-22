import { ComponentProps } from "react"

import { twMerge } from "tailwind-merge"

export const Search = ({ className, ...props }: ComponentProps<'button'>) => {
  return (
    <button
      className={twMerge('flex flex-row items-center justify-center', className)}
      {...props}
    >
      
    </button>
  )
}
