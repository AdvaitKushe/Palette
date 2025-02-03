import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: {
      auth: {
        on(channel: string, callback: (message: any) => void): void
      }
      openExternal: (url: string) => Promise<void>
    }
    api: {
      getSettings: () => Promise<any>
      saveSettings: (settings: any) => Promise<any>
      getGeneratedResponse: (userInput: any) => Promise<any>
    }
  }
}
