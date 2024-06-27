var CoastalTool = (function() {
    function setMapLayer(layer) {
        mapLayer = layer;
    }

    function Fractalize(automated, value = 0) {
        if (getSelectedPaths().length > 1) {
            alert(`There are ${getSelectedPaths().length} paths selected. Do this one at a time.`);
            return;
        }
        let newPoints = Subdivide();

        if (!automated) {
            AddNoise(value, newPoints);
        }
        else {
            let noiseFactor = (200 / newPoints.length) + 1;
            AddNoise(noiseFactor, newPoints);
        }

    }

    //make this function return all the new points added
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
                    index: i
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
            const randomVector = new paper.Point(Math.cos(randomAngle), Math.sin(randomAngle));
            const offset = randomVector.multiply(noiseIntensity);
            const newPoint = point.add(offset);

            // Ensure the new point doesn't cause intersections (simplified)
            const prevPoint = selectedPath._segments[originalPointIndex - 1].point;
            const nextPoint = selectedPath._segments[(originalPointIndex + 1) % selectedPath._segments.length].point;

            const maxDistance = prevPoint.getDistance(nextPoint);
            if (prevPoint.getDistance(newPoint) > maxDistance || nextPoint.getDistance(newPoint) > maxDistance) {
                // If the new point causes intersection, simply keep the original point
                continue; // Skip to the next iteration
            }

            // Update the point
            selectedPath._segments[originalPointIndex].point = newPoint;
        }
    }


    return {
        setMapLayer: setMapLayer,
        Subdivide: Subdivide,
        AddNoise: AddNoise,
        Fractalize: Fractalize,
    };
})();
export { CoastalTool };
