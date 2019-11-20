const{app, BrowserWindow, ipcMain, BrowserView, Menu, MenuItem} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var view = null;

const menu = Menu.buildFromTemplate([
    {
        label:'Navigation',
        submenu:[
            {   label: "Reload",
                accelerator: 'CmdOrCtrl+R',
                click: () => { mainWindow.webContents.send('nav', 'reload') }
            },
            {   label: "Back",
                accelerator: 'CmdOrCtrl+Left',
                click: () => { mainWindow.webContents.send('nav', 'back') }
            },
            {   label: "Forward",
                accelerator: 'CmdOrCtrl+Right',
                click: () => { mainWindow.webContents.send('nav', 'forward') }
            },
            {type:'separator'},
            {   label: "Exit",
                accelerator: 'CmdOrCtrl+Q',
                click: () => { app.quit() }
            }
        ]
    },
    {
        label:"DevTools",
        submenu:[
            {   label: "Open Main DevTools",
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => { mainWindow.openDevTools() }
            },
            {   label: "Open Webview DevTools",
                accelerator: 'F12',
                click: () => { mainWindow.webContents.send('webview', 'dev') }
            },
            {   label: "Refresh Main",
                accelerator: 'CmdOrCtrl+Shift+R',
                click: () => { mainWindow.reload() }
            },
            {   label: "Clear Cache",
                accelerator: 'CmdOrCtrl+Shift+C',
                click: () => {
                    mainWindow.webContents.session.clearCache();
                    mainWindow.webContents.session.clearStorageData();
                }
            },
        ]
    }
])

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    Menu.setApplicationMenu(menu)
    mainWindow = new BrowserWindow({
        width: 100,
        height: 300,
        show:false,
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show()
    })

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    //mainWindow.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});