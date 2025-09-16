// external: smooth min function by Inigo Quilez, to make the circles blend smoothly
// https://github.com/glslify/glsl-smooth-min
// original article: https://iquilezles.org/articles/smin/

/**
 * Initialize circles, grid and marching squares
 */
const circles = [];
function InitializeCircles() {
    // create circles
    circles.push(new Circle(-0.3, 0.6, 0.4));

    // // define update functions for each circle
    // circles[0].update = function (dt) {
    //     const seconds = 1.5; //
    //     this.elapsed += seconds * dt;
    //     this.elapsed %= 2 * Math.PI; // wrap around
    //     this.y = Math.sin(this.elapsed) * this.r;
    // }
}
InitializeCircles();
function AddCircle(x, y, r) {
    const circle = new Circle(x, y, r);
    circles.push(circle);
};

/* *
 * Signed distance to the interior of an axis‐aligned
 * square of half‐size L (i.e. from –L..+L in x and y).
 *             
 * + ---------+ 
 * |          |
 * |          |
 * |          |
 * +----------+
 * L-   0     L+
 * 
 * Returns a number < 0 if inside the box, > 0 outside.
 */
function boxSDF(x, y, L) {
    // distance outside on each axis
    const dx = Math.abs(x) - L;
    const dy = Math.abs(y) - L;
    // insideDist = min(max(dx,dy), 0)
    const insideDist = Math.min(Math.max(dx, dy), 0);
    // outsideDist = length of the “outside” vector
    const outsideDist = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
    return insideDist + outsideDist;
}
/**
 * Smooth‐intersection of two SDFs a and b.
 * Rounds the corner with radius k.
 */
function smoothIntersection(a, b, k) {
    // just invert, smooth‐union, invert back:
    return -smoothMin(-a, -b, k);
}


let resolutionInput = document.getElementById("res");
let smoothnessInput = document.getElementById("smoothness");
let boundsSizeInput = document.getElementById("box-size");

// Generate marching squares segments
let BOUND = parseFloat(boundsSizeInput?.value, 10) || 0.3;
let K_SMOOTH = parseFloat(smoothnessInput?.value, 10) || 0.2;
let gridSize = parseInt(resolutionInput?.value, 10) || 32;

// let step = BOUND gridSize;
let gridCells = makeGrid(gridSize);
let gridVertices = generateGridVertices();
let metaBallMesh = [];

const edgeVertexCache = {};
function getEdgeVertex(i, j, e, pA, pB, vA, vB) {
    const key = `${i},${j},${e}`;
    if (edgeVertexCache[key]) return edgeVertexCache[key];

    const p = interpolate(pA, pB, vA, vB);
    return edgeVertexCache[key] = p;
}

// external: smooth min function by Inigo Quilez, to make the circles blend smoothly
// blends two values a and b by a factor k
function smoothMin(a, b, k) {
    // clamp to [0,1]
    const h = Math.max(0, Math.min(1, 0.5 + 0.5 * (b - a) / k));

    // mix + subtract the smoothing term
    return (b * (1 - h) + a * h) - k * h * (1 - h);
}

var K_BOUND = 0.0; // smoothness factor, 0.0 = no smoothness, 1.0 = full smoothness
var drawBounds = true; // draw bounds
function implicitFunction(x, y) {
    // union-blend all circles
    const ds = circles.map(c => c.Implicit(x, y));
    if (ds.length === 0)
        return Infinity;

    // use the first element as the seed, then union‐blend the rest
    let d = ds[0];
    for (let i = 1; i < ds.length; i++) {
        d = smoothMin(d, ds[i], K_SMOOTH);
    }

    // finally blend with the outside box
    // return max(d, K_BOUND)
    return smoothIntersection(d, boxSDF(x, y, BOUND), K_BOUND);
}

// Interpolation function
// p1, p2: points
// v1, v2: values
// Returns the point where the line between p1 and p2 intersects the x-axis
// at the value 0.
function interpolate(p1, p2, v1, v2) {
    if (v1 === v2)
        return p1;
    const t = -v1 / (v2 - v1);
    return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
}

