import { contextBridge } from "electron"

if (!process.contextIsolated) {
  throw new Error('Context isolation is not enabled')
}

try {
  contextBridge.exposeInMainWorld('api', {
    //TODO: Add API here
  })
} catch (error) {
  console.error(error)
}
