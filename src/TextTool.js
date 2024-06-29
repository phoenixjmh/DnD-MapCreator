
var TextTool = (function() {
    let fontSize="12px";
    function onMouseDown(event) {
        if (event.event.which !== 1)
            return;
        if (event.modifiers.shift) {

            let point = event.point;
            //maybe have shift key for moving the text??
            createInitialTextInputField(point);
        }

    }
    function createPointText(_point, _content) {
        let fs=fontSize.split("p").shift();
        let pointText = new paper.PointText({
            content: _content,
            point: _point,
            fontSize:fs,
            fillColor: "black",
        });
        pointText.onDoubleClick = function(event) {
            createTextEditor(pointText);
        }
    }

    function createTextEditor(textItem) {
        let textEditor = document.createElement("textarea");
        textEditor.value = textItem.content;
        Object.assign(textEditor.style, { position: "absolute", left: (textItem.position.x - textEditor.offsetWidth / 2) + "px", top: textItem.position.y + "px" });

        document.body.append(textEditor);

        textEditor.focus();
        const offsetY = textEditor.getBoundingClientRect().height / 2;
        textEditor.style.top = (textItem.position.y + offsetY + 20) + "px";
        textEditor.style.left= (textItem.position.x-textEditor.offSetWidth) + "px"
        textEditor.style.fontSize=fontSize;
        textEditor.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                textItem.content = textEditor.value;
                textEditor.remove();
                textEditor = null;
            }
        });
    }
    function ChangeFontSize(fontSize){
        document.querySelector('#add-label-text-area').style.fontSize=fontSize;
    }
    function createInitialTextInputField(_point) {
        console.log(_point);
        let textEditor = document.createElement("textarea");

        textEditor.style.fontSize=fontSize;
        textEditor.id='add-label-text-area';
        Object.assign(textEditor.style, { position: "absolute", left: (_point.x - (textEditor.offsetWidth / 2)) + "px", top: _point.y + (textEditor.offsetHeight / 2) + "px" });
        document.body.append(textEditor);

        const offsetY = textEditor.getBoundingClientRect().height / 2;
        textEditor.style.top = (_point.y + offsetY + 20) + "px";


        textEditor.style.fontSize=fontSize;

        textEditor.focus();

        console.log(textEditor.style.fontSize);
        textEditor.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                createPointText(_point, textEditor.value);
                textEditor.remove();
                textEditor = null;
            }
        });
    }

    return {
        onMouseDown: onMouseDown,
        ChangeFontSize:ChangeFontSize,

    };
})();
export { TextTool };
