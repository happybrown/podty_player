// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path');
const { electron } = require('process');

let win = null;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadURL('https://m.podty.me/chart/podty/daily');
  win.setMenu(null);

  win.on('close', (event) => {
    if (app.quitting) {
      win = null
    } else {
      event.preventDefault()
      win.hide()
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    win.show()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => app.quitting = true)

const iconPath = path.join(__dirname, "app_ico.png");
let tray = null;

app.on('ready', () => {
  tray = new Tray(iconPath);
  const template = [
    {
      label: "Show",
      click: () => { win.show(); }
    }, {
      label: "Exit",
      click: () => { app.quit(); }
    }
  ];

  const ctxMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(ctxMenu);
});
