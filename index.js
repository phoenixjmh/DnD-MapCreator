const { app, ipcRenderer, BrowserWindow, Menu } = require("electron");
require("electron-reload")(__dirname);
const path = require("path");
const fs = require("fs");

const savesFolderPath = path.join(app.getPath("userData"), "Saves");
if (!fs.existsSync(savesFolderPath)) {
    fs.mkdirSync(savesFolderPath);
}

const backupsFolderPath = path.join(savesFolderPath, "Backups");
if (!fs.existsSync(backupsFolderPath)) {
    fs.mkdirSync(backupsFolderPath);
}

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 1200, // Adjust to your preferred size
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            sandbox: false,
            nodeIntegration: true,
            contextIsolation: true,
        },
    });
    //Setup menu toolbar
    const mainMenu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "New Project",
                    click: () => {
                        win.webContents.send("trigger-new-project");
                    },
                },

                {
                    label: "Save Project",
                    click: () => {
                        win.webContents.send("trigger-save-project");
                    },
                },
                {
                    label: "Load Project",
                    click: () => {
                        win.webContents.send("trigger-load-project");
                    },
                },
                {
                    label: "Export as PNG",
                    click: () => {
                        win.webContents.send("exportAsPNG");
                    },
                },
            ],
        },
        {
            // New "Developer" submenu
            label: "Developer",
            submenu: [
                {
                    label: "Toggle Developer Tools",
                    click: () => {
                        win.webContents.toggleDevTools();
                    },
                },
                {
                    label: "Refresh",
                    click: () => {
                        win.webContents.reload();
                    },
                },
            ],
        },

    ]);
    Menu.setApplicationMenu(mainMenu);

    win.loadFile(path.join(__dirname, "src", "index.html"));

    win.webContents.once("dom-ready", () => {
        win.webContents.send("api-exposed"); // Signal that APIs are ready
    });
    // Open the DevTools automatically if needed:
    // win.webContents.openDevTools();

}

app.whenReady().then(createWindow);

// Other lifecycle events (optional)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const { ipcMain, dialog } = require("electron");

ipcMain.on("get-path", (event, name) => {
    console.log(name);
    event.returnValue = app.getPath(name);
});

ipcMain.on("save-project", async (event, data) => {
    const { filePath, projectData } = data;
    try {
        fs.writeFileSync(filePath, projectData);
        event.reply("save-project-success"); // Inform renderer of success
    } catch (err) {
        console.log("Error saving project:", err);
        event.reply("save-project-error", err.message); // Send error message
    }
});

ipcMain.on("get-saves-folder-path", (event) => {
    event.returnValue = savesFolderPath;
});
ipcMain.on("get-backups-folder-path", (event) => {
    event.returnValue = backupsFolderPath;
});

ipcMain.on("show-save-dialog", async (event, defaultPath, suggestedName) => {
    const result = await dialog.showSaveDialog({
        defaultPath: path.join(defaultPath, suggestedName + ".DMAP"),
        filters: [{ name: "DNDMAP_PROJECT", extensions: ["DMAP"] }],
    });
    event.returnValue = result; // Send the result back to the renderer
});

ipcMain.on("show-open-dialog", async (event, defaultPath) => {
    const result = await dialog.showOpenDialog({
        defaultPath,
        properties: ["openFile"],
        filters: [{ name: "DNDMAP_PROJECT", extensions: ["DMAP"] }],
    });
    event.returnValue = result;
});

ipcMain.on("read-file", async (event, filePath) => {
    try {
        const contents = await fs.promises.readFile(filePath, "utf-8");
        event.returnValue = contents; // Send the file contents back
    } catch (err) {
        console.error("Error reading file:", err);
        event.returnValue = null; // Or send an error message if needed
    }
});

ipcMain.on("exportAsPNG-data", async (event, dataURL) => {
    console.log("RECIEVER");
    const result = await dialog.showSaveDialog({
        defaultPath: path.join(app.getPath("pictures"), "mapExport.png"),
        filters: [{ name: "PNG Images", extensions: ["png"] }],
    });

    if (!result.canceled) {
        const data = dataURL.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(result.filePath, data, "base64", (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
        });
    } else {
        // Handle cancellation
        console.log("Export canceled");
    }
});

ipcMain.on("new-project-destructive", () => {
    win.webContents.reload();
});
