import { handleKeyDown } from '@renderer/utils'
import { DragAndDrop } from './Buttons/DragAndDrop'
import { SendChat } from './Buttons/SendChat'
import { ComponentProps, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { currImageArrayAtom } from '@renderer/store'
import { useAtom } from 'jotai'

export const ChatBox = ({
  className,

  sendFunction,
  setRows,
  MAX_ROWS,
  setMessage,
  ...props
}: ComponentProps<'div'> & {
  sendFunction: (inputRef: React.RefObject<HTMLTextAreaElement>) => void
  setRows: React.Dispatch<React.SetStateAction<number>>
  MAX_ROWS: number
  setMessage: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [currImageArray, setCurrImageArray] = useAtom(currImageArrayAtom)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  


  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Convert to base64 string for storing image data
        const base64String = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
        const imageData = `data:${file.type};base64,${base64String}`
        setCurrImageArray((prev) => [...prev, imageData])
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="flex flex-row relative items-end w-full " {...getRootProps()} {...props}>
      <DragAndDrop {...getInputProps()} />
      <SendChat onClick={() => sendFunction(inputRef)} />

      <div className="border border-zinc-400/50 rounded-[20px] min-h-[100px] w-full overflow-hidden flex">
        <textarea
          ref={inputRef}
          rows={1}
          onKeyDown={(e) => handleKeyDown(e, () => sendFunction(inputRef), setRows, MAX_ROWS, inputRef)}
          className="flex-1 bg-transparent pt-3 pl-3 pr-10 outline-none resize-none whitespace-pre-wrap w-full mb-12"
          onChange={(e) => setMessage(e.currentTarget.value)}
          placeholder="Add an API key for your selected models in the settings tab to start chatting"
        />
      </div>
    </div>
  )
}
