// main.js
const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require('electron');

let mainWindow;
let view;

function createWindow () {
    mainWindow = new BrowserWindow({
        width:     800,
        height:    700,
        minWidth:  400,
        minHeight: 640,
        webPreferences: {
            nodeIntegration:    true,
            contextIsolation:   false,
            enableRemoteModule: true,
        }
    });

    // ローカルのHTMLファイルをロード
    mainWindow.loadFile('index.html');

    view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    mainWindow.setBrowserView(view);
    updateBounds();

    view.webContents.loadURL('https://www.youtube.com/');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('resize', () => {
        updateBounds();
    });

    ipcMain.on('load-url', (event, url) => {
        view.webContents.loadURL(url);
    });

    ipcMain.on('go-back', () => {
        if (view.webContents.canGoBack()) {
            view.webContents.goBack();
        }
    });

    ipcMain.on('go-forward', () => {
        if (view.webContents.canGoForward()) {
            view.webContents.goForward();
        }
    });

    ipcMain.on('reload-page', () => {
        view.webContents.reload();
    });

    function updateBounds() {
        const { width, height } = mainWindow.getContentBounds();
        view.setBounds({ x: 0, y: 60, width: width, height: height - 60 });
        view.setAutoResize({ width: true, height: true });
    }
}

app.whenReady().then(() => {
    createWindow();

    Menu.setApplicationMenu(null);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});