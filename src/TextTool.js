
var TextTool = (function() {
    function onMouseDown(event) {
        if(event.event.which!==1)
        return;
        let point = event.point;

        getInput(point);
    }
    function createPointText(_point,_content) {
        let pointText = new paper.PointText({
            content: _content,
            point: _point,
            fontSize: 20,
            fillColor: "black",
        });
    }

    function getInput(_point) {
        const dialog = document.getElementById('add-text-dialog');
        dialog.showModal();
        const add_text_button = document.getElementById('confirm-text-input-button');
        add_text_button.onclick = (e) => {
            e.preventDefault();
            const inputText = document.getElementById('add-text-input').value;
            dialog.close();
            document.getElementById('add-text-input').value=document.getElementById('add-text-input').placeholder;
            createPointText(_point,inputText);
        }
    }

    return {
        onMouseDown: onMouseDown,

    };
})();
export { TextTool };
