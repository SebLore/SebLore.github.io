
// get the input elements


/**
 * Event listeners and controls
 */

// resolution change
resolutionInput.addEventListener("input", () => {
    gridSize = parseInt(resolutionInput?.value, 10) || 32;
    step = 2 / gridSize;
    gridCells = makeGrid(gridSize);
    updateGridVertices();
    updateMetaBallVertices();

    // redraw
    newFrame();
    DrawBalls();
    DrawGrid();
    DrawCircles();

});

// change smoothness
smoothnessInput.addEventListener("input", () => {
    K_SMOOTH = parseFloat(smoothnessInput.value);
    updateMetaBallVertices();
});

// change size of bounds
boundsSizeInput.addEventListener("input", () => {
    BOUND = parseFloat(boundsSizeInput.value);
    updateMetaBallVertices();

        // redraw
    newFrame();
    DrawBalls();
    DrawGrid();
    DrawCircles();
});

// // toggle draw bounds
// let boundsInput = document.getElementById("bounds");
// // create if not exist
// if (!boundsInput) {
//     boundsInput = document.createElement("input");
//     boundsInput.type = "checkbox";
//     boundsInput.id = "bounds";
//     boundsInput.checked = drawBounds;
//     document.body.appendChild(boundsInput);
// }
// boundsInput.addEventListener("change", () => {
//     drawBounds = boundsInput.checked;
//     updateFillVertices();
// });

// listen for 'add circle' button
let addCircleButton = document.getElementById("add-circle");
if (addCircleButton) {
    addCircleButton.addEventListener("click", () => {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const r = Math.random() * 0.3 + 0.1;
        AddCircle(x, y, r);
        updateMetaBallVertices();
    });
}

let pauseButton = document.getElementById("pause-btn");
if (pauseButton) {
    pauseButton.addEventListener("click", () => {
        paused = !paused;
    });
}

const speedSlider = document.getElementById("speed");
var speed = parseFloat(speedSlider.value);
if (speedSlider) {
    speedSlider.addEventListener("input", () => {
        speed = parseFloat(speedSlider.value);
    });
}

const toggleCircles = document.getElementById("toggle-circles");
if(toggleCircles)
{
    toggleCircles.addEventListener("click", () => {
        drawCircles = !drawCircles;
    })
}

const toggleGrid = document.getElementById("toggle-grid");
if(toggleGrid)
{
    toggleGrid.addEventListener("click", () => {
        drawGrid = !drawGrid;
    })
}

