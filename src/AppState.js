async function SaveProject(project, existingHandle = null, backup = false) {
  const map_name_label = document.getElementById("map_name_label");
  var jString = project.exportJSON();
  let handle = existingHandle;
  if (backup) {
    let backupName = handle.name
      .split(".")
      .shift()
      .concat("(backup)")
      .concat(".DMAP");
    console.log(backupName);
    // handle.name=handle.name.split(".").shift()
  }
  if (!handle) {
    handle = await window.showSaveFilePicker({
      suggestedName: map_name_label.textContent,
      types: [
        {
          description: "DNDMAP_PROJECT",
          accept: { "application/json": [".DMAP"] },
        },
      ],
    });

    setInterval(async () => await SaveProject(project, handle), 6000);
  }
  console.log("Saving Project");
  const writable = await handle.createWritable();
  await writable.write(jString);
  await writable.close();

  const fileName = handle.name.split(".").shift();
  map_name_label.textContent = fileName;
}
async function LoadProject(project) {
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
