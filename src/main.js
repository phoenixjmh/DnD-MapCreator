import { LineTool } from "./LineTool.js";
import { FreeDrawTool } from "./FreeDrawTool.js";
import { CoastalTool } from "./CoastalTool.js";
import { SelectionTool } from "./SelectionTool.js";
import { DotLabelTool } from "./DotLabelTool.js";








window.api.onNewProject(()=>{
    console.log("NEW HELLO!");
    NewProject(paper.project);
});
window.api.onSaveProject(()=>{
    SaveProject(paper.project);
});

window.api.onLoadProject(()=>{
    LoadProject(paper.project);
});

//******************************* */
//      ZOOM CONTROLS
//******************************* */


let currentZoomLevel = 0;
let zoom_level_display = document.getElementById("zoom_level_display");
zoom_level_display.textContent = "Zoom Level:";

canvas.addEventListener("wheel", function(event) {
    event.preventDefault();
    let zoomFactor = 1 - event.deltaY / 1000;

    //cap zoom in
    if (currentZoomLevel == 100 && zoomFactor > 1) {
        return;
    }
    if (zoomFactor > 1) {
        currentZoomLevel += 1;
        zoomFactor = 1.1;
    } else if (zoomFactor < 1) {
        zoomFactor = 0.9;
        currentZoomLevel -= 1;
    }
    // MapLayerHandler(currentZoomLevel);

    zoom_level_display.textContent = currentZoomLevel;

    const viewPos = paper.view.center;
    const scalingFactor = new paper.Point(zoomFactor, zoomFactor);

    paper.project.activeLayer.scale(scalingFactor, viewPos); // Scale

    paper.view.update();
});

//////////////////////////////

//  PAN AND SCAN

/////////////////////////////
let lastPoint = null;

// Listen for mousedown event
paper.view.onMouseDown = function(event) {
    if (event.event.which === 2) {
        // Middle mouse button
        lastPoint = new paper.Point(event.point);
    }
};

// Listen for mousemove event
paper.view.onMouseDrag = function(event) {
    if (lastPoint) {
        const delta = lastPoint.subtract(event.point);
        paper.view.scrollBy(delta);
        lastPoint = event.point.add(delta);
    }
};

// Listen for mouseup event
paper.view.onMouseUp = function(event) {
    lastPoint = null;
};

function MapLayerHandler(zoom_level) {
    //testing purposes, brute force set the map layer to all tools
    LineTool.setMapLayer(zoom_level);
    FreeDrawTool.setMapLayer(zoom_level);
    DotLabelTool.setMapLayer(zoom_level);
    AllPathObjects.forEach((val) => {
        let { path, mapLayer, isDotLabel } = val;
        if (mapLayer - currentZoomLevel > 30 || currentZoomLevel - mapLayer > 30) {
            path.visible = false;
            console.log("Zoom out of scope");
        } else {
            path.visible = true;
        }
    });
}

let stroke_width_slider = document.getElementById("stroke-width-slider");

stroke_width_slider.addEventListener("input", function() {
    LineTool.setBrushSize(stroke_width_slider.value);
});