// buildGrid
// Generates a grid that covers the rendered area
// for each cell
function makeGrid(resolution) {
    let cells = [];
    let step = 2 / resolution;
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            let x0 = -1 + i * step,
                x1 = x0 + step;
            let y0 = -1 + j * step,
                y1 = y0 + step;
            cells.push(
                {
                    corners: [
                        [x0, y0], // bottom left
                        [x1, y0], // bottom right
                        [x1, y1], // top right
                        [x0, y1], // top left
                    ]
                });
        }
    }
    console.log(cells);
    return cells;
}


function generateGridVertices() {
    const edgeSet = new Set();

    // Collect each cell’s four edges
    gridCells.forEach(cell => {
        const [BL, BR, TR, TL] = cell.corners;
        const edges = [[BL, BR], [BR, TR], [TR, TL], [TL, BL]];
        edges.forEach(([pA, pB]) => {
            const keyAB = [...pA, ...pB].join(',');
            const keyBA = [...pB, ...pA].join(',');
            // store only one orientation per edge
            edgeSet.add(keyAB < keyBA ? keyAB : keyBA);
        });
    });

    // Flatten edges into [x,y,x,y,...]
    const verts = [];
    for (const key of edgeSet) {
        const [x1, y1, x2, y2] = key.split(',').map(Number);
        verts.push(x1, y1, x2, y2);
    }

    console.log(verts);
    return new Float32Array(verts);
}

// lookup table for all possible cases
// 0 = BL, 1 = BR, 2 = TR, 3 = TL
// original can be found here:
// https://en.wikipedia.org/wiki/Marching_squares#Case_table
const EDGES_OLD = {
    1: [0, 3],
    2: [0, 1],
    3: [1, 3],
    4: [1, 2],
    5: [0, 1, 2, 3],
    6: [0, 2],
    7: [2, 3],
    8: [2, 3],
    9: [0, 2],
    10: [0, 1, 2, 3],
    11: [1, 2],
    12: [1, 3],
    13: [0, 1],
    14: [0, 3]
};

const EDGES = {
    1: [0, 3],
    2: [0, 1],
    3: [1, 3],
    4: [1, 2],
    5: [0, 1, 2, 3],
    6: [0, 2],
    7: [2, 3],
    8: [2, 3],
    9: [0, 2],
    10: [0, 1, 2, 3],
    11: [1, 2],
    12: [1, 3],
    13: [0, 1],
    14: [0, 3]
};

const CORNERS = [
    [0, 1], // bottom: BL -> BR
    [1, 2], // right: BR -> TR
    [2, 3], // top: TR -> TL
    [3, 0]  // left: TL -> BL
];
// Precomputed tables:
/**.-
 * Generate fill vertices for all grid cells using the marching squares algorithm.
 * @returns {number[]} Flat array of triangle vertices [x1, y1, x2, y2, x3, y3, ...]
*/
// flag for debug printing info
var print_it = 1;
async function printout(...Args) {
    if (print_it === 1) {
        console.log(...Args);
    }
}

