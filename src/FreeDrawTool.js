
var FreeDrawTool = (function () {
  var path;
  let stroke_width_slider = document.getElementById("stroke-width-slider");
  let mapLayer;

  let brushSize = stroke_width_slider.value;
  function onMouseDown(event) {
    if (event.event.which !== 1) {
      return;
    }
    console.log("FreeDrawDown");
    path = new paper.Path(); // Create a new path
    path.strokeColor = "black"; // Set stroke color (optional)
    path.strokeWidth = brushSize;
    path.add(event.point); // Add the first point
  }

  function onMouseDrag(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (path) {
      path.add(event.point); // Add points as you drag
    }
  }
  function onMouseUp(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (simplify_checkbox.checked) {
      path.simplify();
    }

    let isDotLabel = false;
    let PathObject = {
      path,
      mapLayer,
      isDotLabel,
    };
    AddPathObject(PathObject);
    TakeSnapshot(paper.project);
  }
  function setMapLayer(layer) {
    mapLayer = layer;
  }

  return {
    onMouseUp: onMouseUp,
    onMouseDown: onMouseDown,
    onMouseDrag: onMouseDrag,
    setMapLayer: setMapLayer,
  };
})();
export {FreeDrawTool};