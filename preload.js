
const { contextBridge, ipcRenderer,app } = require("electron");
const path = require('path');

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  // Expose other Node.js modules or functions as needed:
  getPathSync: (name) => ipcRenderer.sendSync('get-path', name),
  pathJoin: (...args) => path.join(...args), 
  saveProject: async (filePath, projectData) => {
    ipcRenderer.send("save-project", { filePath, projectData });
    return new Promise((resolve, reject) => {
      ipcRenderer.once("save-project-success", resolve); 
      ipcRenderer.once("save-project-error", (_, err) => reject(err)); 
    });
  },
  getSavesFolderPath:()=>ipcRenderer.sendSync('get-saves-folder-path'),
});
