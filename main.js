const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

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
            // console.log(info); // デバッグ用：読み取った情報をコンソールに出力
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
