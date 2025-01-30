import { twMerge } from 'tailwind-merge'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { ActionButton } from './ActionButton'

import { SettingsDropdown } from './SettingsDropDown'

export const Settings = ({ className, ...props }: ComponentProps<'div'>) => {
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState({
    OpenAI: '',
    Gemini: '',
    Anthropic: ''
  })

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await window.api.saveSettings(settings).then((response) => {
          console.log(response)
        })
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }
    saveSettings()
  }, [settings])

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

  const handleSettingsChange = (value: string[]) => {
    setSettings({ OpenAI: value[0], Gemini: value[1], Anthropic: value[2] })
  }

  return (
    <div
      ref={dropdownRef}
      className={twMerge('flex flex-row items-center justify-center', className)}
      {...props}
    >
      <ActionButton
        onClick={() => {
          console.log('settings clicked')
          setIsOpen(!isOpen)
        }}
      >
        <i className="bi bi-gear flex items-center"></i>
      </ActionButton>
      {isOpen && (
        <div className="absolute right-0 top-10 w-96 ">
          <SettingsDropdown
            className=""
            openai={settings.OpenAI}
            gemini={settings.Gemini}
            anthropic={settings.Anthropic}
            onSettingsChange={handleSettingsChange}
          />
        </div>
      )}
    </div>
  )
}
