import { twMerge } from 'tailwind-merge'

export const DraggableTopBar = ({ className }: { className?: string }) => {
  return <header className={twMerge('absolute inset-0 h-10 bg-transparent', className)} />
}
