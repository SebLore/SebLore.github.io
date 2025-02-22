/**
 * This script handles user interaction with the index page
 */

// Wait for the HTML to parse before executing the script
document.addEventListener("DOMContentLoaded", () => {
    let section = document.getElementById("text-section");
    let display = document.getElementById("display");
    let elements = Array.from(section.children);
    let currentElementIndex = 0;
    let currentCharIndex = 0;
    let isPlaying = false;
    let speed = 50; // Adjust speed (milliseconds per letter)
    section.style.display = "none"; // Hide original section

    function typeText(element, newElement) {
        // Pre-render the entire content
        newElement.textContent = element.textContent;

        // Hide the pre-rendered text initially
        newElement.style.visibility = "hidden";

        let interval = setInterval(() => {
            // Show one character at a time
            newElement.style.visibility = "visible";
            newElement.textContent = element.textContent.slice(0, currentCharIndex);
            currentCharIndex++;

            if (currentCharIndex > element.textContent.length) {
                clearInterval(interval);
                currentCharIndex = 0;
                currentElementIndex++;
                newElement.style.visibility = "visible"; // Ensure text stays visible after it's typed
                setTimeout(displayNextElement, speed); // Small delay between elements
            }
        }, speed);
    }

    function displayNextElement() {
        if (currentElementIndex < elements.length) {
            let originalElement = elements[currentElementIndex];
            let newElement = document.createElement(originalElement.tagName);

            newElement.style.cssText = window.getComputedStyle(originalElement).cssText; // Copy styles
            newElement.className = originalElement.className; // Preserve classes

            display.appendChild(newElement);
            typeText(originalElement, newElement);
        }
    }

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space" && !isPlaying) {
            isPlaying = true;
            displayNextElement();
        }
    });

    // if space isn't pressed in 10 seconds, display help text
    setTimeout(() => {
        if (!isPlaying) {
            // Define the keyframe for the fade-in effect
            var help = document.createElement("h1");
            help.id = "help";
            help.style.cssText =
                `color: #aaa;
                font-size: 2rem;
                opacity: 0.5;
                text-align: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center; /* Vertically center */
                justify-content: center; /* Horizontally center */
                animation: fade-in 10s ease-out forwards;
            `;
            help.textContent = "Press the spacebar to start reading.";
            display.appendChild(help);
        }
    }, 5000);
});


// wait for all resources to load before managing audio and animations
window.onload = function () {
    let confirmBox = document.getElementById("confirm");
    let content = document.getElementById("content");
    let yesButton = document.getElementById("yesbtn");
    let typewriter = document.getElementById("typewriter");
    let text = document.getElementById("typedtext");
    const audio = document.getElementById("audioTyping");

    // confirm that the elements aren't null
    if (content === null || typewriter === null || text === null || audio === null) {
        console.error("One or more elements are missing.");
        return;
    }

    // Show the confirmation box
    if (confirmBox !== null)
        confirmBox.style.display = "flex";

    // If the user clicks "Yes", hide the confirmation box and show content
    if (yesButton !== null) {

        yesButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default link behavior

            // Hide the confirmation box
            confirmBox.style.display = "none";

            // Show the rest of the content
            content.style.display = "flex";

            // Start the typing animation
            // type();

            playSound(audio);

            // Stop the sound when typing animation ends
            typewriter.addEventListener("animationend", function () {
                stopSound(audio);
            });
        });
    }
    else if (content !== null)
        content.style.display = "flex";
};

function type() {

}
function playSound(audio) {
    audio.volume = 0.2;
    audio.currentTime = 2;
    audio.play();
}

function stopSound(audio) {
    // Stop the sound when typing animation ends
    audio.pause();
    audio.currentTime = 1; // Reset to the point where the sound should restart
}

function countSymbols(textElement) {
    return textElement.innerText.length;
}

