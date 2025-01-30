import { ComponentProps, KeyboardEvent, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SendChat } from './Buttons'
import { useSetAtom, useAtom } from 'jotai'
import { createNewNoteAtom, selectedModelAtom, addMessageAtom } from '../store/index'
import { useNotesList } from '@renderer/hooks/useNotesList'

export const UserInputArea = ({ className, ...props }: ComponentProps<'div'>) => {
  const [rows, setRows] = useState(1)
  const MAX_ROWS = 7
  const createNewNote = useSetAtom(createNewNoteAtom)
  const addMessage = useSetAtom(addMessageAtom)
 
  const [newNoteTitle, setNewNoteTitle] = useState('New Note')
  const { selectedNoteIndex } = useNotesList({
    onSelect: () => {
      console.log('note selected')
    }
  })
  const [model] = useAtom(selectedModelAtom)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      setRows((prev) => Math.min(prev + 1, MAX_ROWS))
    }

    if (e.key === 'Backspace' && e.currentTarget.value.endsWith('\n')) {
      setRows((prev) => Math.max(1, prev - 1))
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    textarea.style.height = '0'
    const newHeight = Math.min(textarea.scrollHeight, MAX_ROWS * 24) // 24px is approx line height
    textarea.style.height = `${newHeight}px`
  }

  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-center pl-3 ml-1 mr-1 bg-zinc-800 border rounded-[20px] border-zinc-400/50',
        className
      )}
      {...props}
    >
      <textarea
        rows={rows}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className="w-full bg-transparent outline-none resize-none overflow-y-auto whitespace-pre-wrap min-h-[24px]"
        style={{ lineHeight: '1.5' }}
        onChange={(e) => setNewNoteTitle(e.currentTarget.value)}
      />
      <SendChat
        onClick={() => {
         
          selectedNoteIndex == null
            ? createNewNote(newNoteTitle, {
                prompt: newNoteTitle,
                company: model[0], // company from selected model
                model: model[1] // model name from selected model
              })
            : addMessage(newNoteTitle)
        }}
      />
    </div>
  )
}
