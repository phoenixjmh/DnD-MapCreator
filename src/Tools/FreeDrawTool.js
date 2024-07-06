var FreeDrawTool = (function() {
    var path;
    let stroke_width_slider = document.getElementById("stroke-width-slider");
    let mapLayer;
    let m_Button;

    let brushSize = stroke_width_slider.value;
    function onMouseDown(event) {
        if (event.event.which !== 1) {
            return;
        }
        console.log("FreeDrawDown");
        path = new paper.Path(); // Create a new path
        path.strokeColor = "black"; // Set stroke color (optional)
        path.strokeScaling = false;
        path.strokeWidth = brushSize;
        path.add(event.point); // Add the first point
    }

    function onMouseDrag(event) {
        if (event.event.which !== 1) {
            return;
        }
        if (path) {
            path.add(event.point); // Add points as you drag
        }
    }
    function GetTolerance() {
        return document.querySelector('#tolerance').value;
    }
    function onMouseUp(event) {
        if (event.event.which !== 1) {
            return;
        }
        if (simplify_checkbox.checked) {
                path.simplify(GetTolerance());
                path.smooth();
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
    function OnActivate() {
        let tool_properties_panel = document.querySelector(".tool-info");
        tool_properties_panel.innerHTML =
            `
            <label for="tolerance">Tolerance</label>
            <input type="number" id="tolerance" value="1" min="0.1" max="100000000">

    `;
        m_Button.style.backgroundColor = "orange";
    }
    function OnDeactivate() {
        m_Button.style.backgroundColor = "var(--tool-color)";
    }
    function Register(button) {
        m_Button = button;
    }

    return {
        onMouseUp: onMouseUp,
        onMouseDown: onMouseDown,
        onMouseDrag: onMouseDrag,
        setMapLayer: setMapLayer,
        OnActivate: OnActivate,
        OnDeactivate: OnDeactivate,
        Register: Register,
    };
})();
export { FreeDrawTool };
