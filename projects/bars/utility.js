
/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * 
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
function shuffle(array) {
    if (!Array.isArray(array)){ 
        console.error("Input is not an array.");
        return;
    }
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * 
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random integer between min and max.
 */
function getRandomInt(min, max) {
    if (min > max) {
        console.error("Min cannot be greater than max");
        return;
    }
    
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an array of n numbers evenly distributed in the range [min, max]
 * 
 * @param {number} n - The number of elements in the array.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 */

function generateStepArray(n, min, max) {
    let array = [];
    const step = Math.abs(max - min) / n;
    for (let i = 0; i < n; i++) {
        array.push(min + i * step);
    }
    return array;
} 

/**
 * Debounces a function, ensuring it is only called once within the specified delay.
 * 
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttles a function, ensuring it is only called at most once within the specified interval.
 * 
 * @param {Function} func - The function to throttle.
 * @param {number} interval - The interval in milliseconds.
 * @returns {Function} - The throttled function.
 */
function throttle(func, interval) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}