import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const GeneratedChat = ({className, ...props}: ComponentProps<'div'>) => {
    
    return (
        <div className={twMerge('flex flex-col', className)} {...props}>
            <div className="flex flex-col">
                <div className="flex-1">
                    <p>Hello</p>
                </div>
            </div>
        </div>
    )
}