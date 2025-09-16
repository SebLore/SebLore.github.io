/**
 * Contains the sorting algoritms used in the bars section of the website.
 */

/**
 * Sorts the given array using the bubble sort algorithm.
 * @param {Array} array The array to sort.
 *  

 */
// export async function bubbleSort(array) {
//     let n = array.length;
//     let swapped = false;

//     do {
//         swapped = false;

//         for (let i = 0; i < n - 1; i++) {
//             if (array[i] > array[i + 1]) {
//                 let temp = array[i];
//                 array[i] = array[i + 1];
//                 array[i + 1] = temp;
//                 swapped = true;
//             }
//         }

//         n--;
//     } while (swapped);

//     return array;
// }

function* bubbleSort(bars, opts = {}) {
    const {
        activeColor = [0.5, 0.0, 0.5, 1.0],
        defaultColor = [0.3, 0.3, 0.3, 1.0],
        finalColor = [0.5, 0.0, 0.5, 1.0]
    } = opts;

    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < bars.length - 1; i++) {
            // highlight current bar
            bars[i].color = activeColor;

            if (bars[i].height > bars[i + 1].height) {
                [bars[i], bars[i + 1]] = [bars[i + 1], bars[i]];
                swapped = true;
            }

            // yield after each comparison/swap so the animation driver can update
            yield bars.map(b => ({ ...b }));

            // reset highlight
            bars[i].color = defaultColor;
        }
    } while (swapped);

    // final highlight (like your “finished” sequence)
    for (let i = 0; i < bars.length; i++) {
        bars[i].color = finalColor;
        yield bars.map(b => ({ ...b }));
    }
}

export { bubbleSort as BubbleSort };
