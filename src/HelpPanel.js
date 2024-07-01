

var HelpPanel = (function() {
    function Init() {

        const button = document.getElementById('help-button');
        const helpContent = document.getElementById('help-content');

        button.onclick = () => {
            helpContent.style.display = helpContent.style.display == 'none' ? 'block' : 'none';
        }

    }
    return {
        Init:Init
    };
})();
export { HelpPanel };
