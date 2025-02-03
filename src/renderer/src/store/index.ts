import allChats from './mock/allChats.json'
import { atom } from "jotai";
import { unwrap } from "jotai/utils";
import { NoteInfo } from '../../shared/model';
import { addDoc, collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase/fire";

const loadNotes = async () => {

  
    const notes = allChats.notes.map(note => ({
        ...note,
        uid: Number(note.uid)
    }))
    return notes
}


// Create an atom that depends on userID
const notesAtomAsync = atom<NoteInfo[]>([])

export const notesAtom = atom(
  (get) => get(notesAtomAsync),
  (get, set, newNotes: NoteInfo[]) => set(notesAtomAsync, newNotes)
)

// Add a loader effect
export const loadNotesAtom = atom(
  null,
  async (get, set) => {
    const userId = get(userIDAtom)
    if (!userId) return
    
    const docRef = collection(db, "users/" + userId + "/chats")
    const res = await getDocs(docRef)
    const notes: NoteInfo[] = res.docs.map(doc => ({
      ...doc.data(),
      key: doc.id,
      uid: doc.data().uid || 0,
      title: doc.data().title || '',
      lastEditTime: doc.data().lastEditTime || Date.now(),
      messages: doc.data().messages || []
    } as NoteInfo)).sort((a, b) => b.lastEditTime - a.lastEditTime)
    set(notesAtom, notes)
  }
)

export const tokenAtom = atom<string | null>(null)

export const userIDAtom = atom<string | null>(null)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedModelAtom = atom(['OpenAI', 'gpt-4o', 'OpenAI GPT-4o'])

export const createNewNoteAtom = atom(
  null,
  async (get, set, title: string, userInput: {prompt: string, company: string, model: string, id?: string | null}) => {
    
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const userId = get(userIDAtom)
    console.log(userInput)
    

    const response = await window.api.getGeneratedResponse({...userInput, id: userId})
    let newNote: NoteInfo = {
      title,
      uid: notes.length + 1,
      lastEditTime: Date.now(),
      key: '',
      messages: [{
        conversation: {
          prompt: userInput.prompt,
          company: model[0],
          model: model[1],
          response: response.response
        }
      }]
    }
    //initilize the chat in firebase
    const docRef = collection(db, "users/" + userId + "/chats")
    const res = await addDoc(docRef, newNote)
    console.log(res)
    newNote = {
      ...newNote,
      key: res.id
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
    const userId = get(userIDAtom)
    const selectedNoteIndex = get(selectedNoteIndexAtom)
    if (selectedNoteIndex == null) return
    const response = await window.api.getGeneratedResponse({prompt: message, company: model[0], model: model[1], id: userId})
    const newMessage = {
      conversation: {
        prompt: message,
        company: model[0],
        model: model[1],
        response: response.response
      }
    }

    const docRef = doc(db, "users/" + userId + "/chats/" + notes[selectedNoteIndex].key)
    await updateDoc(docRef, {
      messages: [...(notes[selectedNoteIndex].messages || []), newMessage]
    })

    
    const updatedNotes = [...notes]
    if (!updatedNotes[selectedNoteIndex].messages) {
      updatedNotes[selectedNoteIndex].messages = []
    }
    updatedNotes[selectedNoteIndex].messages?.push(newMessage)
    set(notesAtom, updatedNotes)
  }
)