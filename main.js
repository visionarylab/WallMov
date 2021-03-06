const electron = require('electron')
const {app, BrowserWindow, Menu, Tray} = electron
const path = require('path')
const url = require('url')
let mainWindow
let tray

function createWindow () {
  const display = electron.screen.getPrimaryDisplay().size
  mainWindow = new BrowserWindow({
    width: display.width,
    height: display.height,
    resizable: false,
    frame: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  tray = new Tray(path.join(__dirname, 'assets', 'WallMov_16.png'))

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Mute',
      accelerator: 'CmdOrCtrl+M',
      type: 'checkbox',
      click: (item) => {
        mainWindow.webContents.setAudioMuted(item.checked)
      }
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit'
    }
  ])

  Menu.setApplicationMenu(menu)
  tray.setContextMenu(menu)
}

app.on('ready',createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