let CreateAndAssignTools = (function() {
    var Tools_Selection = new paper.Tool();

    var Tools_Coastal = new paper.Tool();

    var Tools_FreeDraw = new paper.Tool();

    var Tools_Line = new paper.Tool();

    var Tools_DotLabel = new paper.Tool();

    Tools_Selection.onMouseDown = SelectionTool.onMouseDown;
    Tools_Selection.onMouseDrag = SelectionTool.onMouseDrag;
    Tools_Selection.onMouseUp = SelectionTool.onMouseUp;

    Tools_Line.onMouseDown = LineTool.onMouseDown;
    Tools_Line.onMouseDrag = LineTool.onMouseDrag;
    Tools_Line.onMouseUp = LineTool.onMouseUp;

    Tools_FreeDraw.onMouseUp = FreeDrawTool.onMouseUp;
    Tools_FreeDraw.onMouseDown = FreeDrawTool.onMouseDown;
    Tools_FreeDraw.onMouseDrag = FreeDrawTool.onMouseDrag;

    Tools_Coastal.onMouseDown = CoastalTool.onMouseDown;
    Tools_Coastal.onMouseDrag = CoastalTool.onMouseDrag;
    Tools_Coastal.onMouseUp = CoastalTool.onMouseUp;

    Tools_DotLabel.onMouseDown = DotLabelTool.onMouseDown;
    Tools_DotLabel.onMouseUp = DotLabelTool.onMouseUp;

    let selection_tool_button = document.querySelector("#selection_tool_button");
    selection_tool_button.onclick = function() {
        Tools_Selection.activate();

    };

    function SelectCoastlineTool() {
        Tools_Coastal.activate();

        /////////////////////////
        //  CREATE DIVISION BAR
        ////////////////////////

        let tool_properties_panel = document.querySelector(".tool-info");
        tool_properties_panel.innerHTML = ""; // Clear existing content

        const subdivideButton = Object.assign(document.createElement("button"), {
            id: "subdivide-button",
            textContent: "Subdivide",
        });

        tool_properties_panel.append(subdivideButton);
        subdivideButton.onclick = (e) => {
            let success = CoastalTool.Subdivide();
            if (success === -1) {
                alert("No line selected to modify");
            }
        };

        const NoiseLabel = Object.assign(document.createElement("label"), {
            textContent: "Noise:0",
            for: "noise-slider", // Associate label with input
        });

        const NoiseSlider = Object.assign(document.createElement("input"), {
            type: "range",
            min: 0,
            max: 100,
            step: 1,
            value: 1,
            id: "noise-slider",
        });

        const AddNoiseButton = Object.assign(document.createElement("button"), {
            textContent: "Add Noise",
            id: "add-noise-button",
        });
        AddNoiseButton.onclick = (e) => {
            let noiseIntensity = NoiseSlider.value;
            let success = CoastalTool.AddNoise(noiseIntensity);
            if (success === -1) {
                alert("No line selected to modify");
                NoiseSlider.value = 0;
                NoiseLabel.textContent = `Noise ${NoiseSlider.value}`;
            }
        };

        tool_properties_panel.append(NoiseLabel, NoiseSlider, AddNoiseButton);

        NoiseSlider.addEventListener("input", (e) => {
            NoiseLabel.textContent = `Noise ${e.target.value}`;
        });

        CoastalTool.SetDrawMode("FREEDRAW");

        const clean_intersection_button = Object.assign(
            document.createElement("button"),
            {
                id: "clean_intersection_button",
                textContent: "Clean Intersections",
            }
        );

        clean_intersection_button.onclick = (e) => {
            e.preventDefault();
            CoastalTool.CleanIntersections();
        };

        tool_info_panel.append(
            simplify_checkbox_label,
            simplify_checkbox,
            clean_intersection_button
        );
    }

    ///////////////////////
    //  ASSIGN BUTTONS
    //////////////////////

    let line_tool_button = document.querySelector("#line_tool_button");
    line_tool_button.onclick = (e) => Tools_Line.activate();

    let freedraw_tool_button = document.querySelector("#freedraw_tool_button");
    freedraw_tool_button.onclick = (e) => Tools_FreeDraw.activate();

    let coastline_tool_button = document.querySelector("#coastal_tool_button");
    coastline_tool_button.onclick = (e) => SelectCoastlineTool();

    let dotlabel_tool_button = document.querySelector("#dotlabel_tool_button");
    dotlabel_tool_button.onclick = (e) => Tools_DotLabel.activate();
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

//*******************************
//  EXPORT PNG OPTION
//*******************************

//for first run
// MapLayerHandler(currentZoomLevel);
TakeSnapshot(paper.project);
console.log("Sup electron");
paper.view.draw();
