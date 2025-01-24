
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'
import { useNotesList } from '@renderer/hooks/useNotesList'

export const NewChat = ({ className, ...props }: ComponentProps<'button'>) => {
  const { handleNoteSelect } = useNotesList({
    onSelect: () => {
      console.log('note selected')
    }
  })
  return (
    <ActionButton className={twMerge('flex flex-row items-center justify-center ', className)} onClick={handleNoteSelect(null)} {...props}>
      <i className="bi bi-file-earmark-plus"></i>
    </ActionButton>
  )
}
