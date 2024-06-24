const { app, BrowserWindow } = require('electron');
require('electron-reload')(__dirname);
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,  // Adjust to your preferred size
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // If you need Node.js integration
        }
    });

    win.loadFile(path.join(__dirname, 'src', 'index.html'));

    // Open the DevTools automatically if needed:
    // win.webContents.openDevTools()
}

app.whenReady().then(createWindow);

// Other lifecycle events (optional)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit(); 
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});