var PolygonalTool = (function () {
  var path;
  let firstPoint = true;
  let isDrawing = false;
  function onMouseDown(event) {
    if (event.event.which == 1) {
      if (firstPoint) {
        console.log("PolygonDown");
        path = new paper.Path();
        path.strokeColor = "black";
        firstPoint = false;
      } else {
        path.add(event.point);
      }

      isDrawing = true;
    }
    //close loop on right click
    if (event.event.which == 3) {
      isDrawing = false;
      firstPoint = true;
    }
  }

  function onMouseMove(event) {
    if (!isDrawing) return;
    if (!path) return;

    if (path._segments.length > 1) {
      path._segments.pop();
      path.add(event.point);
    } else {
      path.add(event.point);
    }
  }

  function setMapLayer(layer) {
    mapLayer = layer;
  }
  function OnActivate() {
    console.log("POLYGON ACTIVATED");
  }

  function OnDeactivate() {
    console.log("POLYGON DEACTIVATED");
  }
  return {
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    setMapLayer: setMapLayer,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
  };
})();
export { PolygonalTool };
