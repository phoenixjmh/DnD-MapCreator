# DND_MAP_CREATOR


* **Autosave:** The project won't autosave until a save file is created. Afterward, it autosaves every 60 seconds. This helps prevent data loss.
* **AutoSave Location:** AutoSaves are stored in the `Saves/Backups` folder.
* **Map Layers:** Map layers are a work in progress and currently disabled for testing.
* **Undo:** Be careful with excessive undo usage, as it might break the undo history. Loading an old document may also affect it.



## Navigation & General Usage




* **Panning:** Mouse wheel click and drag to pan the view.
* **Scrolling:** Use the mouse wheel to scroll.
* **Snapshots & Undo:** Snapshots are created on mouse up, enabling undo with Ctrl+Z (or Cmd+Z on macOS). Undo history is set to 20 by default.



## Tools & Features




* **Freedraw Tool:** Has a brush width slider (currently non-functional due to infinite zoom).
* **Simplify Lines:** Enabled by default, reduces points and simplifies lines. Might lead to slightly unexpected results, but it's good for coastal lines.
* **Selection Tool:**
    * Hold Shift for rectangular selection.
    * Drag to move selected points.
    * Delete key to delete paths.
    * Shift-click on empty space to deselect all.
* **Delete Confirmation:** Prompts for confirmation when deleting more than 5 points.
* **Coastal Tool:** Allows subdividing and displacing the entire path containing selected points.
* **Path Resolution:** Deleting a large internal section of a coastline that intersects itself should automatically reconnect the path.

