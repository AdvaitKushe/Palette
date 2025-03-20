import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ModelPicker } from './ModelPicker'
import { Profile } from './Profile'
import { ActionButton } from './ActionButton'
import { useNavigate } from 'react-router-dom'

export const ContentActionRow = ({ className, ...props }: ComponentProps<'div'>) => {
  const navigate = useNavigate()
  return (
    <div
      className={twMerge('flex flex-row items-center justify-between px-4 py-2', className)}
      {...props}
    >
      <div className="flex flex-row items-end gap-2">
        <ModelPicker />
      </div>
      <div className="flex items-center gap-[5px] items-end ">
        <ActionButton
          className="bg-green-500  z-50 cursor-pointer text-white transition-all duration-300 hover:bg-green-600 hover:scale-105"
          onClick={() => {
            navigate('/billing')
          }}
        >
          Upgrade to Pro
        </ActionButton>
        <Profile />
      </div>
    </div>
  )
}
