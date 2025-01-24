import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

import { ModelPicker } from "./ModelPicker"
import { Settings } from "./Settings"


export const ContentActionRow = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('flex flex-row  justify-center justify-between p-2', className)} {...props}>
    
        <ModelPicker />
        <Settings className = "absolute right-3"/> 
    </div>
  )
}