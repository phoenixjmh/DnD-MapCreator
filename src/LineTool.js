var LineTool = (function () {
  let brushSize;
  let path;
  let mapLayer;

  function setBrushSize(val) {
    brushSize = val;
  }
  function onMouseDown(event) {
    if (event.event.which === 1) {
      console.log("Line down");
      path = new paper.Path(); // Create a new line_path
      path.strokeColor = "black"; // Set stroke color (optional)
      path.strokeWidth = brushSize;
      path.add(event.point); // Add the first point
    }
  }

  function onMouseDrag(event) {
    if (event.event.which == 1 && path) {
      if (path._segments.length > 1) {
        path.strokeColor = "black";
        path._segments.pop();
        path.add(event.point);
      } else {
        path.add(event.point);
      }
    }
  }
  function onMouseUp(event) {
    if (event.event.which !== 0) {
      return;
    }
    
    let PathObject = {
      path,
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
