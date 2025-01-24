import { twMerge } from "tailwind-merge"
import { ComponentProps } from "react"
import { ActionButton } from "./ActionButton"

export const Settings = ({ className, ...props }: ComponentProps<'button'>) => {
  return (
    <ActionButton className={twMerge('flex flex-row items-center justify-center', className)} {...props}>
        <i className=" bi bi-gear flex items-center"></i>
    </ActionButton>
  )
}