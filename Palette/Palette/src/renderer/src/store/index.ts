import { atom } from "jotai";
import debounce from 'lodash/debounce';

import { Message, NoteInfo, User } from '../../shared/model';
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/fire";
import { deleteCollection } from "../firebase/crud";



// Create an atom that depends on userID
const notesAtomAsync = atom<NoteInfo[]>([])

export const notesAtom = atom(
  (get) => get(notesAtomAsync),
  // @ts-ignore
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
    
    // Process data in a single pass instead of multiple operations
    const notes: NoteInfo[] = res.docs.reduce((acc, doc) => {
      const data = doc.data();
      if (data) {
        acc.push({
          ...data,
          key: doc.id,
          uid: data.uid || 0,
          title: data.title || '',
          lastEditTime: data.lastEditTime || Date.now(),
          messages: data.messages || []
        } as NoteInfo);
      }
      return acc;
    }, [] as NoteInfo[]);
    
    // Sort once at the end
    notes.sort((a, b) => b.lastEditTime - a.lastEditTime);
    set(notesAtom, notes)
  }
)

export const tokenAtom = atom<string | null>(null)

export const currImageArrayAtom = atom<(ArrayBuffer | string | null)[]>([])

export const userAtom = atom<User | null>(null)

export const isSearchOpenAtom = atom<boolean>(false)

export const messageAtom = atom<string>('New Note')

export const userIDAtom = atom<string | null>(null)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedModelAtom = atom(['OpenAI', 'gpt-4o', 'OpenAI GPT-4o'])

export const isWaitingForResponseAtom = atom<boolean>(false)


export const createNewNoteAtom = atom(
  null,
  async (get, set, title: string, userInput: {prompt: string, company: string, model: string, id?: string | null}) => {
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const userId = get(userIDAtom)
    const currImageArray = get(currImageArrayAtom)
    let newNote: NoteInfo = {
      title: title,
      uid: notes.length + 1,
      lastEditTime: Date.now(),
      key: '',
      messages: [{
        conversation: {
          prompt: userInput.prompt,
          company: model[0],
          model: model[1],
          response: 'Thinking of a response...',
          files: currImageArray
        }
      }]
    }

    // Create document with initial state
    const docRef = collection(db, "users/" + userId + "/chats")
    const res = await addDoc(docRef, newNote)
    
    // Update with document key
    newNote = {
      ...newNote,
      key: res.id
    }
    
    // Update UI immediately
    set(notesAtom, [newNote, ...notes])
    set(selectedNoteIndexAtom, 0)

    // Get actual response and update
    
    const response = await window.api.getGeneratedResponse({
      ...userInput, 
      id: userId, 
      
      context: []
    })
    
    // Update the message with actual response
    const updatedMessages = [{
      conversation: {
        prompt: userInput.prompt,
        company: model[0],
        model: model[1],
        response: response.response,
        files: currImageArray
      }
    }]

    // Update both database and UI
    await updateDoc(doc(db, "users/" + userId + "/chats/" + res.id), {
      messages: updatedMessages
    })

    set(notesAtom, [
      { ...newNote, messages: updatedMessages },
      ...notes.slice(1)
    ])
  }
)


export const deleteNoteAtom = atom(null, async (get, set, index: number) => {
  const userId = get(userIDAtom)
  const notes = get(notesAtom)

  if (index === null || !notes) return

  if (index != null && userId != null && notes[index].key) {
    
    await deleteCollection(notes[index].key, userId)
  }
  

  set(notesAtom, notes.filter((_, i) => i !== index))
  set(selectedNoteIndexAtom, null)
})

// Optimize message adding with debouncing and batched updates
export const addMessageAtom = atom(
  null,
  async (get, set, message: string) => {
    const notes = await get(notesAtomAsync)
    const model = get(selectedModelAtom)
    const userId = get(userIDAtom)
    const selectedNoteIndex = get(selectedNoteIndexAtom)
    const currImageArray = get(currImageArrayAtom)

    if (selectedNoteIndex == null || !userId) return
    
    const currentNote = notes[selectedNoteIndex]
    const docRef = doc(db, "users/" + userId + "/chats/" + currentNote.key)
    
    const newMessage: Message = {
      conversation: {
        prompt: message,
        company: model[0],
        model: model[1],
        response: 'Thinking of a response...',
        files: currImageArray
      }
    }
    
    // Batch updates to reduce renders
    const updatedMessages = [...(currentNote.messages || []), newMessage]
    const updatedNote = {
      ...currentNote,
      messages: updatedMessages,
      lastEditTime: Date.now()

    }
    
    // Update database and state in parallel
    await Promise.all([
      updateDoc(docRef, {
        messages: updatedMessages,
        lastEditTime: updatedNote.lastEditTime
      }),
      set(notesAtom, notes.map((note, i) => 
        i === selectedNoteIndex ? updatedNote : note
      ))
    ])

    // Debounce API calls to prevent overwhelming the system
    const debouncedApiCall = debounce(async () => {
      const response = await window.api.getGeneratedResponse({
        prompt: message, 
        company: model[0], 
        model: model[1], 
        id: userId,
        context: notes[selectedNoteIndex]
          ?.messages
          ?.slice()
          .reverse()
          .map(message => message.conversation)
          .map(msg => msg && ({
            prompt: msg.prompt,
            response: msg.response
          }))
          .filter((msg): msg is {prompt: string, response: string} => msg !== null)
      })
      
      const updatedMessage = {
        conversation: {
          ...newMessage.conversation,
          response: response.response
        }
      }
      
      const finalMessages = [...updatedMessages.slice(0, -1), updatedMessage]
      
      // Batch final updates
      await Promise.all([
        updateDoc(docRef, { messages: finalMessages }),
        set(notesAtom, notes.map((note, i) => 
          i === selectedNoteIndex 
            ? { ...note, messages: finalMessages }
            : note
        ))
      ])
    }, 300) // 300ms delay
    
    debouncedApiCall()
  }
)