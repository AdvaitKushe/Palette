import allChats from './mock/allChats.json'
import { atom } from "jotai";
import { unwrap } from "jotai/utils";
import { NoteInfo } from '../../shared/model';

const loadNotes = async () => {
    const notes = allChats.notes.map(note => ({
        ...note,
        uid: Number(note.uid)
    }))
    return notes
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)


export const createNewNoteAtom = atom(
  null,
  async (get, set, title: string) => {
    const notes = await get(notesAtomAsync)
    const newNote = {
      title,
      uid: notes.length + 1,
      lastEditTime: Date.now()
    }
    set(notesAtom, [newNote, ...notes])
    set(selectedNoteIndexAtom, 0)
  }
)