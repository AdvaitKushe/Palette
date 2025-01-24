import { ComponentProps, useState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ActionButton } from './ActionButton'
import { ModelDropdown } from './ModelDropdown'

export const ModelPicker = ({ className, ...props }: ComponentProps<'div'>) => {
  const [model, setModel] = useState(['openai', 'gpt-4o', 'OpenAI GPT-4o'])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleModelSelect = (model: string, company: string) => {
    setModel([company, model, `${company} ${model}`])
    setIsOpen(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={twMerge('flex flex-col items-center justify-center z-50 relative', className)}
      {...props}
    >
      <ActionButton
        className="flex flex-row items-center justify-center"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="flex flex-row items-left justify-center">{model[2]}</div>
        <i className="ml-2 bi bi-chevron-down flex items-center"></i>
      </ActionButton>
      {isOpen && <ModelDropdown className = "" onModelSelect={handleModelSelect} />}
    </div>
  )
}
