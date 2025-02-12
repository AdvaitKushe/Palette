import { useAtom } from 'jotai'
import { selectedModelAtom } from '../store'

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>, 
  sendFunction: () => void, 
  
  setRows: React.Dispatch<React.SetStateAction<number>>, 
  MAX_ROWS: number
) => {
  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = '10px'
    const newHeight = Math.min(textarea.scrollHeight, MAX_ROWS * 24)
    textarea.style.height = `${newHeight}px`
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendFunction()
  }
  
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    const textarea = e.currentTarget
    textarea.value += '\n'
    setRows((prev) => Math.min(prev + 1, MAX_ROWS))
    adjustHeight(textarea)
    textarea.scrollTo({
      top: textarea.scrollHeight,
      behavior: 'smooth'
    })
  }

  if (e.key === 'Backspace' && e.currentTarget.value.endsWith('\n')) {
    setRows((prev) => Math.max(1, prev - 1))
    adjustHeight(e.currentTarget)
  }

  // Call adjustHeight on any key press
  adjustHeight(e.currentTarget)
}

export interface sendAMessage {
  prompt: string
  company: string
  model: string
  
}

export const sendFunction = (
  setIsWaitingForResponse: (isWaitingForResponse: boolean) => void,
  inputRef: React.RefObject<HTMLTextAreaElement>,
  createNewNote: (message: string, sendAMessage: sendAMessage) => void,
  addMessage: (message: string) => void,
  message: string,
  selectedNoteIndex: number | null,
  setMessage: (message: string) => void,
  setCurrImageArray: (currImageArray: string[]) => void,
  contentRef: React.RefObject<HTMLDivElement> | undefined,
  model: string[]
) => {
  return () => {
    setIsWaitingForResponse(true)
    if (inputRef.current?.value === '') {
      return
    }

    selectedNoteIndex == null
      ? createNewNote(message, {
          prompt: message,
          company: model[0], // company from selected model
          model: model[1] // model name from selected model
        })
      : addMessage(message)

    if (inputRef.current) {
      inputRef.current.value = ''
      setMessage('')
      setCurrImageArray([])
    }

    if (contentRef?.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
}