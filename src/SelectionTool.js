var SelectionTool = (function () {
  let selectionRectangle;

  function onMouseDown(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (event.modifiers.shift) {
      handleRectangleSelectionStart(event.point);
      console.log("Selection down");
    } else {
      //default to regular moving selection
      selectionRectangle = null;
    }
  }
  function handleRectangleSelectionStart(point) {
    deselectAllPoints();
    selectionRectangle = new paper.Path.Rectangle({
      from: point,
      to: point,
      strokeColor: "blue",
      dashArray: [4, 4],
    });
  }

  function handleRectangleSelectionUpdate(point) {
    // console.log("SELECTION_RECT_UPDATE", selectionRectangle.segments);
    selectionRectangle.segments[1].point.x = point.x; // Top right
    selectionRectangle.segments[2].point = point;
    selectionRectangle.segments[3].point.y = point.y;
  }
  function onMouseDrag(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (selectionRectangle) {
      handleRectangleSelectionUpdate(event.point);
    } else {
      if (GetSelectedSegments()) {
        console.log("SELECTOR::ONMOUSEDOWN::MOVE POINTS");
        moveSelectedPoints(event.delta);
        updateBoundingBoxPositions(event.delta);
      }
    }
  }
  function moveSelectedPoints(delta) {
    GetSelectedSegments().forEach((segment) => {
      segment.point = segment.point.add(delta);
    });
  }
  function onMouseUp(e) {
    if (selectionRectangle) {
      //select points within the rectangle
      selectPointsWithinRectangle();
      console.log(GetSelectedSegments(), "RETRIEVESTYLE");
      selectionRectangle.remove();
      selectionRectangle = null;
    }
    TakeSnapshot(paper.project);
  }
  function selectPointsWithinRectangle() {
    deselectAllPoints();
    let hit = false;
    getAllPaths().forEach((path) => {
      path.selected = false;
      if (path.data.isSelectionBox) {
        console.log("Selection box selected??!!?!");
      }
      path.segments.forEach((segment) => {
        if (selectionRectangle.contains(segment.point)) {
          segment.point.selected = true;
          segment.handleIn.fillColor = "green";
          segment.handleOut.fillColor = "green";
          hit = true;
        }
      });
    });
    if (hit) createSelectionBoundingBox();
    else {
      deselectAllPoints();
    }
  }
  function createSelectionBoundingBox() {
    let selectedPoints = GetSelectedSegments();
    console.log("Creating bounding box");
    // Changed the function name
    if (selectedPoints) {
      let bounds = getBoundsOfPoints();
      let selectionBoundingBox = new paper.Path.Rectangle(bounds);
      selectionBoundingBox.strokeColor = "green";
      selectionBoundingBox.data.isSelectionBox = true;
    }
  }
  function GetAllSelectionBoundingBoxes() {
    let allSelectionBoxes = paper.project.getItems({
      recursive: true,
      match: (item) => item.data && item.data.isSelectionBox,
    });
    return allSelectionBoxes;
  }
  function DestroySelectionBoundingBoxes() {
    console.log("BBS", GetAllSelectionBoundingBoxes());
    GetAllSelectionBoundingBoxes().forEach((rect) => rect.remove());
  }
  function getBoundsOfPoints() {
    let segments=GetSelectedSegments();
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (let i = 0; i < segments.length; i++) {
      let point = segments[i].point;
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    let width = Math.max(maxX - minX, 10);
    let height = Math.max(maxY - minY, 10);

    // Adjust for centering when there's only one point
    if (segments.length === 1) {
      minX -= width / 2;
      minY -= height / 2;
    }

    return new paper.Rectangle(
      new paper.Point(minX, minY),
      new paper.Size(width, height)
    );
  }
  function updateBoundingBoxPositions(delta) {
    GetAllSelectionBoundingBoxes().forEach((rect) => {
      rect.segments.forEach((seg) => (seg.point = seg.point.add(delta)));
    });
  }
  function deselectAllPoints() {
    DestroySelectionBoundingBoxes();
    let selectedPoints = GetSelectedSegments();
    if (selectedPoints) {
      selectedPoints.forEach((segment) => {
        segment.selected = false;
      });
    }
  }

  function deleteSelectedPoints() {
    let AREYOUSURE = true;
    let selectedPoints = GetSelectedSegments();
    if (!selectedPoints) return;

    let totalSelectedPoints = selectedPoints.length - 4; //All points that are not the bounding box
    if (totalSelectedPoints > 5) {
      AREYOUSURE = confirm(
        `Are you sure you want to delete ${totalSelectedPoints} points?`
      );
    }
    if (!AREYOUSURE) return;
    selectedPoints.forEach((seg) => seg.remove());
    deselectAllPoints();
  }
  function GetSelectedSegments() {
    let selected = [];
    getAllPaths().forEach((path) => {
      let segments = path.segments;
      // console.log(path,"POINTUS");
      segments.forEach((seg) => {
        if (seg.point.selected) {
          selected.push(seg);
        }
      });
    });
    if (selected.length > 0) return selected;
    else return null;
  }

  return {
    onMouseDown: onMouseDown,
    onMouseDrag: onMouseDrag,
    onMouseUp: onMouseUp,
    deleteSelectedPoints,
    deleteSelectedPoints,
  };
})();

export { SelectionTool };
