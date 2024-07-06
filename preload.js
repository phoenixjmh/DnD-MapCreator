
const { contextBridge, ipcRenderer, app } = require("electron");
const path = require('path');
const { basename, extname } = require('path');

contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
    // Expose other Node.js modules or functions as needed:
    getPathSync: (name) => ipcRenderer.sendSync('get-path', name),
    pathJoin: (...args) => path.join(...args),
    getStrippedFileName: (filePath) => basename(filePath, extname(filePath)),
    saveProject: async (filePath, projectData) => {
        ipcRenderer.send("save-project", { filePath, projectData });
        return new Promise((resolve, reject) => {
            ipcRenderer.once("save-project-success", resolve);
            ipcRenderer.once("save-project-error", (_, err) => reject(err));
        });
    },
    getSavesFolderPath: () => ipcRenderer.sendSync('get-saves-folder-path'),
    getBackupsFolderPath: () => ipcRenderer.sendSync('get-backups-folder-path'),
    showSaveDialog: (defaultPath, suggestedName) => {
        return ipcRenderer.sendSync('show-save-dialog', defaultPath, suggestedName);
    },


    showOpenDialog: (defaultPath) => {
        return ipcRenderer.sendSync('show-open-dialog', defaultPath);
    },
    readFile: (filePath) => {
        return ipcRenderer.sendSync('read-file', filePath);
    },

    onSaveProject: ((callback) => ipcRenderer.on('trigger-save-project', (_event) => callback())),

    onLoadProject: ((callback) => ipcRenderer.on('trigger-load-project', (_event) => callback())),

    onNewProject: ((callback) => ipcRenderer.on('trigger-new-project', (_event) => callback())),

    refreshConfirmed: () => ipcRenderer.send('new-project-destructive'),

});

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    ipcRenderer.on('exportAsPNG', (_event) => {
        console.log("PRELOAD EXPORT");
        const dataURL = canvas.toDataURL();
        ipcRenderer.send("exportAsPNG-data", dataURL);
    })
});
