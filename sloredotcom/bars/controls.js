// Controls
var speedControl = document.getElementById("speedControl");
if (speedControl) {
    speedControl.addEventListener("input", (event) => {
        animSpeed = 500 - event.target.value; // Inverse relationship (higher value = faster)
    });
} else {
    console.log("Speed control not found.");
}

var shuffleButton = document.getElementById("shuffleButton");
if (shuffleButton) {
    shuffleButton.addEventListener("click", () => {
        sorting = false;
        shuffle(bars);
        // make sure all bars are grey
        bars.forEach(bar => bar.color = defaultBarColor);
        drawBars();
    });
} else {
    console.log("Shuffle button not found.");
};

document.getElementById("setBarCountButton").addEventListener("click", () => {
    if (sorting)
        sorting = false;
    const newCount = parseInt(document.getElementById("barCountInput").value);
    if (newCount >= 10 && newCount <= 2000) {
        n = newCount;
        bars = [];
        initializeBars(bars, n, minHeight, maxHeight);
        shuffle(bars);
        drawBars();
    }
});

document.getElementById("stopButton").addEventListener("click", () => {
    sorting = false;
});