var SelectionTool = (function() {
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
                moveSelectedPoints(event.delta);
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
            selectionRectangle.remove();
            selectionRectangle = null;
        }
        console.log(`Selected ${getSelectedPaths().length} paths`);
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
        if (!hit) deselectAllPoints();
    }

    function GetAllSelectionBoundingBoxes() {
        let allSelectionBoxes = paper.project.getItems({
            recursive: true,
            match: (item) => item.data && item.data.isSelectionBox,
        });
        return allSelectionBoxes;
    }
    function deselectAllPoints() {
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
