
//path objects will take a path, and a layer that they were created on
let AllPathObjects = [];
function AddPathObject(PathObject) {
  AllPathObjects.push(PathObject);
  // console.log(AllPathObjects);
}

//SOME dom stuff here just for ease.

let persistent_tools_panel = document.querySelector("#persistent-tools");
let simplify_checkbox = document.querySelector("#simplify-checkbox");
let close_path_button = document.querySelector("#close-path-button");
let properties_panel = document.querySelector(".tool-info");

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
    let segs=p[0]._segments;
    let points=segs.map(val=>({x:val.point.x,y:val.point.y}));
  console.log("SELECTED ",points);
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
    }),
  );
}
function DEBUG_CLEAR_CIRCLES() {
  DEBUG_CIRCLES.forEach((circle) => {
    circle.remove();
  });
  DEBUG_CIRCLES.length = 0;
}

function OnProjectLoad() {
  let zoom_level_display = document.querySelector("#zoom-value");
  zoom_level_display.textContent = currentZoomLevel;
}
////////////////////////
//      GLOBAL VARS
///////////////////////

let currentFillColor;

let currentZoomLevel=0;

paper.setup("myCanvas", {
  contextOptions: {
    willReadFrequently: true,
  },
});
const canvas = document.getElementById("myCanvas");
