import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { ActionButton } from "./ActionButton"


export const SendChat = ({className, ...props}: ComponentProps<'button'>) => {
    return (
        <ActionButton className={twMerge('bg-zinc-800 border rounded-[20px] border-zinc-400/50', className)} {...props}>
            <i className="bi bi-send"></i>   
        </ActionButton>
    )
}
