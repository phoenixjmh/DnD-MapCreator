let autosaveInterval;
async function SaveProject(project, existingHandle = null, backup = false) {
  let startInDirectory = await window.api.getSavesFolderPath();
  console.log(startInDirectory)
  const map_name_label = document.getElementById("map_name_label");
  const jString = project.exportJSON();

  let handle = existingHandle;
  let originalFileName; // Variable to store the original filename

  if (!handle) {
    // Initial save - get the filename for future use
    handle = await window.showSaveFilePicker({
      suggestedName: map_name_label.textContent,
      defaultPath:await startInDirectory,
      types: [
        {
          description: "DNDMAP_PROJECT",
          accept: { "application/json": [".DMAP"] },
        },
      ],
    });
  }
  originalFileName = handle.name.split(".").shift();
  console.log(originalFileName);

  const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Format: YYYYMMDDTHHMMSS

  // Create the autosave filename with timestamp
  const autosaveFileName = `${
    originalFileName || map_name_label.textContent
  }(autosave)_${timestamp}.DMAP`;
  console.log("emitting get-path event");
  const autosaveFilePath = window.api.pathJoin(
    await window.api.getSavesFolderPath().concat("\\Backups"),
    autosaveFileName
  );
  console.log(autosaveFileName);

  try {
    await window.api.saveProject(autosaveFilePath, jString); // Use exposed API
    console.log("Autosaved project:", autosaveFileName);
  } catch (err) {
    console.log("Error autosaving project:", err);
  }

  if (!existingHandle) {
    // Set up the interval for subsequent autosaves
    autosaveInterval = setInterval(
      async () => await SaveProject(project, handle),
      60000
    ); // 60 seconds interval
  }

  // If this is the initial save, save the original file too
  if (!existingHandle) {
    const writable = await handle.createWritable();
    await writable.write(jString);
    await writable.close();

    const fileName = handle.name.split(".").shift();
    map_name_label.textContent = fileName;
  }
}
function stopAutosaving() {
  clearInterval(autosaveInterval);
  autosaveInterval = null;
}
//

async function LoadProject(project) {
  stopAutosaving();
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: "DNDMAP_PROJECT",
        accept: { "application/json": [".DMAP"] },
      },
    ],
  });
  setInterval(async () => await SaveProject(project, handle), 6000);
  const file = await handle.getFile();
  const contents = await file.text();
  project.clear();
  project.importJSON(contents);
  //update map title

  const map_name_label = document.getElementById("map_name_label");
  const fileName = file.name.split(".").shift();

  console.log(fileName);
  map_name_label.textContent = fileName;
}

let projectSnapshots = [];
let undoneChanges = [];
function TakeSnapshot(project) {
  if (projectSnapshots.length > 50) {
    projectSnapshots.shift();
    console.log("Undo History Maxed Out");
  }
  console.log("Taking snapshot");

  projectSnapshots.push(JSON.parse(JSON.stringify(project)));
}
function Undo(project) {
  if (projectSnapshots.length > 0) {
    console.log(projectSnapshots.length);

    console.log("Undo");
    project.clear();
    let lastSnapshot = projectSnapshots.pop();
    undoneChanges.push(lastSnapshot);
    project.importJSON(lastSnapshot);
  } else {
    console.log("No undo history available");
  }
  function Redo() {
    //Add this
  }
}
