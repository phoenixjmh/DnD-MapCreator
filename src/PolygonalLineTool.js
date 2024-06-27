

var PolygonalTool = (function() {
    var path;
    let firstPoint = true;
    let isDrawing = false;
    function onMouseDown(event) {
        if (event.event.which == 1) {

            if (firstPoint) {

                console.log("PolygonDown");
                path = new paper.Path(); // Create a new path
                path.strokeColor = "black"; // Set stroke color (optional)
                //path.add(event.point); // Add the first point
                firstPoint = false;
            }
            else {
                //path._segments.pop();
                path.add(event.point);
                console.log("Clig");
            }

            isDrawing = true;
        }
        if (event.event.which == 3) {
            isDrawing = false;
            console.log(`Created polygon with ${path._segments.length} points `);
            firstPoint=true;
        }
    }

    function onMouseMove(event) {
        if (!isDrawing)
            return;
        if (!path)
            return;

        if (path._segments.length > 1) {
            path._segments.pop();
            path.add(event.point);
        }
        else {
            path.add(event.point);
        }

    }
    //   function onMouseDrag(event) {
    //       if (event.event.which !== 1) {
    //           return;
    //       }
    //       if (path) {
    //           path.add(event.point); // Add points as you drag
    //       }
    //   }
    //   function onMouseUp(event) {
    //       if (event.event.which !== 1) {
    //           return;
    //       }
    //       if (simplify_checkbox.checked) {
    //           path.simplify();
    //       }

    //       let isDotLabel = false;
    //       let PathObject = {
    //           path,
    //           mapLayer,
    //           isDotLabel,
    //       };
    //       AddPathObject(PathObject);
    //       TakeSnapshot(paper.project);
    //   }
    function setMapLayer(layer) {
        mapLayer = layer;
    }

    return {
        onMouseDown: onMouseDown,
        onMouseMove: onMouseMove,
        setMapLayer: setMapLayer,
    };
})();
export { PolygonalTool };
