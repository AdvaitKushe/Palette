import { useEffect, useRef } from 'react'
import { isSearchOpenAtom } from '../store'
import { useAtom } from 'jotai'

export const SearchBox = () => {
  //@ts-ignore
  const [isSearchOpen, setIsSearchOpen] = useAtom(isSearchOpenAtom)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsSearchOpen])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-start pt-[30vh]">
      <div ref={buttonRef} className="bg-zinc-900/70 border border-white/20 p-4 rounded-md w-1/2">
        <input
          type="text"
          className="w-full p-2 rounded-md bg-transparent text-white border-none outline-none"
          placeholder="Search"
        />
      </div>
    </div>
  )
}
