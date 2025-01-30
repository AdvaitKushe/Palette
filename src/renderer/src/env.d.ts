/// <reference types="vite/client" />

interface Window {
  electron: {
    auth: {
      on: (channel: string, func: (...args: any[]) => void) => void
    }
    sendUserData: (user: any) => Promise<void>
  }
  api: {
    saveSettings: (settings: {OpenAI: string, Gemini: string, Anthropic: string}) => Promise<{response: string}>
    getSettings: () => Promise<{response: string}>
    getGeneratedResponse: ({prompt: string, company: string, model: string}) => Promise<{company: string, response: string}>
  }
  
}