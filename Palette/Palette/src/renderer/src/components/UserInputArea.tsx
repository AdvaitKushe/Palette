import { ComponentProps, useRef, useState } from 'react'
import { useSetAtom, useAtom } from 'jotai'
import {
  createNewNoteAtom,
  selectedModelAtom,
  addMessageAtom,
  messageAtom,
  isWaitingForResponseAtom,
  currImageArrayAtom
} from '../store/index'
import { useNotesList } from '@renderer/hooks/useNotesList'
import { ChatBox } from './ChatBox'
import { NewNotePage } from './NewNotePage'
import { sendFunction } from '@renderer/utils'
export const UserInputArea = ({
  contentRef
}: ComponentProps<'div'> & { contentRef?: React.RefObject<HTMLDivElement> }) => {
  const [, setRows] = useState(1)
  const MAX_ROWS = 7
  const createNewNote = useSetAtom(createNewNoteAtom)
  const addMessage = useSetAtom(addMessageAtom)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const setIsWaitingForResponse = useSetAtom(isWaitingForResponseAtom)
  const [message, setMessage] = useAtom(messageAtom)
  const [, setCurrImageArray] = useAtom(currImageArrayAtom)
  const { selectedNoteIndex } = useNotesList({})

  const [model] = useAtom(selectedModelAtom)

  const sendFunc = sendFunction(
    setIsWaitingForResponse,
    inputRef,
    createNewNote,
    addMessage,
    message,
    selectedNoteIndex,
    setMessage,
    setCurrImageArray,
    contentRef,
    model
  )
  return selectedNoteIndex != null ? (
    <div className="w-full ">
      <ChatBox
        inputRef={inputRef}
        sendFunction={sendFunc}
        setRows={setRows}
        MAX_ROWS={MAX_ROWS}
        setMessage={setMessage}
      />
    </div>
  ) : (
    <div className="w-full h-screen flex items-center justify-center mb-[50%]">
      <NewNotePage
        inputRef={inputRef}
        sendFunction={sendFunc}
        setRows={setRows}
        MAX_ROWS={MAX_ROWS}
        setMessage={setMessage}
      />
    </div>
  )
}
