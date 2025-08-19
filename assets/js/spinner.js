/* inserts a loading spinner until the page is finished loading */

// to make the spinner disappears when the page is fully loaded
// Wait for the DOM to be fully loaded before running the script

document.addEventListener('DOMContentLoaded', () => {
    // Create the spinner element
    const container = document.createElement('div');
    container.className = 'container';
    container.style.flexDirection = 'column';
    container.id = 'spinner-container';


    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'spinner';
    spinner.innerHTML = `
    <span>Loading...</span>
        <div class="spinner-border" role="status">
        </div>
    `;


    container.appendChild(spinner);

    // Append the spinner to the body
    document.body.appendChild(container);
    console.log("Spinner added to the page.");
});

// CSS for the spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;

        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: opacity 0.3s ease-in-out;
    }
    .spinner-border {
        width: 3rem;
        height: 3rem;
        border-width: 0.25em;
    }
    .spinner-border::after {
        content: '';
        display: block;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 0.2em solid transparent;
        border-color: #007bff transparent #007bff transparent;
        animation: spinner-border 1.5s linear infinite;
    }
    @keyframes spinner-border {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
