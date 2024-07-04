var DotLabelTool = (function () {
  let dot_path;
  let mapLayer;
  let m_Button;

  function onMouseDown(event) {
    if (event.event.which !== 1) {
      return;
    }
    console.log("Dot down");
    dot_path = new paper.Path.Circle({
      center: event.point,
      radius: 5,
      fillColor: "black",
    });
  }

  function onMouseUp(event) {
    if (event.event.which !== 1) {
      return;
    }
    let path = dot_path;
    let isDotLabel = true;
    let PathObject = {
      path,
      mapLayer,
      isDotLabel,
    };
    //do the label ting

    AddPathObject(PathObject);
    TakeSnapshot(paper.project);
  }
  function setMapLayer(layer) {
    mapLayer = layer;
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
    onMouseUp: onMouseUp,
    setMapLayer: setMapLayer,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
    Register: Register,
  };
})();

export { DotLabelTool };
