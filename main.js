// main.js(EntryPoint コメントアウトは消さず、増やしてもよい)
const { app, BrowserWindow, WebContentsView, ipcMain, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let webView;

require('electron-reload')(__dirname, {
    // electron: path.resolve(__dirname, '..', 'node_modules', '.bin', 'electron'),
    electron: path.resolve(__dirname, 'node_modules', '.bin', 'electron'),
    awaitWriteFinish: true,
});

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

    mainWindow.loadFile('index.html'); // 初期表示はhome.html

    Menu.setApplicationMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

// ipcMainでログメッセージを受信してVSCodeのターミナルに出力
ipcMain.on('log-message', (event, message) => {
    console.log('Log from renderer:', message);
});

ipcMain.on('get-video-list', (event) => {
    const videoDir = path.join(__dirname, 'src', 'dl');
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
    if (webView) {
        mainWindow.removeBrowserView(webView);
        webView.webContents.destroy();
        webView = null;
    }

    const webContents = mainWindow.webContents;
    webView = new WebContentsView(webContents);

    mainWindow.addBrowserView(webView);
    const bounds = mainWindow.getContentBounds();
    const headerHeight = 60;
    webView.setBounds({
        x: 0,
        y: headerHeight,
        width: bounds.width,
        height: bounds.height - headerHeight,
    });

    webView.webContents.loadURL(url);
});

ipcMain.on('remove-webview', () => {
    if (webView) {
        mainWindow.removeBrowserView(webView);
        webView.webContents.destroy();
        webView = null;
    }
});

ipcMain.on('go-back', () => {
    if (webView && webView.webContents.canGoBack()) {
        webView.webContents.goBack();
    }
});

ipcMain.on('go-forward', () => {
    if (webView && webView.webContents.canGoForward()) {
        webView.webContents.goForward();
    }
});

ipcMain.on('reload-page', () => {
    if (webView) {
        webView.webContents.reload();
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
