var FillTool = (function () {
  let m_Button;
  let colors = [
    // Reds
    "#FF0000", // Red
    "#FF4500", // Orange-Red
    "#DC143C", // Crimson
    "#800000", // Maroon

    // Oranges
    "#FFA500", // Orange
    "#FF8C00", // Dark Orange
    "#FF6347", // Tomato
    "#FFDEAD", // Navajo White

    // Yellows
    "#FFFF00", // Yellow
    "#FFD700", // Gold
    "#F0E68C", // Khaki
    "#FFFACD", // Lemon Chiffon

    // Greens
    "#008000", // Green
    "#00FF00", // Lime
    "#98FB98", // Pale Green
    "#006400", // Dark Green

    // Cyans
    "#00FFFF", // Cyan
    "#40E0D0", // Turquoise
    "#AFEEEE", // Pale Turquoise
    "#008B8B", // Dark Cyan

    // Blues
    "#0000FF", // Blue
    "#1E90FF", // Dodger Blue
    "#87CEEB", // Sky Blue
    "#00008B", // Dark Blue

    // Indigos and Purples
    "#4B0082", // Indigo
    "#800080", // Purple
    "#9370DB", // Medium Purple
    "#DDA0DD", // Plum

    // Pinks
    "#FFC0CB", // Pink
    "#FF69B4", // Hot Pink
    "#FF1493", // Deep Pink
    "#DB7093", // Pale Violet Red

    // Browns
    "#A52A2A", // Brown
    "#D2691E", // Chocolate
    "#8B4513", // Saddle Brown
    "#F5DEB3", // Wheat

    // Whites and Beiges
    "#FFFFFF", // White
    "#F5F5DC", // Beige
    "#FFE4C4", // Bisque
    "#FFF8DC", // Cornsilk

    // Grays and Blacks
    "#C0C0C0", // Silver
    "#808080", // Gray
    "#A9A9A9", // Dark Gray
    "#000000", // Black

    // Special Colors
    "#696969", // Dim Gray
    "#F08080", // Light Coral
    "#FFDAB9", // Peach Puff
    "#B0E0E6", // Powder Blue
    "#ADD8E6", // Light Blue
  ];
  function BuildColorPalette() {
    let colorPalette = Object.assign(document.createElement("div"), {
      id: "color-palette",
    });
    function rgbToHex(rgb) {
      const result = rgb
        .match(/\d+/g)
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("");
      return `#${result}`;
    }
    function ChangeColorSelectorValue(color) {
      let custom_color_selector = document.querySelector(
        "#custom-color-selector",
      );
      custom_color_selector.value = color;
    }
    colors.forEach((color) => {
      const swatch = document.createElement("div");
      swatch.classList.add("colorSwatch");
      swatch.style.backgroundColor = color;
      let rgb = swatch.style.backgroundColor;
      let hex = rgbToHex(rgb);
      swatch.onclick = (e) => {
        currentFillColor = hex;
        ChangeColorSelectorValue(hex);
      };
      colorPalette.appendChild(swatch);
    });
    properties_panel.append(colorPalette);
  }
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
    m_Button.style.backgroundColor = "orange";
    properties_panel = document.querySelector(".tool-info");
    properties_panel.innerHTML = `
            <label class="property-label" for="custom-color-selector" >Custom Color Selector: </label>
            <input type="color" id="custom-color-selector" value="#fffff2">
            <span class="property-label" >Swatches</span>
                                            `;

    let custom_color_selector = document.querySelector(
      "#custom-color-selector",
    );
    custom_color_selector.addEventListener("input", (e) => {
      e.preventDefault();
      let color = e.target.value;
      currentFillColor = color;
    });
    BuildColorPalette();
  }
  function OnDeactivate() {
    m_Button.style.backgroundColor = "var(--tool-color)";
  }

  function Register(button) {
    m_Button = button;
  }
  return {
    onMouseDown: onMouseDown,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
    Register: Register,
  };
})();
export { FillTool };
