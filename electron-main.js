const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const appPath = path.join(__dirname, 'dist/ongenga/index.html');

let win

function createWindow () {
  win = new BrowserWindow(
    {
      width: 800, 
      height: 600,
      fullscreenable: true,
      title: 'Ongenga Private PS',
      webPreferences:{
        partition: 'persist:ongenga'
      }
    }
  )

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: appPath,
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools()

  // Open the DevTools optionally:
  // win.webContents.openDevTools()

  win.on('closed', () => { win = null });

  
  // Insert menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

const mainMenuTemplate = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'Quit', 
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  { 
    label: 'Students', 
    submenu: [
      {
        label: 'Add new student',
        click(m, browserWindow, e){
          win.webContents.send('app-navigate', 'students/new');
        } 
      },
      {
        label: 'My Students',
        click(m, browserWindow, e){
          win.webContents.send('app-navigate', 'students/mine');
        } 
      },
      {
        label: 'All students',
        click(m, browserWindow, e){
          win.webContents.send('app-navigate', 'students/all');
        } 
      }
    ]
  },
  { 
    label: 'Academic',
    click(m, browserWindow, e){
      win.webContents.send('app-navigate', 'academic');
    } 
  },
  { 
    label: 'Administration',
    click(m, browserWindow, e){
      win.webContents.send('app-navigate', 'admin');
    }  
  }
]