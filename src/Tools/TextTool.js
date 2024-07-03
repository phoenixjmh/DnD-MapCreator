var TextTool = (function () {
  let fontSize = "12px";
  let m_Button;
  function onMouseDown(event) {
    if (event.event.which !== 1) return;
    if (event.modifiers.shift) {
      let point = event.point;
      //maybe have shift key for moving the text??
      CreateText(point);
    }
  }
  function createPointText(_point, _content) {
    fontSize =
      document.querySelector("#add-label-text-area").style.fontSize + "px";
    let fs = fontSize.split("p").shift();
    console.log(fs);
    let pointText = new paper.PointText({
      content: _content,
      point: _point,
      fontSize: fs,
      fillColor: "black",
    });
    pointText.onDoubleClick = () => {
      EditText(pointText);
    };
  }

  function EditText(textItem) {
    let textEditor = document.createElement("textarea");
    textEditor.value = textItem.content;

    Object.assign(textEditor.style, {
      position: "absolute",
      left: textItem.position.x - textEditor.offsetWidth / 2 + "px",
      top: textItem.position.y + "px",
    });

    document.body.append(textEditor);

    textEditor.focus();
    const offsetY = textEditor.getBoundingClientRect().height / 2;
    textEditor.style.top = textItem.position.y + offsetY + 20 + "px";
    textEditor.style.left = textItem.position.x - textEditor.offSetWidth + "px";
    textEditor.style.fontSize = fontSize;
    textEditor.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        textItem.content = textEditor.value;
        textEditor.remove();
        textEditor = null;
      }
    });
  }

  function CreateText(_point) {
    if (document.querySelector("#add-label-text-area")) {
      console.log("ALREADY EXISTING TEXT AREA");
      textEditor.focus();
      return;
    }

    let textEditor = document.createElement("textarea");

    textEditor.style.fontSize = fontSize;
    textEditor.id = "add-label-text-area";

    Object.assign(textEditor.style, {
      position: "absolute",
      left: _point.x - textEditor.offsetWidth / 2 + "px",
      top: _point.y + textEditor.offsetHeight / 2 + "px",
    });

    document.body.append(textEditor);

    //center textarea on click area (or attempt to at least)
    const offsetY = textEditor.getBoundingClientRect().height / 2;
    textEditor.style.top = _point.y + offsetY + 20 + "px";

    textEditor.style.fontSize = fontSize;

    textEditor.focus();

    textEditor.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        createPointText(_point, textEditor.value);
        textEditor.remove();
        textEditor = null;
      }
    });
  }
  //Create tool properties panel elements
  function OnActivate() {
    let tool_properties_panel = document.querySelector(".tool-info");
    tool_properties_panel.innerHTML = `

          <div id="font-controls">
            <label for="font-size">Font Size:</label>
            <input type="number" id="font-size" value="12" min="10" max="100">
          </div>
                                            `;

    let font_size_input = document.querySelector("#font-size");
    font_size_input.onclick = (e) => {
      e.preventDefault();
      let fs = e.target.value + "px";
      ChangeFontSize(fs);
    };

    m_Button.style.backgroundColor = "orange";
  }

  function ChangeFontSize(fontSize) {
    document.querySelector("#add-label-text-area").style.fontSize = fontSize;
  }
  function OnDeactivate() {
    m_Button.style.backgroundColor = "var(--tool-color)";
  }
  function Register(button) {
    m_Button = button;
  }
  return {
    onMouseDown: onMouseDown,
    ChangeFontSize: ChangeFontSize,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
    Register: Register,
  };
})();
export { TextTool };
