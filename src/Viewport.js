let Viewport = (function () {
  function Init() {
    let background_color_picker = document.querySelector(
      "#background-color-picker",
    );
    background_color_picker.oninput = (e) => {
      canvas.style.backgroundColor = e.target.value;
    };

    currentZoomLevel = 0;
    let zoom_level_display = document.getElementById("zoom-value");

    canvas.addEventListener("wheel", function (event) {
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
        zoomFactor = 1 / 1.1;
        currentZoomLevel -= 1;
      }
      // MapLayerHandler(currentZoomLevel);

      zoom_level_display.textContent = currentZoomLevel;

      const viewPos = paper.view.center;
      const scalingFactor = new paper.Point(zoomFactor, zoomFactor);
      let inverseScalingFactor=new paper.Point(1/zoomFactor,1/zoomFactor);
      let matrix=new paper.Matrix().scale(zoomFactor,viewPos);
      let inverseMatrix=new paper.Matrix().scale(1/zoomFactor,viewPos);
      


       function getDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
      }

      // Function to check if any points in an object are within the threshold distance
      function hasClosePoints(item, threshold) {
        if (!item.segments) return false; // Skip if item does not have segments
        for (let i = 0; i < item.segments.length; i++) {
          for (let j = i + 1; j < item.segments.length; j++) {
            if (getDistance(item.segments[i].point, item.segments[j].point) < threshold) {
              return true;
            }
          }
        }
        return false;
      }

      //scale the whole scene first, then revert that for minimized objects

      // paper.project.activeLayer.scale(scalingFactor,viewPos); // Scale

      paper.view.update();
      // Define the distance threshold
      const distanceThreshold = 0.1;

      paper.project.activeLayer.children.forEach((item) => {
        if (item.shouldStopScaling && currentZoomLevel <= item.stoppedAt) {
          item.translate(viewPos.subtract(item.position).multiply(1 - scalingFactor.x));
          //FUCK
          return;
        }
        
        if(item.shouldStopScaling==true){
          item.shouldStopScaling=false;
          item.scale(scalingFactor,viewPos);
          
        }
        if (hasClosePoints(item, distanceThreshold)) {
          item.shouldStopScaling = true;
          item.stoppedAt = currentZoomLevel; 
          item.scale(1,viewPos);
          console.log(item.stoppedAt);
        } else {
          item.shouldStopScaling = false;
          item.scale(scalingFactor,viewPos);
        }
      });

    });


      // Apply scaling conditionally
      // paper.project.activeLayer.children.forEach((item) => {
      //   if (!hasClosePoints(item, distanceThreshold)||zoomFactor>1&&currentZoomLevel>=item.data.StoppedAt) {
      //     if(zoomFactor>1&&currentZoomLevel>=item.data.StoppedAt)
      //       {
      //         item.data.StoppedAt='';
      //         if(item.data.isMinimumSize)
      //         item.isMinimumSize=false;

      //       }
      //     item.transform(matrix);
      //   }
      //   else{
      //     if(!item.data.isMinimumSize){

      //     item.data.StoppedAt=currentZoomLevel;
      //     console.log("CLOSE POINTS",item.data);
      //     item.data.isMinimumSize=true;
      //     }

      //   }
      // });

      // // paper.project.activeLayer.scale(scalingFactor, viewPos); // Scale
      // paper.project.activeLayer.transform(matrix);

      // paper.view.update();

    //////////////////////////////

    //  PAN AND SCAN

    /////////////////////////////
    let lastPoint = null;

    paper.view.onMouseDown = function (event) {
      // Middle mouse button
      if (event.event.which === 2) {
        lastPoint = new paper.Point(event.point);
      }
    };

    paper.view.onMouseDrag = function (event) {
      if (lastPoint) {
        const delta = lastPoint.subtract(event.point);
        paper.view.scrollBy(delta);
        lastPoint = event.point.add(delta);
      }
    };

    paper.view.onMouseUp = function (event) {
      lastPoint = null;
    };

    //Handle item fading on zoom out / in
    function MapLayerHandler(zoom_level) {
      //testing purposes, brute force set the map layer to all tools
      LineTool.setMapLayer(zoom_level);
      FreeDrawTool.setMapLayer(zoom_level);
      DotLabelTool.setMapLayer(zoom_level);
      AllPathObjects.forEach((val) => {
        let { path, mapLayer, isDotLabel } = val;
        if (
          mapLayer - currentZoomLevel > 30 ||
          currentZoomLevel - mapLayer > 30
        ) {
          path.visible = false;
          console.log("Zoom out of scope");
        } else {
          path.visible = true;
        }
      });
    }
  }

  return { Init: Init };
})();
export { Viewport };
