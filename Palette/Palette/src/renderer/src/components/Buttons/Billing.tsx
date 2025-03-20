import { ComponentProps } from 'react'
import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
export const Billing = ({ className }: ComponentProps<'div'>) => {
  const navigate = useNavigate()

  return (
    <div className={twMerge("flex flex-col items-center justify-center h-full", className)}>
      <h1
        className="text-sm cursor-pointer transition-all duration-300"
        onClick={() => {
          navigate('/billing')
        }}
      >
        Billing
      </h1>
    </div>
  )
}
