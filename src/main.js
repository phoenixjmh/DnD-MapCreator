import { HelpPanel } from "./HelpPanel.js";
import { LineTool } from "./Tools/LineTool.js";
import { FreeDrawTool } from "./Tools/FreeDrawTool.js";
import { CoastalTool } from "./Tools/CoastalTool.js";
import { SelectionTool } from "./Tools/SelectionTool.js";
import { DotLabelTool } from "./Tools/DotLabelTool.js";
import { PolygonalTool } from "./Tools/PolygonalLineTool.js";
import { TextTool } from "./Tools/TextTool.js";
import { FillTool } from "./Tools/FillTool.js";
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

stroke_width_slider.addEventListener("input", function () {
  LineTool.setBrushSize(stroke_width_slider.value);
});

close_path_button.onclick = (e) => {
  let paths = getSelectedPaths();
  if (paths) {
    paths.forEach((path) => path.closePath());
    console.log("Closing path");
  }
};

///////////////////////////
//    TOOLS HANDLER
// ///////////////////////

let CreateAndAssignTools = (function () {
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

  Tools_Fill.onMouseDown = FillTool.onMouseDown;

  Viewport.Init();
  HelpPanel.Init();

  ///////////////////////
  //  ASSIGN BUTTONS
  //////////////////////

  let polygonal_tool_button = document.querySelector("#polygonal-tool-button");
  polygonal_tool_button.onclick = (e) => {
    // PolygonalTool.OnActivate();
    ToolActivationHandler(PolygonalTool, polygonal_tool_button);
    Tools_Polygonal.activate();
  };

  let line_tool_button = document.querySelector("#line_tool_button");
  line_tool_button.onclick = (e) => {
    // LineTool.OnActivate();
    ToolActivationHandler(LineTool, line_tool_button);
    Tools_Line.activate();
  };

  let freedraw_tool_button = document.querySelector("#freedraw_tool_button");
  freedraw_tool_button.onclick = (e) => {
    // FreeDrawTool.OnActivate();
    ToolActivationHandler(FreeDrawTool, freedraw_tool_button);
    Tools_FreeDraw.activate();
  };

  let coastal_tool_button = document.querySelector("#coastal_tool_button");
  coastal_tool_button.onclick = (e) => {
    ToolActivationHandler(CoastalTool, coastal_tool_button);
  };

  let dotlabel_tool_button = document.querySelector("#dotlabel_tool_button");
  dotlabel_tool_button.onclick = (e) => {
    // DotLabelTool.OnActivate();
    ToolActivationHandler(DotLabelTool, dotlabel_tool_button);
    Tools_DotLabel.activate();
  };

  let text_tool_button = document.querySelector("#text_tool_button");
  text_tool_button.onclick = (e) => {
    Tools_AddLabels.activate();
    ToolActivationHandler(TextTool, text_tool_button);
    // TextTool.OnActivate();
  };

  let fill_tool_button = document.querySelector("#fill_tool_button");
  fill_tool_button.onclick = (e) => {
    Tools_Fill.activate();
    // FillTool.OnActivate();
    ToolActivationHandler(FillTool, fill_tool_button);
  };

  let selection_tool_button = document.querySelector("#selection_tool_button");
  selection_tool_button.onclick = function () {
    Tools_Selection.activate();
    // SelectionTool.OnActivate();
    ToolActivationHandler(SelectionTool, selection_tool_button);
  };
  let ALL_TOOLS = [
    PolygonalTool,
    LineTool,
    FreeDrawTool,
    CoastalTool,
    SelectionTool,
    DotLabelTool,
    TextTool,
    FillTool,
  ];
  let ALL_BUTTONS = [
    polygonal_tool_button,
    line_tool_button,
    freedraw_tool_button,
    coastal_tool_button,
    selection_tool_button,
    dotlabel_tool_button,
    text_tool_button,
    fill_tool_button,
  ];

  var RegisterToolButtons = (function () {
    for (let i = 0; i < ALL_TOOLS.length; i++) {
      ALL_TOOLS[i].Register(ALL_BUTTONS[i]);
    }
  })();
  function ToolActivationHandler(activeTool, button) {
    properties_panel.innerHTML = "";
    activeTool.OnActivate(button);
    ALL_TOOLS.forEach((tool) => {
      if (tool !== activeTool) {
        tool.OnDeactivate();
      }
    });
  }
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

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    event.preventDefault(); // Prevent default browser undo behavior
    Undo(paper.project);
  }
});

var OnAwake = (function () {
  // MapLayerHandler(currentZoomLevel);
  TakeSnapshot(paper.project);
  console.log("Sup electron daddy");
  paper.view.draw();
})();
