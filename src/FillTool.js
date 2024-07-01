var FillTool = (function() {

  function onMouseDown(event) {
  if (event.event.which !== 1) return; 

  let point = event.point;
  let allPaths = getAllPaths();
  let closestPath = null;
  let minDistance = Infinity; 

  for (let path of allPaths) {
    if (!path.closed) continue;

    if (path.contains(point)) {
        // Find closest point on the path's stroke to the clicked point
        let closestPoint = path.getNearestPoint(point);
        let distance = point.getDistance(closestPoint);

        // Update if this path is closer than previously found paths
        if (distance < minDistance) {
          closestPath = path;
          minDistance = distance;
        }
      }
    }
  if (closestPath) {
    closestPath.fillColor = currentFillColor;
  }
  }


    function OnActivate() {
        let tool_properties_panel = document.querySelector(".tool-info");
        tool_properties_panel.innerHTML = `
            <input type="color" id="custom-color-selector" value="#fffff2">
                                            `;

        let custom_color_selector = document.querySelector("#custom-color-selector");
        custom_color_selector.addEventListener("input", (e) => {
            e.preventDefault();
            let color = e.target.value;
            currentFillColor = color;
        });

    }

    return {
        onMouseDown: onMouseDown,
        OnActivate: OnActivate,

    };
})();
export { FillTool };
