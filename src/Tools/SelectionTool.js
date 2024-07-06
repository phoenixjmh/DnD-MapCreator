var SelectionTool = (function () {
  let selectionRectangle;
  let m_Button;

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
  function onMouseDrag(event) {
    if (event.event.which !== 1) {
      return;
    }
    if (selectionRectangle) {
      handleRectangleSelectionUpdate(event.point);
    } else {
      if (GetSelectedSegments()) {
        moveSelectedPoints(event.delta);
      }
      if (GetSelectedTextItems()) {
        moveSelectedText(event.delta);
      }
    }
  }

  function onMouseUp(e) {
    if (selectionRectangle) {
      selectPointsWithinRectangle();
      selectTextWithinRectangle();
      selectionRectangle.remove();
      selectionRectangle = null;
    }

    TakeSnapshot(paper.project);
  }

  function handleRectangleSelectionStart(point) {
    deselectAllPoints();
    selectionRectangle = new paper.Path.Rectangle({
      from: point,
      to: point,
      strokeColor: "black",
      dashArray: [4, 4],
    strokeScaling:false,
    });
  }

  function handleRectangleSelectionUpdate(point) {
    selectionRectangle.segments[1].point.x = point.x; // Top right
    selectionRectangle.segments[2].point = point;
    selectionRectangle.segments[3].point.y = point.y;
  }

  function moveSelectedPoints(delta) {
    GetSelectedSegments().forEach((segment) => {
      segment.point = segment.point.add(delta);
    });
  }

  function moveSelectedText(delta) {
    GetSelectedTextItems().forEach((textItem) => {
      textItem.point = textItem.point.add(delta);
    });
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
    if (!hit) deselectAllPoints();
    getSelectedPaths();
  }

  function selectTextWithinRectangle() {
    let hit = false;
    paper.project
      .getItems({
        class: paper.PointText, // Select only PointText items
      })
      .forEach((textItem) => {
        if (selectionRectangle.contains(textItem.position)) {
          textItem.selected = true;
          hit = true;
        } else {
          textItem.selected = false;
        }
      });
  }
  function GetAllTextOrSegments() {
    let selectedPoints = [];
    let _segments = GetSelectedSegments();
    let _textItems = GetSelectedTextItems();
    if (_segments) {
      selectedPoints = _segments;
      if (_textItems) selectedPoints.concat(_textItems);
    } else {
      selectedPoints = _textItems;
    }
    return selectedPoints;
  }
  function deselectAllPoints() {
    let selectedPoints = GetAllTextOrSegments();

    if (selectedPoints) {
      selectedPoints.forEach((segment) => {
        segment.selected = false;
      });
    }
  }

  function deleteSelectedPoints() {
    let selectedPoints = GetAllTextOrSegments();
    let AREYOUSURE = true;
    if (!selectedPoints) return;

    let totalSelectedPoints = selectedPoints.length - 4; //All points that are not the bounding box
    if (totalSelectedPoints > 5) {
      AREYOUSURE = confirm(
        `Are you sure you want to delete ${totalSelectedPoints} points?`,
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
      segments.forEach((seg) => {
        if (seg.point.selected) {
          selected.push(seg);
        }
      });
    });
    if (selected.length > 0) return selected;
    else return null;
  }
  function GetSelectedTextItems() {
    var selectedTextItems = [];

    paper.project
      .getItems({
        class: paper.PointText,
      })
      .forEach((textItem) => {
        if (textItem.selected) selectedTextItems.push(textItem);
      });
    if (selectedTextItems.length > 0) return selectedTextItems;
    else return null;
  }
  function OnActivate() {
    m_Button.style.backgroundColor = "orange";
  }
  function OnDeactivate() {
    m_Button.style.backgroundColor = "var(--tool-color)";
  }
  function Register(button) {
    m_Button = button;
  }

  return {
    onMouseDown: onMouseDown,
    onMouseDrag: onMouseDrag,
    onMouseUp: onMouseUp,
    deleteSelectedPoints,
    deleteSelectedPoints,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
    Register: Register,
  };
})();

export { SelectionTool };
