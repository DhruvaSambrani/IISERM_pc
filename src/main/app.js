const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')

var mainWindow = null;


const menu = Menu.buildFromTemplate([
    {
        label: 'Navigation',
        submenu: [
            {
                label: "Reload",
                accelerator: 'CmdOrCtrl+R',
                click: () => { mainWindow.webContents.send('nav', 'reload') }
            },
            {
                label: "Back",
                accelerator: 'CmdOrCtrl+Left',
                click: () => { mainWindow.webContents.send('nav', 'back') }
            },
            {
                label: "Forward",
                accelerator: 'CmdOrCtrl+Right',
                click: () => { mainWindow.webContents.send('nav', 'forward') }
            },
            { type: 'separator' },
            {
                label: "Exit",
                accelerator: 'CmdOrCtrl+Q',
                click: () => { app.quit() }
            }
        ]
    },
    {
        label: "DevTools",
        submenu: [
            {
                label: "Open Main DevTools",
                accelerator: 'CmdOrCtrl+Shift+I',
                click: () => { mainWindow.openDevTools() }
            },
            {
                label: "Open Webview DevTools",
                accelerator: 'F12',
                click: () => { mainWindow.webContents.send('webview', 'dev') }
            },
            {
                label: "Refresh Main",
                accelerator: 'CmdOrCtrl+Shift+R',
                click: () => { mainWindow.reload() }
            },
            {
                label: "Clear Cache",
                accelerator: 'CmdOrCtrl+Shift+C',
                click: () => {
                    mainWindow.webContents.session.clearCache();
                    mainWindow.webContents.session.clearStorageData();
                }
            },
        ]
    },
    {
        label: 'Info',
        click: showinfo
    }
])

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        width: 100,
        height: 300,
        show: false,
        'min-width': 500,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

ipcMain.on("settings", (event, arg) => {
    let child = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    child.loadURL('file://' + __dirname + '/settings.html');
    child.once('ready-to-show', () => {
        child.show()
    });
})

function showinfo() {
    let child = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        height: 300,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    child.loadURL('file://' + __dirname + '/info.html');
    child.once('ready-to-show', () => {
        child.show()
    });
}
