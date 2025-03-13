import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from '@electron-toolkit/preload'


if (!process.contextIsolated) {
  throw new Error('Context isolation is not enabled')
}

try {
  console.log('Attempting to expose API...')

  contextBridge.exposeInMainWorld('electron', {
    auth: {
      on(channel: string, func: (...args: any[]) => void) {
        const validChannels = ['send-token']
        if(validChannels.includes(channel)) {
          ipcRenderer.on(channel, (_, ...args) => func(...args))
        }
      },
      openExternal: (url: string) => ipcRenderer.invoke('open-external', url)
    },
    
  })
  


  contextBridge.exposeInMainWorld('api', {
    getSettings: () => ipcRenderer.invoke('getSettings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('saveSettings', settings),
    getGeneratedResponse: (userInput: any) => ipcRenderer.invoke('getGeneratedResponse', userInput),
    streamOpenai: (input) => ipcRenderer.invoke('streamOpenai', input),
    onStreamChunk: (callback) => ipcRenderer.on('stream-chunk', (_, chunk) => callback(chunk)),
    onStreamDone: (callback) => ipcRenderer.on('stream-done', () => callback()),
    removeStreamListeners: () => {
      ipcRenderer.removeAllListeners('stream-chunk')
      ipcRenderer.removeAllListeners('stream-done')
    }
  })
  console.log('API exposed successfully')
} catch (error) {
  console.error('Failed to expose API:', error)
}

// Add this to your global.d.ts or a similar type declaration file:
declare global {
  interface Window {
    api: {
      saveSettings: (settings: any) => Promise<any>
      getSettings: () => Promise<any>
      getGeneratedResponse: (userInput: any) => Promise<any>
      streamOpenai: (input: any) => Promise<boolean>
      onStreamChunk: (callback: (chunk: string) => void) => void
      onStreamDone: (callback: () => void) => void
      removeStreamListeners: () => void
    }
  }
}
