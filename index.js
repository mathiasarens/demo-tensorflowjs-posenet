const imageScaleFactor = 0.5;
const outputStride = 8;
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
        let container = document.getElementById('image-container');
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

function filterLastResizeEvent() {
    resetPoints();
    if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = null;
    }
    resizeTimeoutId = setTimeout(firePostNetCalculation, 500, calculatePose);
}

window.addEventListener("resize", filterLastResizeEvent);
window.onload = calculatePose;

