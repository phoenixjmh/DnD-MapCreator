let autosaveInterval;
let hasBeenSaved = false;
async function NewProject(project) {
  let CONFIRMDELETE = false;
  if (project && hasBeenSaved) window.api.refreshConfirmed();

  if (project && !hasBeenSaved) {
    CONFIRMDELETE = confirm(`Exit without saving?`);
    if (!CONFIRMDELETE) return;
  }
}

async function SaveProject(project, existingPath = null, backup = false) {
  let startInDirectory = await window.api.getSavesFolderPath();
  const map_name_label = document.getElementById("map_name_label");
  
  let jString = project.exportJSON({asString:true,precision:100});


  console.log(currentZoomLevel, "Zoom level before saving");
  const myProjectVars = {
    //*******add this to jstring as a seperate object, so on load we can load this variable as well?
    ZOOMLEVEL: currentZoomLevel,
  };
  const combinedData = {
    paperData: JSON.parse(jString),
    myProjectData: myProjectVars,
  };

  let combinedString = JSON.stringify(combinedData);

  let originalFileName;
  let filePath = existingPath; // Store the chosen file path

  if (!existingPath) {
    // Show the save dialog (use the exposed API)
    const result = await window.api.showSaveDialog(
      startInDirectory,
      map_name_label.textContent
    );

    if (!result.canceled) {
      hasBeenSaved = true;
      filePath = result.filePath;
      originalFileName = await window.api.getStrippedFileName(filePath);
    } else {
      return; // User canceled the dialog
    }
  } else {
    // Extract filename without extension from existing path(windows style)
    originalFileName = await window.api.getStrippedFileName(filePath);
    //filePath.split("\\").pop().split(".").shift();
  }

  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const autosaveFileName = `${
    originalFileName || map_name_label.textContent
  }(autosave)_${timestamp}.DMAP`;
  console.log(autosaveFileName, "AUTOSAVEFILENAME");
  const autosaveFilePath = window.api.pathJoin(
    await window.api.getBackupsFolderPath(),
    autosaveFileName
  );

  try {
    await window.api.saveProject(autosaveFilePath, combinedString);
  } catch (err) {
    console.log("Error autosaving project:", err);
  }

  if (!existingPath) {
    // Set up the interval for subsequent autosaves
    autosaveInterval = setInterval(
      async () => await SaveProject(project, filePath),
      60000
    );

    map_name_label.textContent = originalFileName;

    try {
      await window.api.saveProject(filePath, combinedString); // Save the initial file
    } catch (err) {
      console.log("Error saving project:", err);
    }
  }
}

function stopAutosaving() {
  clearInterval(autosaveInterval);
  autosaveInterval = null;
}
//
async function LoadProject(project) {
  stopAutosaving();

  const startInDirectory = await window.api.getSavesFolderPath();
  const result = await window.api.showOpenDialog(startInDirectory);

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];

    // Read file contents using IPC
    const contents = await window.api.readFile(filePath);

    if (contents) {
      const combinedData = JSON.parse(contents);
      const paperData = combinedData.paperData;
      const myProjectData = combinedData.myProjectData;
      project.clear();
      project.importJSON(paperData);
      if (myProjectData) {
        console.log(myProjectData.ZOOMLEVEL, "Zoom on load JSON");
        currentZoomLevel = myProjectData.ZOOMLEVEL;
        OnProjectLoad();
      }

      const map_name_label = document.getElementById("map_name_label");
      const fileName = await window.api.getStrippedFileName(filePath);
      map_name_label.textContent = fileName;
      //*****retrieve projectvars and assign back to currentZoomLevel

      // Set autosave interval
      autosaveInterval = setInterval(
        async () => await SaveProject(project, filePath),
        60000
      );
    } else {
      // Handle the error (e.g., show a dialog to the user)
      console.error("Failed to load project file.");
    }
  }
}

let projectSnapshots = [];
let undoneChanges = [];
function TakeSnapshot(project) {
  if (projectSnapshots.length > 50) {
    projectSnapshots.shift();
  }
  console.log("SNAP");
 
  let jString = project.exportJSON({asString:true,precision:100});
  const myProjectVars = {
    ZOOMLEVEL: currentZoomLevel,
  };
  const combinedData = {
    paperData: JSON.parse(jString),
    myProjectData: myProjectVars,
  };

  let combinedString = JSON.stringify(combinedData);

  projectSnapshots.push(combinedString);
}
function Undo(project) {
  if (projectSnapshots.length > 0) {
    console.log(projectSnapshots.length);

    console.log("Undo");
    project.clear();
    let lastSnapshot = projectSnapshots.pop();

    const combinedData = JSON.parse(lastSnapshot);
    const paperData = combinedData.paperData;
    const myProjectData = combinedData.myProjectData;
    project.clear();
    project.importJSON(paperData);
    if (myProjectData) {
      currentZoomLevel = myProjectData.ZOOMLEVEL;
      OnProjectLoad();
    }
  } else {
    console.log("No undo history available");
  }
  function Redo() {
    //Add this
  }
}