function generateMetaBallMesh() {
    // triangles
    const tris = [];

    // for each cell in the grid, sample the implicit function and determine what corners
    // of the cell are outside (<= 0) or inside (> 0) of the function.
    // printout("Grid cells", gridCells);
    for (const cell of gridCells) {
        const vals = getCornerValues(cell);
        // printout("First vals", vals);
        const inside = getInsideFlags(vals); // true if inside, false if outside
        // printout("inside flags:", inside)

        // 4-bit mask for the cell: BL=1, BR=2, TR=4, TL=8
        const mask =
            (inside[0] ? 1 : 0)
            | (inside[1] ? 2 : 0)
            | (inside[2] ? 4 : 0)
            | (inside[3] ? 8 : 0);
        // for(let i = 0; i < 4; i++)
        //     printout("mask", i, mask[i]);

        // all corners outside -> skip
        if (mask === 0)
            continue;

        // all corners inside -> add a quad with corners in cell corners
        if (mask === 15) {
            addFullCellTriangles(cell.corners, tris);
            continue;
        }

        // partial: lookup which edges are crossed
        let edgeList = EDGES[mask];
        printout("Edge list", edgeList);

        if (mask === 5 || mask === 10) {
            // sample center to choose diagonal
            const [TL, TR, BR, BL] = cell.corners;
            const cx = (BL[0] + BR[0] + TR[0] + TL[0]) * 0.25;
            const cy = (BL[1] + BR[1] + TR[1] + TL[1]) * 0.25;
            const centerVal = implicitFunction(cx, cy);
            if (mask === 5) {
                // BL & TL inside: choose bottom-left quad or top-right quad
                edgeList = (centerVal < 0) ? [3, 0] : [1, 2];
            } else {
                // BR & TR inside: choose top-right or bottom-left quad
                edgeList = (centerVal < 0) ? [1, 2] : [3, 0];
            }
        } else {
            edgeList = EDGES[mask];
        }

        // construct a polygon
        const poly = [];
        for (let e of edgeList) {
            const [cA, cB] = CORNERS[e];
            if (inside[cA]) {
                poly.push(cell.corners[cA]);
            }

            poly.push(
                interpolate(
                    cell.corners[cA],
                    cell.corners[cB],
                    vals[cA],
                    vals[cB],
                )
            );
        }
        if (computeSignedArea(poly) < 0) {
            poly.reverse();
        }

        addFanTriangles(poly, tris);
    }

    return tris;
}

/**
 * Sample the implicit function at the four corners of a cell.
 * @param {{ corners: [number, number][] }} cell
 * @returns {number[]} Array of function values at each corner
 */
function getCornerValues(cell) {
    return cell.corners.map(([x, y]) => implicitFunction(x, y));
}

/**
 * Determine which corners are inside (value <= 0).
 * @param {number[]} vals
 * @returns {boolean[]} Array of flags for each corner
 */
function getInsideFlags(vals) {
    return vals.map(v => v <= 0);
}

/**
 * Add two triangles covering the full cell when fully inside.
 * @param {[number, number][]} corners
 * @param {number[]} tris
 */
function addFullCellTriangles(corners, tris) {
    printout("corners", corners);
    printout("tris", tris);
    print_it = 0;
    const [TL, TR, BR, BL] = corners;

    tris.push(
        BL[0], BL[1],
        BR[0], BR[1],
        TR[0], TR[1],
        BL[0], BL[1],
        TR[0], TR[1],
        TL[0], TL[1]
    );
}

/**
 * Fan‐triangulate a convex polygon into triangles.
 * @param {[number, number][]} poly
 * @param {number[]} tris
 */
function addFanTriangles(poly, tris) {
    for (let i = 1; i + 1 < poly.length; i++) {
        tris.push(
            poly[0][0], poly[0][1],
            poly[i][0], poly[i][1],
            poly[i + 1][0], poly[i + 1][1],
        );
    }
}
// poly[i][0], poly[i][1],
// poly[i + 1][0], poly[i + 1][1]

/**
 * Compute the signed area of a polygon (positive if CCW).
 * @param {[number, number][]} poly
 * @returns {number}
 */
function computeSignedArea(poly) {
    let area = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % n];
        area += (x1 * y2 - x2 * y1);
    }
    return area * 0.5;
}

// regenerate vertices per frame
function updateVertices() {
    vertices = [];
    updateMetaBallVertices();
}

let printNrTriangles = 0;
function updateMetaBallVertices() {
    metaBallMesh = generateMetaBallMesh();

    if (printNrTriangles)
        console.log(metaBallMesh.length / 6, "triangles");
}

function updateGridVertices() {
    gridVertices = generateGridVertices();
}

/**
 * Returns the width and height of the first <canvas> on the page.
 * @returns {{width: number, height: number}}
 */
function getCanvasSize() {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
        throw new Error('No <canvas> element found');
    }
    return {
        width: canvas.width,
        height: canvas.height
    };
}