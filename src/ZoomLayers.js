


let Viewport = (function() {

    function Init() {

        let currentZoomLevel = 0;
        let zoom_level_display = document.getElementById("zoom_level_display");
        zoom_level_display.textContent = "Zoom Level:";

        canvas.addEventListener("wheel", function(event) {
            event.preventDefault();
            let zoomFactor = 1 - event.deltaY / 1000;

            //cap zoom in
            if (currentZoomLevel == 100 && zoomFactor > 1) {
                return;
            }
            if (zoomFactor > 1) {
                currentZoomLevel += 1;
                zoomFactor = 1.1;
            } else if (zoomFactor < 1) {
                zoomFactor = 0.9;
                currentZoomLevel -= 1;
            }
            // MapLayerHandler(currentZoomLevel);

            zoom_level_display.textContent = currentZoomLevel;

            const viewPos = paper.view.center;
            const scalingFactor = new paper.Point(zoomFactor, zoomFactor);

            paper.project.activeLayer.scale(scalingFactor, viewPos); // Scale

            paper.view.update();
        });

        //////////////////////////////

        //  PAN AND SCAN

        /////////////////////////////
        let lastPoint = null;

        // Listen for mousedown event
        paper.view.onMouseDown = function(event) {
            if (event.event.which === 2) {
                // Middle mouse button
                lastPoint = new paper.Point(event.point);
            }
        };

        // Listen for mousemove event
        paper.view.onMouseDrag = function(event) {
            if (lastPoint) {
                const delta = lastPoint.subtract(event.point);
                paper.view.scrollBy(delta);
                lastPoint = event.point.add(delta);
            }
        };
        // Listen for mouseup event
        paper.view.onMouseUp = function(event) {
            lastPoint = null;
        };

        function MapLayerHandler(zoom_level) {
            //testing purposes, brute force set the map layer to all tools
            LineTool.setMapLayer(zoom_level);
            FreeDrawTool.setMapLayer(zoom_level);
            DotLabelTool.setMapLayer(zoom_level);
            AllPathObjects.forEach((val) => {
                let { path, mapLayer, isDotLabel } = val;
                if (mapLayer - currentZoomLevel > 30 || currentZoomLevel - mapLayer > 30) {
                    path.visible = false;
                    console.log("Zoom out of scope");
                } else {
                    path.visible = true;
                }
            });
        }
    }

    return {Init:Init};

})();
export { Viewport };
