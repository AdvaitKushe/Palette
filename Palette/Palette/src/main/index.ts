import { app, shell, BrowserWindow, ipcMain, } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;


console.log(process.defaultApp)
console.log(process.execPath)
if (process.defaultApp) {
  // Running via 'electron path/to/main.js'
  app.setAsDefaultProtocolClient(
    'palette',
    
  );
} else {
  // Running via packaged .app / .exe
  app.setAsDefaultProtocolClient('palette');
}

function createWindow(): void {
   mainWindow = new BrowserWindow({
    width: 1060,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Palette',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const gotTheLock = app.requestSingleInstanceLock()
  // Windows 
  if (!gotTheLock) {
    app.quit()
  } else {
    // @ts-ignore
    app.on('second-instance', (event, commandLine) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
  
        // Parse the token from the protocol URL
        const url = commandLine[commandLine.length - 1]
        if (url.startsWith('palette://')) {
          const urlParams = new URLSearchParams(url.replace('palette://', ''))

           
          mainWindow.webContents.send('send-token', urlParams)
        }
      }
    })
  }

  
  //Mac
  app.on('open-url', (event, url) => {
    event.preventDefault()
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      
      // Parse the token from the protocol URL
      if (url.startsWith('palette://')) {
        const urlParams = new URLSearchParams(url.replace('palette://', ''))
        console.log(urlParams)
        const token = urlParams.get('token')
        console.log(token)
        mainWindow.webContents.send('send-token', token)
      }
    }
  })

  // For macOS, we need to handle the protocol before app is ready

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  

  // Add this temporarily for debugging
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.AdvaitKushe.palette')

  if (!process.defaultApp) {
    // Only call this if you're in the packaged build
    app.setAsDefaultProtocolClient('palette');
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  //API bussiness logic
  ipcMain.handle('open-external', (_, url) => {

    shell.openExternal(url)
    
  })

  
  ipcMain.handle('streamOpenai', async (event, userInput) => {
    try {
      console.log("Calling streamOpenai");
      const response = await fetch('http://127.0.0.1:5001/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInput)
      });

      const reader = response.body?.getReader();
      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        mainWindow.webContents.send('stream-chunk', chunk);
      }
      mainWindow.webContents.send('stream-done');
      return true;
    } catch (error) {
      console.error('Error streaming openai:', error);
      throw error;
    }
  });


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
