export interface NoteInfo {
    title: string
    uid: number
    lastEditTime: number
    content?: string
    messages?: Array<{
      conversation: {
        prompt: string
        company: string
        model: string
        response: string
      },
      
    }>
  }
  
  export type NoteContent = string