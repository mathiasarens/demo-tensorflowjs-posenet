const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const imageElement = document.getElementById('image');

function resetPoints() {
    for (let element of document.querySelectorAll(".point")) {
        element.parentNode.removeChild(element);
    }
}

function calculatePose() {
    posenet.load().then(function (net) {
        return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
    }).then(function (pose) {
        console.log(pose);
        resetPoints();
        let container = document.getElementById('container');
        for (const keypoint of pose.keypoints) {
            if (keypoint.score > 0.75) {
                let divNode = document.createElement("div");
                divNode.classList.add("point");
                divNode.style.top = keypoint.position.y - 1 + 'px';
                divNode.style.left = keypoint.position.x - 1 + 'px';
                container.appendChild(divNode);
            }
        }
    });
}


var resizeTimeoutId = null;

function firePostNetCalculation(callback) {
    resizeTimeoutId = null;
    callback();
}

function filterLastResizeEvent(e) {
    if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = null;
    }
    resizeTimeoutId = setTimeout(firePostNetCalculation, 500, calculatePose);
}

window.addEventListener("resize", filterLastResizeEvent);
window.onload = calculatePose;

