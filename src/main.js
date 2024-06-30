import { LineTool } from "./LineTool.js";
import { FreeDrawTool } from "./FreeDrawTool.js";
import { CoastalTool } from "./CoastalTool.js";
import { SelectionTool } from "./SelectionTool.js";
import { DotLabelTool } from "./DotLabelTool.js";
import { PolygonalTool } from "./PolygonalLineTool.js";
import { TextTool } from "./TextTool.js";
import { Viewport } from "./ZoomLayers.js";

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

//******************************* */
//      ZOOM CONTROLS
//******************************* */

let stroke_width_slider = document.getElementById("stroke-width-slider");

stroke_width_slider.addEventListener("input", function() {
    LineTool.setBrushSize(stroke_width_slider.value);
});

let CreateAndAssignTools = (function() {
    var Tools_Polygonal = new paper.Tool();

    var Tools_Selection = new paper.Tool();

    var Tools_FreeDraw = new paper.Tool();

    var Tools_Line = new paper.Tool();

    var Tools_DotLabel = new paper.Tool();

    var Tools_AddLabels = new paper.Tool();

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

    let selection_tool_button = document.querySelector("#selection_tool_button");
    selection_tool_button.onclick = function() {
        Tools_Selection.activate();
    };
    Viewport.Init();

    function SelectAddLabelTool() {
        Tools_AddLabels.activate();
        let tool_properties_panel = document.querySelector(".tool-info");
        tool_properties_panel.innerHTML = `
  <div id="font-controls">
    <label for="font-size">Font Size:</label>
    <input type="number" id="font-size" value="12" min="10" max="100">
  </div>
`;
        
        let font_size_input = document.querySelector("#font-size");
        font_size_input.onclick = (e) => {
            e.preventDefault();
            let fs = e.target.value + "px";
            TextTool.ChangeFontSize(fs);
        };
    }

    function SelectCoastlineTool() {
        const toolPropertiesPanel = document.querySelector(".tool-info");
        toolPropertiesPanel.innerHTML='';

        const fractalizeControls = document.createElement("div");
        fractalizeControls.id = "fractalize_controls";
        let checkbox_label=Object.assign(document.createElement("label"),{
            for:"fractalize_automated_checkbox",
            textContent:"Automated"
        });

        let automatedCheckbox = Object.assign(document.createElement("input"), {
            type: "checkbox",
            id: "fractalize_automated_checkbox",
            onchange: (e) => {
                let isChecked=automatedCheckbox.checked; 
                if (!isChecked) {
                    fractalizeControls.innerHTML='';
                    let strengthValueLabel = Object.assign(document.createElement("label"), {
                        for: "fractalize_intensity_slider",
                        textContent: "Strength:",
                    });
                    let intensitySlider = Object.assign(document.createElement("input"), {
                        type: "range",
                        min: "0.1",
                        max: "70",
                        step: "1",
                        id: "fractalize_intensity_slider",
                        value: "1",
                        oninput: (e) => {
                            strengthValueLabel.textContent = e.target.value;
                        }
                    })
                    let fractalize_button = Object.assign(document.createElement("button"), {
                        id: "fractalize_button",
                        textContent: "Fractalize",
                        onclick: (e) => {
                            e.preventDefault();
                            CoastalTool.Fractalize(false, intensitySlider.value);
                        }
                    });
                    fractalizeControls.append(strengthValueLabel, intensitySlider, fractalize_button);
                }
                else {
                    fractalizeControls.innerHTML = '';
                    let fractalize_button = Object.assign(document.createElement("button"), {
                        id: "fractalize_button",
                        textContent: "Fractalize",
                        onclick: (e) => {
                            e.preventDefault();
                            CoastalTool.Fractalize(true, 0);
                        }
                    });
                    fractalizeControls.append(fractalize_button)
                }


            }
        })



        automatedCheckbox.dispatchEvent(new Event('change'));
        toolPropertiesPanel.append(checkbox_label,automatedCheckbox,fractalizeControls);
        tool_info_panel.append(simplify_checkbox_label, simplify_checkbox);
    }

    ///////////////////////
    //  ASSIGN BUTTONS
    //////////////////////

    let polygonal_tool_button = document.querySelector("#polygonal-tool-button");
    polygonal_tool_button.onclick = (e) => Tools_Polygonal.activate();

    let line_tool_button = document.querySelector("#line_tool_button");
    line_tool_button.onclick = (e) => Tools_Line.activate();

    let freedraw_tool_button = document.querySelector("#freedraw_tool_button");
    freedraw_tool_button.onclick = (e) => Tools_FreeDraw.activate();

    let coastline_tool_button = document.querySelector("#coastal_tool_button");
    coastline_tool_button.onclick = (e) => SelectCoastlineTool();

    let dotlabel_tool_button = document.querySelector("#dotlabel_tool_button");
    dotlabel_tool_button.onclick = (e) => Tools_DotLabel.activate();

    let text_tool_button = document.querySelector("#text_tool_button");
    text_tool_button.onclick = (e) => SelectAddLabelTool();
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
