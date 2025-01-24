import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChatPreview } from './Buttons'
import { useNotesList } from '../hooks/useNotesList'
import { isEmpty } from 'lodash'

export const ChatHistory = ({ className, onSelect, ...props }: ComponentProps<'ul'> & { onSelect?: () => void }) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({
    onSelect: () => {
      console.log('note selected')
    }
  })

  if (!notes) return null

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('text-center pt-4', className)}>
        <span className="text-zinc-400">No notes yet</span>
      </ul>
    )
  }
  return (
    <ul {...props}>
      {notes.map((note, index) => (
        <ChatPreview isActive={index === selectedNoteIndex} key={index} title={note.title} onClick={handleNoteSelect(index)}/>
      ))}
    </ul>
  )
}
