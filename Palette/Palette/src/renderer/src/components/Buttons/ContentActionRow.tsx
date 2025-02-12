import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import { ModelPicker } from './ModelPicker'
import { Settings } from './Settings'
import { Profile } from './Profile'

export const ContentActionRow = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge('flex flex-row items-center justify-between px-4 py-2', className)}
      {...props}
    >
      <ModelPicker />
      <div className="flex items-center gap-[5px]">
        <Settings />
        <Profile />
      </div>
    </div>
  )
}
