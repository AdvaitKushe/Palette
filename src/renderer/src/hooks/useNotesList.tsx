import { notesAtom, selectedNoteIndexAtom } from '../store'
import { useAtom, useAtomValue } from 'jotai'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom)

  const [selectedNoteIndex, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom)

  //async function to set the selected node index set the value of selectedNoteIndex
  const handleNoteSelect = (index: number | null) => async () => {
    setSelectedNoteIndex(index)
    if (onSelect) {
      onSelect()
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}