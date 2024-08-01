const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

document.getElementById('download-btn').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    ipcRenderer.send('download-audio', url);
});

ipcRenderer.on('download-complete', (event, filePath) => {
    const audioPlayer = new Audio(filePath);
    audioPlayer.play();
});
