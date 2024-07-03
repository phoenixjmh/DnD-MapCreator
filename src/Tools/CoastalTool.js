var CoastalTool = (function () {
  let m_Button;
  function setMapLayer(layer) {
    mapLayer = layer;
  }

  //if automated, we step down the noise based on the amount of
  //subdivided points, otherwise, we use the user supplied value

  function Fractalize(automated, value = 0) {
    if (getSelectedPaths().length > 1) {
      alert(
        `There are ${getSelectedPaths().length} paths selected. Do this one at a time.`,
      );
      return;
    }
    let newPoints = Subdivide();

    if (!automated) {
      AddNoise(value, newPoints);
    } else {
      let noiseFactor = 200 / newPoints.length + 1;
      AddNoise(noiseFactor, newPoints);
    }
  }

  function Subdivide() {
    let AddedPoints = [];
    let selectedPaths = getSelectedPaths();
    for (let selectedPath of selectedPaths) {
      var newPoints = [];

      for (var i = 0; i < selectedPath.segments.length - 1; i++) {
        var point1 = selectedPath.segments[i].point;
        var point2 = selectedPath.segments[i + 1].point;

        var midPoint = point1.add(point2).divide(2);

        newPoints.push(point1, midPoint);
        //adding the index here, to simplify array access
        let PointObject = {
          point: midPoint,
          index: i,
        };
        AddedPoints.push(PointObject);
      }

      newPoints.push(selectedPath.lastSegment.point);

      selectedPath.removeSegments();
      selectedPath.addSegments(newPoints);
      return AddedPoints;
    }
  }

  function AddNoise(noiseIntensity, pointsToMove) {
    let selectedPaths = getSelectedPaths();

    let selectedPath = selectedPaths[0];
    for (let i = 0; i < pointsToMove.length; i++) {
      const { point, index } = pointsToMove[i];
      const originalPointIndex = index * 2 + 1;

      // Calculate a new point with noise
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomVector = new paper.Point(
        Math.cos(randomAngle),
        Math.sin(randomAngle),
      );
      const offset = randomVector.multiply(noiseIntensity);
      const newPoint = point.add(offset);

      //If intersection will occur, skip iteration
      const prevPoint = selectedPath._segments[originalPointIndex - 1].point;
      const nextPoint =
        selectedPath._segments[
          (originalPointIndex + 1) % selectedPath._segments.length
        ].point;

      const maxDistance = prevPoint.getDistance(nextPoint);
      if (
        prevPoint.getDistance(newPoint) > maxDistance ||
        nextPoint.getDistance(newPoint) > maxDistance
      ) {
        continue;
      }

      // Update the point
      selectedPath._segments[originalPointIndex].point = newPoint;
    }
  }

  //Create the tool properties panel
  function OnActivate() {
    const toolPropertiesPanel = document.querySelector(".tool-info");
    toolPropertiesPanel.innerHTML = "";

    const fractalizeControls = document.createElement("div");
    fractalizeControls.id = "fractalize_controls";
    let checkbox_label = Object.assign(document.createElement("label"), {
      for: "fractalize_automated_checkbox",
      textContent: "Automated",
    });

    let automatedCheckbox = Object.assign(document.createElement("input"), {
      type: "checkbox",
      id: "fractalize_automated_checkbox",
      onchange: (e) => {
        let isChecked = automatedCheckbox.checked;
        if (!isChecked) {
          fractalizeControls.innerHTML = "";
          let strengthValueLabel = Object.assign(
            document.createElement("label"),
            {
              for: "fractalize_intensity_slider",
              textContent: "Strength:",
            },
          );
          let intensitySlider = Object.assign(document.createElement("input"), {
            type: "range",
            min: "0.1",
            max: "70",
            step: "1",
            id: "fractalize_intensity_slider",
            value: "1",
            oninput: (e) => {
              strengthValueLabel.textContent = e.target.value;
            },
          });
          let fractalize_button = Object.assign(
            document.createElement("button"),
            {
              id: "fractalize_button",
              textContent: "Fractalize",
              onclick: (e) => {
                e.preventDefault();
                Fractalize(false, intensitySlider.value);
              },
            },
          );
          fractalizeControls.append(
            strengthValueLabel,
            intensitySlider,
            fractalize_button,
          );
        } else {
          fractalizeControls.innerHTML = "";
          let fractalize_button = Object.assign(
            document.createElement("button"),
            {
              id: "fractalize_button",
              textContent: "Fractalize",
              onclick: (e) => {
                e.preventDefault();
                Fractalize(true, 0);
              },
            },
          );
          fractalizeControls.append(fractalize_button);
        }
      },
    });
    automatedCheckbox.dispatchEvent(new Event("change"));
    toolPropertiesPanel.append(
      checkbox_label,
      automatedCheckbox,
      fractalizeControls,
    );

    m_Button.style.backgroundColor = "orange";
  }

  function OnDeactivate() {
    m_Button.style.backgroundColor = "var(--tool-color)";
  }

  function Register(button) {
    m_Button = button;
  }
  return {
    setMapLayer: setMapLayer,
    Subdivide: Subdivide,
    AddNoise: AddNoise,
    Fractalize: Fractalize,
    OnActivate: OnActivate,
    OnDeactivate: OnDeactivate,
    Register: Register,
  };
})();
export { CoastalTool };
