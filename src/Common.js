
//path objects will take a path, and a layer that they were created on
let AllPathObjects = [];
function AddPathObject(PathObject) {
  AllPathObjects.push(PathObject);
  // console.log(AllPathObjects);
}

//SOME dom stuff here just for ease.

let tool_info_panel = document.querySelector(".tool-info");
let simplify_container=document.createElement('div');
simplify_container.id='simplify_container';
const simplify_checkbox = Object.assign(document.createElement("input"), {
  type: "checkbox",
  id: "simplify-checkbox",
    checked:true
});
const simplify_checkbox_label = Object.assign(document.createElement("label"), {
  textContent: "Simplify lines",
  for: "simplify-checkbox",
  id: "simplify-checkbox-label",
});

simplify_container.append(simplify_checkbox_label, simplify_checkbox)
tool_info_panel.append(simplify_container);

//Global Helpers
function getAllPaths() {
  let p = [];
  paper.project.activeLayer.children.forEach((item) => {
    if (item instanceof paper.Path) {
      p.push(item);
    }
  });
  return p;
}

function getSelectedPaths() {
  let p = [];
  paper.project.activeLayer.children.forEach((item) => {
    if (item instanceof paper.Path && item.selected) {
      p.push(item);
    }
  });
  console.log(p);
  return p;
}

let DEBUG_CIRCLES = [];
function DEBUG_DRAW_CIRCLE(radius, xLoc, yLoc) {
  DEBUG_CIRCLES.push(
    new paper.Path.Circle({
      center: [xLoc, yLoc],
      radius: radius, // You can adjust the radius as needed
      strokeColor: "black",
      fillColor: "red",
    })
  );
}
function DEBUG_CLEAR_CIRCLES() {
  DEBUG_CIRCLES.forEach((circle) => {
    circle.remove();
  });
  DEBUG_CIRCLES.length = 0;
}

paper.setup("myCanvas",{
    contextOptions:{
        willReadFrequently:true
    }
});
const canvas=document.getElementById('myCanvas');
