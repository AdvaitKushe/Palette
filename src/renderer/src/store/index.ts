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

export const selectedModelAtom = atom(['OpenAI', 'gpt-4o', 'OpenAI GPT-4o'])

export const createNewNoteAtom = atom(
  null,
  async (get, set, title: string, userInput: {prompt: string, company: string, model: string}) => {
    
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    console.log(userInput)
    const response = await window.api.getGeneratedResponse(userInput)
    const newNote = {
      title,
      uid: notes.length + 1,
      lastEditTime: Date.now(),
      messages: [{
        conversation: {
          prompt: userInput.prompt,
          company: model[0],
          model: model[1],
          response: response.response
        }
      }]
    }
    set(notesAtom, [newNote, ...notes])
    set(selectedNoteIndexAtom, 0)
  }
)

export const addMessageAtom = atom(
  null,
  async (get, set, message: string) => {
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const selectedNoteIndex = get(selectedNoteIndexAtom)
    if (selectedNoteIndex == null) return
    const response = await window.api.getGeneratedResponse({prompt: message, company: model[0], model: model[1]})
    const newMessage = {
      conversation: {
        prompt: message,
        company: model[0],
        model: model[1],
        response: response.response
      }
    }
    
    const updatedNotes = [...notes]
    if (!updatedNotes[selectedNoteIndex].messages) {
      updatedNotes[selectedNoteIndex].messages = []
    }
    updatedNotes[selectedNoteIndex].messages?.push(newMessage)
    set(notesAtom, updatedNotes)
  }
)