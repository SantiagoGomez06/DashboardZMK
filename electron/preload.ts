import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('zmkDesktop', {
  packaged: true,
})
