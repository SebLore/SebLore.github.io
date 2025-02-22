/**
 * Contains the sorting algoritms used in the bars section of the website.
 */

/**
 * Sorts the given array using the bubble sort algorithm.
 * @param {Array} array The array to sort.
 *  

 */
export async function bubbleSort(array) {
    let n = array.length;
    let swapped = false;

    do {
        swapped = false;

        for (let i = 0; i < n - 1; i++) {
            if (array[i] > array[i + 1]) {
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swapped = true;
            }
        }

        n--;
    } while (swapped);

    return array;
}

/* 
* Sorts the given array using the bubble sort algorithm by one step.
* @param {Array} array The array to sort.
* @param {Number} step The current index of the object being sorted
* @returns {Array} The array with the single index sorted.
*/
export async function bubbleSortStep(array, step) {
    let n = array.length;
    let swapped = false;

    for (let i = 0; i < n - 1; i++) {
        if (array[i] > array[i + 1]) {
            let temp = array[i];
            array[i] = array[i + 1];
            array[i + 1] = temp;
            swapped = true;
        }
    }

    return { array: array, swapped: swapped };
}

// Bubble Sort Animation
window.bubbleSort = async function bubbleSort() {
    let swapped;
    sorting = true;
    do {
        swapped = false;
        for (let i = 0; i < bars.length - 1; i++) {
            // set the active bar to be a highlighted color
            bars[i].color = [1.0, 0.0, 1.0, 1.0]; // orange
            if (bars[i].height > bars[i + 1].height) {
                [bars[i], bars[i + 1]] = [bars[i + 1], bars[i]];
                swapped = true;
                drawBars();
                await new Promise(resolve => setTimeout(resolve, speed)); // Animation delay
            }
            // reset the color at the end
            bars[i].color = [0.3, 0.3, 0.3, 1.0]; //
            if (sorting == false)
                break;
        }
        bars[bars.length - 1].color = [0.3, 0.3, 0.3, 1.0]; // reset the color at the end
    } while (swapped && sorting);
    drawBars();
    console.log("Bubble Sort completed");
};