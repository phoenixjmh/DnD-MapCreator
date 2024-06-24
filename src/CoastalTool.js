var CoastalTool = (function () {
  const DEBUG = false;

  let coast_path;
  let mapLayer;

  let lineMode; //bool
  let selectedPaths = [];

  function onMouseDown(event) {
    if (event.event.which === 1) {
      console.log("Coastal down", lineMode ? "LINE" : "FREEDRAW");
      coast_path = new paper.Path(); // Create a new coast_path
      coast_path.strokeColor = "black"; // Set stroke color (optional)
      coast_path.strokeWidth = 1;
      coast_path.add(event.point); // Add the first point
    }
  }

  function onMouseDrag(event) {
    if (event.event.which == 1 && coast_path) {
      if (lineMode) {
        if (coast_path._segments.length > 1) {
          coast_path.strokeColor = "black";
          coast_path._segments.pop();
          coast_path.add(event.point);
        } else {
          coast_path.add(event.point);
        }
      } else {
        if (coast_path) {
          coast_path.add(event.point);
        }
      }
    }
  }
  function onMouseUp(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (lineMode) {
      const isDotLabel = false;
      let path = coast_path;
      let PathObject = {
        path,
        mapLayer,
        isDotLabel,
      };
      AddPathObject(PathObject);
    } else {
      let path = coast_path;
      if (simplify_checkbox.checked) path.simplify();

      let isDotLabel = false;
      let PathObject = {
        path,
        mapLayer,
        isDotLabel,
      };
      AddPathObject(PathObject);
    }
    TakeSnapshot(paper.project);
  }
  function setMapLayer(layer) {
    mapLayer = layer;
  }
  //line or freedraw
  function SetDrawMode(val) {
    if (val == "LINE") {
      lineMode = true;
    }
    if (val == "FREEDRAW") {
      lineMode = false;
    }
  }

  /////////////////////
  //    MANIPULATION
  ////////////////////

  function printPath(path) {
    console.log("\n----------------------\n");
    path._segments.forEach((val, idx) => {
      const xCoord = val._point._x;
      const yCoord = val._point._y;
      let msg = `${idx}{${xCoord},${yCoord}}\n`;
      console.log(msg);
    });

    console.log("\n----------------------\n");
  }

  // function SetPaths(pathArray){
  //   selectedPaths=pathArray;
  //   console.log(selectedPaths);
  // }

  function Subdivide() {
    let selectedPaths = getSelectedPaths();
    for (let selectedPath of selectedPaths) {
      var newPoints = [];

      for (var i = 0; i < selectedPath.segments.length - 1; i++) {
        var point1 = selectedPath.segments[i].point;
        var point2 = selectedPath.segments[i + 1].point;

        var midPoint = point1.add(point2).divide(2);

        // Add the current point and the midpoint to the new points array
        newPoints.push(point1, midPoint);
      }

      // Add the last point to the new points array
      newPoints.push(selectedPath.lastSegment.point);

      // Replace the selectedPath's points with the new points
      selectedPath.removeSegments();
      selectedPath.addSegments(newPoints);
      // selectedPath.selected = DEBUG;
      // printPath(selectedPath);
    }
  }

  function AddNoise(noiseIntensity) {
    DEBUG_CLEAR_CIRCLES();
    let selectedPaths = getSelectedPaths();
    for (let selectedPath of selectedPaths) {
      const originalPoints = selectedPath.segments.map((seg) =>
        seg.point.clone()
      );
      const pathLength = selectedPath.length;

      for (let index = 1; index < selectedPath.segments.length - 1; index++) {
        // Start from 1, end before last
        const currentSegment = selectedPath.segments[index];
        const prevPoint = selectedPath.segments[index - 1].point;
        const nextPoint = selectedPath.segments[index + 1].point;

        // Calculate a perpendicular vector
        const tangent = nextPoint.subtract(prevPoint).normalize();
        let perpendicular = new paper.Point(-tangent.y, tangent.x);
        // if (Math.random() < 0.5) {

        //   console.log(`Move inward:${perpendicular}`);
        //        perpendicular.y=-perpendicular.y;
        //   console.log(`After negation: ${perpendicular}`);
        // }
        // Scale the perpendicular vector for noise
        const noiseOffset = perpendicular.multiply(
          (Math.random() - 0.5) * noiseIntensity
          // *
          // (currentSegment.location.offset / pathLength)
        );

        // Add the noise but check for potential self-intersections
        const newPoint = currentSegment.point.add(noiseOffset);
        // DEBUG_DRAW_CIRCLE(5, newPoint.x, newPoint.y);

        // Basic self-intersection check:
        if (
          !selectedPath.contains(newPoint) ||
          selectedPath.getNearestPoint(newPoint).getDistance(newPoint) >
            noiseIntensity / 2
        ) {
          currentSegment.point = newPoint;
        } else {
          // If intersection is likely, revert to the original point
          currentSegment.point = originalPoints[index];
        }
      }
    }
  }

  function CleanIntersections() {
    let selectedPaths = getSelectedPaths();

    for (let selectedPath of selectedPaths) {
      let intersections = selectedPath.getIntersections(selectedPath);
      intersections.forEach((intersection) => {
        selectedPath.splitAt(intersection);
      });
    }
  }

  return {
    onMouseDown: onMouseDown,
    onMouseDrag: onMouseDrag,
    onMouseUp: onMouseUp,
    setMapLayer: setMapLayer,
    Subdivide: Subdivide,
    AddNoise: AddNoise,
    SetDrawMode: SetDrawMode,
    CleanIntersections: CleanIntersections,
  };
})();
export { CoastalTool };
