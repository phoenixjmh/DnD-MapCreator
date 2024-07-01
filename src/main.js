import { HelpPanel } from "./HelpPanel.js"
import { LineTool } from "./LineTool.js";
import { FreeDrawTool } from "./FreeDrawTool.js";
import { CoastalTool } from "./CoastalTool.js";
import { SelectionTool } from "./SelectionTool.js";
import { DotLabelTool } from "./DotLabelTool.js";
import { PolygonalTool } from "./PolygonalLineTool.js";
import { TextTool } from "./TextTool.js";
import {FillTool} from "./FillTool.js"
import { Viewport } from "./Viewport.js";


window.api.onNewProject(() => {
    console.log("NEW HELLO!");
    NewProject(paper.project);
});
window.api.onSaveProject(() => {
    SaveProject(paper.project);
});

window.api.onLoadProject(() => {
    LoadProject(paper.project);
});

////////////////////////////////////
//      PERSISTENT TOOLS CONTROLS
////////////////////////////////////

let stroke_width_slider = document.getElementById("stroke-width-slider");

stroke_width_slider.addEventListener("input", function() {
    LineTool.setBrushSize(stroke_width_slider.value);
});

close_path_button.onclick=(e)=>{
    let paths=getSelectedPaths();
    if(paths){
    paths.forEach(path=>path.closePath())
    console.log("Closing path");
}
}

let CreateAndAssignTools = (function() {
    var Tools_Polygonal = new paper.Tool();

    var Tools_Selection = new paper.Tool();

    var Tools_FreeDraw = new paper.Tool();

    var Tools_Line = new paper.Tool();

    var Tools_DotLabel = new paper.Tool();

    var Tools_AddLabels = new paper.Tool();

    var Tools_Fill = new paper.Tool();

    Tools_Polygonal.onMouseMove = PolygonalTool.onMouseMove;
    Tools_Polygonal.onMouseDown = PolygonalTool.onMouseDown;

    Tools_Selection.onMouseDown = SelectionTool.onMouseDown;
    Tools_Selection.onDoubleClick = SelectionTool.onDoubleClick;
    Tools_Selection.onMouseDrag = SelectionTool.onMouseDrag;
    Tools_Selection.onMouseUp = SelectionTool.onMouseUp;

    Tools_Line.onMouseDown = LineTool.onMouseDown;
    Tools_Line.onMouseDrag = LineTool.onMouseDrag;
    Tools_Line.onMouseUp = LineTool.onMouseUp;

    Tools_FreeDraw.onMouseUp = FreeDrawTool.onMouseUp;
    Tools_FreeDraw.onMouseDown = FreeDrawTool.onMouseDown;
    Tools_FreeDraw.onMouseDrag = FreeDrawTool.onMouseDrag;

    Tools_DotLabel.onMouseDown = DotLabelTool.onMouseDown;
    Tools_DotLabel.onMouseUp = DotLabelTool.onMouseUp;

    Tools_AddLabels.onMouseDown = TextTool.onMouseDown;

    Tools_Fill.onMouseDown=FillTool.onMouseDown;



    Viewport.Init();
    HelpPanel.Init();


    ///////////////////////
    //  ASSIGN BUTTONS
    //////////////////////
    //
    //What we want here, is for there to be a running variable that tracks what the active tool is.
    //The corresponding button can be a different color, and other tools can clear their panel.

    let polygonal_tool_button = document.querySelector("#polygonal-tool-button");
    polygonal_tool_button.onclick = (e) => Tools_Polygonal.activate();

    let line_tool_button = document.querySelector("#line_tool_button");
    line_tool_button.onclick = (e) => Tools_Line.activate();

    let freedraw_tool_button = document.querySelector("#freedraw_tool_button");
    freedraw_tool_button.onclick = (e) => Tools_FreeDraw.activate();

    let coastline_tool_button = document.querySelector("#coastal_tool_button");
    coastline_tool_button.onclick = (e) => CoastalTool.OnActivate();

    let dotlabel_tool_button = document.querySelector("#dotlabel_tool_button");
    dotlabel_tool_button.onclick = (e) => Tools_DotLabel.activate();

    let text_tool_button = document.querySelector("#text_tool_button");
    text_tool_button.onclick = (e) => {

        Tools_AddLabels.activate();
        TextTool.OnActivate();
    }

    let fill_tool_button=document.querySelector('#fill_tool_button');
    fill_tool_button.onclick=(e)=>{
        Tools_Fill.activate();
        FillTool.OnActivate();
    }

    let selection_tool_button = document.querySelector("#selection_tool_button");
    selection_tool_button.onclick = function() {
        Tools_Selection.activate();
    };
})();

//////////////////// .
//  KEY LISTENERS
////////////////////

document.addEventListener("keydown", (event) => {
    if (event.key === "Delete") {
        console.log("DELETE KEY PRESSED");
        SelectionTool.deleteSelectedPoints();
        event.preventDefault(); // Prevent default browser behavior
    }
});

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "z") {
        event.preventDefault(); // Prevent default browser undo behavior
        Undo(paper.project);
    }
});




var OnAwake = (function() {
    // MapLayerHandler(currentZoomLevel);
    TakeSnapshot(paper.project);
    console.log("Sup electron");
    paper.view.draw();
})();

