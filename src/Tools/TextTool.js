var TextTool = (function() {
    let fontSize = "12px";
    let m_Button;
    function onMouseDown(event) {
        if (event.event.which !== 1) return;
        if (event.modifiers.shift) {
            let point = event.point;
            HandleText(point);
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

        doubleClickCB(pointText);
    }
    function doubleClickCB(point_text) {
        point_text.onDoubleClick = function(e) {

            console.log("DOUBY CALLBACK FOR", this);
            HandleText(point_text.position, this);
        }

    }

    function HandleText(point, existingText = null) {
        let existingTextEditor = document.querySelector("#add-label-text-area");
        if (existingTextEditor) {
            console.log("ALREADY EXISTING TEXT AREA",);
            existingTextEditor.focus();
            return;
        }

        let textEditor = document.createElement("textarea");
        textEditor.id = "add-label-text-area";

        //Get the screen point of approximate mouse position
        const canvasRect = canvas.getBoundingClientRect();
        let screenPoint = paper.view.projectToView(point);
        screenPoint.x += canvasRect.left;
        screenPoint.y += canvasRect.top;


        //Change text to read from input, or from existing textObject
        let currentFontSize;
        if (!existingText)
            currentFontSize = document.querySelector('#font-size').value;
        else {
            document.querySelector('#font-size').value = existingText.fontSize;
            currentFontSize = existingText.fontSize;
        }

        Object.assign(textEditor.style, {

            position: "absolute",
            fontSize: currentFontSize + "px",
            padding: "2px",
            border: "1px solid #ccc",
            background: "white",
            left: screenPoint.x + "px",
            top: screenPoint.y + "px",
        });

        if (existingText) {
            textEditor.value = existingText.content;
        }
        document.body.append(textEditor);
        textEditor.focus();
        textEditor.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (existingText)
                    ApplyModifications(existingText, textEditor);
                else
                    createPointText(point, textEditor.value);

                textEditor.remove();
            }
        });
        console.log(` text area position (TOP:${textEditor.style.top}, LEFT:${textEditor.style.left}`);
    }

    function ApplyModifications(existingText, textEditor) {

        existingText.content = textEditor.value;
        let strippedFontSize = textEditor.style.fontSize.split('p').shift();
        existingText.fontSize = strippedFontSize;
        doubleClickCB(existingText);
    }

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
        let textArea = document.querySelector("#add-label-text-area");
        if (textArea)
            textArea.style.fontSize = fontSize;
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
