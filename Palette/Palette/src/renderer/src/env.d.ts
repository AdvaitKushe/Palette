/// <reference types="vite/client" />

interface Window {
  electron: {
    auth: {
      on: (channel: string, func: (...args: string[]) => void) => void
      openExternal: (url: string) => Promise<void>
    }
    sendUserData: (user: any) => Promise<void>
  }
  api: {
    saveSettings: (settings: {OpenAI: string, Gemini: string, Anthropic: string}) => Promise<{response: string}>
    getSettings: () => Promise<{response: string}>
    getGeneratedResponse: ({prompt: string, company: string, model: string, id: string, context: any, files: any}) => Promise<{company: string, response: string}>
    streamOpenai: ({prompt: string, company: string, model: string, id: string, context: any, files: any}) => Promise<boolean>
    onStreamChunk: (callback: (chunk: string) => void) => void
    onStreamDone: (callback: () => void) => void
    removeStreamListeners: () => void
  }
  
}