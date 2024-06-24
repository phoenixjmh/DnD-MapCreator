var LineTool = (function () {
  let brushSize;
  let line_path;
  let mapLayer;
  function setBrushSize(val) {
    brushSize = val;
  }
  function onMouseDown(event) {
    // console.log(event.event.button);
    if (event.event.which === 1) {
      console.log("Line down");
      line_path = new paper.Path(); // Create a new line_path
      line_path.strokeColor = "black"; // Set stroke color (optional)
      line_path.strokeWidth = brushSize;
      console.log(brushSize);
      line_path.add(event.point); // Add the first point
    }
  }

  function onMouseDrag(event) {
    if (event.event.which == 1 && line_path) {
      // console.log("line_drag");
      if (line_path._segments.length > 1) {
        line_path.strokeColor = "black";
        line_path._segments.pop();
        line_path.add(event.point);
      } else {
        line_path.add(event.point);
      }
    }
  }
  function onMouseUp(event) {
    if (event.event.which !== 0) {
      return;
    }
    let PathObject = {
      line_path,
      mapLayer,
    };
    AddPathObject(PathObject);
    TakeSnapshot(paper.project);
  }
  function setMapLayer(layer) {
    mapLayer = layer;
  }

  return {
    onMouseDown: onMouseDown,
    onMouseDrag: onMouseDrag,
    onMouseUp: onMouseUp,
    setBrushSize: setBrushSize,
    setMapLayer: setMapLayer,
  };
})();
export {LineTool};