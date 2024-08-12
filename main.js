const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let browserView;

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 300,
        minHeight: 620,
        maxWidth: 1600,
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html'); // 初期表示はHome画面

    Menu.setApplicationMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

ipcMain.on('get-video-list', (event) => {
    const videoDir = path.join(__dirname, 'dl');
    fs.readdir(videoDir, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        const videoList = files.map(file => {
            const infoPath = path.join(videoDir, file, 'info.json');
            const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
            return {
                title: info.title,
                videoPath: path.join(videoDir, file, 'music.mp4'),
                thumbnailPath: path.join(videoDir, file, 'thumbnail.png'),
                author: info.author,
                timeDisplay: info.timeDisplay,
                videoQuality: info.videoQuality,
                audioQuality: info.audioQuality
            };
        });
        event.reply('video-list', videoList);
    });
});

ipcMain.on('load-url', (event, url) => {
    if (!browserView) {
        browserView = new BrowserView({
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
            }
        });
        mainWindow.setBrowserView(browserView);
        browserView.setBounds({ x: 0, y: 60, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 60 });
        browserView.setAutoResize({ width: true, height: true });
    }
    browserView.webContents.loadURL(url);
});

ipcMain.on('remove-browser-view', () => {
    if (browserView) {
        mainWindow.removeBrowserView(browserView);
        browserView.destroy();
        browserView = null;
    }
});

ipcMain.on('go-back', () => {
    if (browserView && browserView.webContents.canGoBack()) {
        browserView.webContents.goBack();
    }
});

ipcMain.on('go-forward', () => {
    if (browserView && browserView.webContents.canGoForward()) {
        browserView.webContents.goForward();
    }
});

ipcMain.on('reload-page', () => {
    if (browserView) {
        browserView.webContents.reload();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
