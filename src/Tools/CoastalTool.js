var CoastalTool = (function() {
    let m_Button;
    function setMapLayer(layer) {
        mapLayer = layer;
    }

    //if automated, we step down the noise based on the amount of
    //subdivided points, otherwise, we use the user supplied value


    function Fractalize() {
        if (getSelectedPaths().length > 1) {
            alert(
                `There are ${getSelectedPaths().length} paths selected. Do this one at a time.`,
            );
            return;
        }
        let newPoints = Subdivide();

        AddNoise(newPoints);
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

    function AddNoise(pointsToMove) {
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
            const prevPoint = selectedPath._segments[originalPointIndex - 1].point;
            const nextPoint =
                selectedPath._segments[
                    (originalPointIndex + 1) % selectedPath._segments.length
                ].point;
            let randomDivisor = Math.floor(Math.random() * 4) + 4;
            let distNoise = (prevPoint.getDistance(nextPoint) / randomDivisor);

            const offset = randomVector.multiply(distNoise);
            const newPoint = point.add(offset);

            //If intersection will occur, skip iteration

            const maxDistance = prevPoint.getDistance(nextPoint);
            if (
                prevPoint.getDistance(newPoint) > maxDistance ||
                nextPoint.getDistance(newPoint) > maxDistance
            ) {
                console.log("POINT REJECTED");
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

        fractalizeControls.innerHTML = "";
        let fractalize_button = Object.assign(
            document.createElement("button"),
            {
                id: "fractalize_button",
                textContent: "Fractalize",
                onclick: (e) => {
                    e.preventDefault();
                    Fractalize();
                },
            },
        );
        fractalizeControls.append(fractalize_button);

        m_Button.style.backgroundColor = "orange";
        toolPropertiesPanel.append(fractalizeControls);
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
