import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from './hooks/useNotesList'

export const GeneratedChat = ({ className, ...props }: ComponentProps<'div'>) => {
  const { notes, selectedNoteIndex } = useNotesList({
    onSelect: () => {
      console.log('note selected')
    }
  })
  return (
    <div className={twMerge('flex flex-col', className)} {...props}>
      <div className="flex flex-col">
        <div className="flex-1">
          {selectedNoteIndex != null ? (
            <div>
              {notes?.[selectedNoteIndex]?.messages?.map((message, index) => (
                <div key={index}>
                  <pre>{JSON.stringify(message, null, 2)}</pre>
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
