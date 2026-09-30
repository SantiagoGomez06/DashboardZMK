import { app, BrowserWindow, Menu, session } from 'electron'
import path from 'node:path'

const isPackaged = app.isPackaged
const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
    }
  })
}

function createWindow() {
  const win = new BrowserWindow({
    title: 'ZMK Logística 360',
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    icon: path.join(__dirname, '../../build/icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !isPackaged,
    },
  })

  Menu.setApplicationMenu(null)

  if (isPackaged) {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
    win.webContents.on('devtools-opened', () => win.webContents.closeDevTools())
    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['http://*/*', 'https://*/*'] },
      (_details, callback) => callback({ cancel: true }),
    )
  } else {
    const url = process.env.ELECTRON_START_URL ?? 'http://127.0.0.1:5173'
    win.loadURL(url)
  }

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event, url) => {
    const ok =
      url.startsWith('file:') ||
      url.startsWith('http://127.0.0.1') ||
      url.startsWith('http://localhost')
    if (!ok) event.preventDefault()
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
