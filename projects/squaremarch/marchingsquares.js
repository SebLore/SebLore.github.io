// external: smooth min function by Inigo Quilez, to make the circles blend smoothly
// https://github.com/glslify/glsl-smooth-min
// original article: https://iquilezles.org/articles/smin/

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.elapsed = 0.0;

    this.implicitFunction = function (x, y) {
        return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) - this.r;
    }

    this.intersect = function (x0, y0, x1, y1) {
        let dx = x1 - x0; // delta x
        let dy = y1 - y0; // delta y
        let dr = Math.sqrt(dx ** 2 + dy ** 2); // length of the line segment
        let D = x0 * y1 - x1 * y0; // determinant of the line segment
        let discriminant = this.r ** 2 * dr ** 2 - D ** 2;

        if (discriminant < 0)
            return [];

        let x = (D * dy + Math.sign(dy) * dx * Math.sqrt(discriminant)) / dr ** 2;
        let y = (-D * dx + Math.abs(dy) * Math.sqrt(discriminant)) / dr ** 2;
        return [x, y];
    }

    this.getIntersections = function (x0, y0, x1, y1) {
        let intersections = this.intersect(x0, y0, x1, y1);
        if (intersections.length === 0) return [];
        let t = (intersections[0] - x0) / (x1 - x0);
        if (t < 0 || t > 1) return [];
        return [intersections];
    }

    this.getNormal = function (x, y) {
        return [x - this.x, y - this.y];
    }

    this.update = function (dt) {
        const speed = 1.0;
        this.elapsed += dt;
        this.elapsed %= 2 * Math.PI; // wrap around
        this.x = Math.sin(this.elapsed) * this.r;
        this.y = Math.cos(this.elapsed) * this.r;
    }
}
/**
 * Marching Squares Algorithm
 */

// Initialize WebGL
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported");
    throw new Error("WebGL not supported");
}

const max_width = canvas.height = window.innerHeight * 0.8;
const max_height = canvas.width = window.innerHeight * 0.8;
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// WebGL Shader Programs
const vertexShaderSource = `
            attribute vec2 a_position;

            varying float v_distance;
            void main() {
                v_distance = length(a_position);
                gl_Position = vec4(a_position, 0, 1);
            }
        `;

const fragmentShaderSource = `
            precision mediump float;

            varying float v_distance;
            void main() {
                float d = smoothstep(0.0, 1.0, v_distance);
                vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), d);
                gl_FragColor = vec4(color, 1.0);
            }
        `;
let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

/**
 * Initialize circles, grid and marching squares
 */
const circles = [];
circles.push(new Circle(-0.3, 0.6, 0.3));
circles.push(new Circle(0.3, -0.3, 0.3));
circles.push(new Circle(0.0, 0.3, 0.3));

circles[0].update = function (dt) {
    const seconds = 1.5; //
    this.elapsed += seconds * dt;
    this.elapsed %= 2 * Math.PI; // wrap around
    this.y = Math.sin(this.elapsed) * this.r;
}
circles[1].update = function (dt) {
    const seconds = 2.0; //
    this.elapsed += seconds * dt;
    this.elapsed %= 2 * Math.PI; // wrap around
    this.x = Math.sin(this.elapsed) * this.r;
}


/* *
 * Signed distance to the interior of an axis‐aligned
 * square of half‐size L (i.e. from –L..+L in x and y).
 *
 * Returns <0 inside the box, >0 outside.
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

// get the input elements

let resolutionInput = document.getElementById("res");
let smoothnessInput = document.getElementById("smoothness");
let boundsSizeInput = document.getElementById("box-size");

// Generate marching squares segments
let gridSize = parseInt(resolutionInput?.value, 10) || 32;
let BOUND = parseFloat(boundsSizeInput?.value, 10) || 0.3;
let K_SMOOTH = parseFloat(smoothnessInput?.value, 10) || 0.2;

let step = 2 / gridSize;
let vertices = [];
let fillVertices = [];

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
    const ds = circles.map(c => c.implicitFunction(x, y));
    if (ds.length === 0)
        return Infinity;

    // use the first element as the seed, then union‐blend the rest
    let d = ds[0];
    for (let i = 1; i < ds.length; i++) {
        d = smoothMin(d, ds[i], K_SMOOTH);
    }

    // finally blend with the outside box
    return Math.max(d, boxSDF(x, y, BOUND));
    // return smoothIntersection(d, boxSDF(x, y, BOUND), K_BOUND);
}


const CORNER_TO_EDGE = {
  "0-1": 0,  "1-2": 1,  "2-3": 2,  "3-0": 3
};

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

// grid
// Generates a scalar grid of size gridSize x gridSize
// and fills it with the implicit function values
// for each cell
let gridCells = [];
function buildGrid() {
    gridCells.length = 0;
    step = 2 / gridSize;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let x0 = -1 + i * step, x1 = x0 + step;
            let y0 = -1 + j * step, y1 = y0 + step;
            gridCells.push({
                corners: [
                    [x0, y0],
                    [x1, y0],
                    [x0, y1],
                    [x1, y1],
                ]
            });
        }
    }
}
buildGrid();

// Lookup table for cases
const EDGES = {
    1: [0, 3], 2: [0, 1], 3: [1, 3],
    4: [1, 2], 5: [0, 1, 2, 3], 6: [0, 2],
    7: [2, 3], 8: [2, 3], 9: [0, 2],
    10: [0, 1, 2, 3], 11: [1, 2],
    12: [1, 3], 13: [0, 1], 14: [0, 3]
};

function generateLineVertices() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Calculate the corners of the grid cell
            let x0 = -1 + i * step, x1 = x0 + step;
            let y0 = -1 + j * step, y1 = y0 + step;
            let corners = [
                [x0, y0], [x1, y0], [x1, y1], [x0, y1]
            ];
            let values = corners.map(([x, y]) => implicitFunction(x, y));

            let caseIndex = values.map(v => (v < 0 ? 1 : 0)).reduce((acc, v, idx) => acc + v * (1 << idx), 0);

            // check if the case index is in the edge table
            if (EDGES[caseIndex] !== undefined) {
                let e = EDGES[caseIndex];
                for (let k = 0; k < e.length; k += 2) {
                    let p1 = interpolate(corners[e[k]], corners[(e[k] + 1) % 4], values[e[k]], values[(e[k] + 1) % 4]);
                    let p2 = interpolate(corners[e[k + 1]], corners[(e[k + 1] + 1) % 4], values[e[k + 1]], values[(e[k + 1] + 1) % 4]);
                    vertices.push(...p1, ...p2);
                }
            }
        }
    }
};
function generateFillVertices() {
  const tris = [];
  const ORDER = [0, 1, 3, 2];  // BL, BR, TR, TL in clockwise order

  gridCells.forEach(cell => {
    const vals   = cell.corners.map(([x,y]) => implicitFunction(x,y));
    const inside = vals.map(v => v < 0);

    // fully outside?
    if (inside.every(b => !b)) return;

    // fully inside: emit two tris for the whole cell
    if (inside.every(b => b)) {
      const [BL, BR, TL, TR] = cell.corners;
      // (BL,BR,TR) & (BL,TR,TL)
      tris.push(
        BL[0], BL[1],  BR[0], BR[1],  TR[0], TR[1],
        BL[0], BL[1],  TR[0], TR[1],  TL[0], TL[1]
      );
      return;
    }

    // partial: build the contour polygon in correct order
    let poly = [];
    for (let i = 0; i < 4; i++) {
      const c0 = ORDER[i], c1 = ORDER[(i+1)%4];

      if (inside[c0]) {
        poly.push(cell.corners[c0]);
      }
      if (inside[c0] !== inside[c1]) {
        poly.push(interpolate(
          cell.corners[c0], 
          cell.corners[c1],
          vals[c0], 
          vals[c1]
        ));
      }
    }

    // fan‐triangulate this convex polygon
    for (let i = 1; i + 1 < poly.length; i++) {
      tris.push(
        poly[0][0],  poly[0][1],
        poly[i][0],  poly[i][1],
        poly[i+1][0],poly[i+1][1]
      );
    }
  });

  return tris;
}

// generateFillVertices();

// regenerate vertices per frame
function updateVertices() {
    vertices = [];
    generateLineVertices();
}

function updateFillVertices(){
    fillVertices = generateFillVertices();
    console.log(fillVertices.length / 6,"triangles");
}

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

let positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

var lastUpdate = Date.now();

function deltaTime() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    dt *= 0.001; // convert to seconds
    return dt;
}

function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    dt = deltaTime();
    circles.forEach(c => c.update(dt));

    // updateVertices();
    updateFillVertices();

    // update the buffer with the new vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        // new Float32Array(vertices),
        new Float32Array(fillVertices),
        gl.DYNAMIC_DRAW
    );
    // unbind the buffer to avoid accidental changes
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // gl.drawArrays(gl.LINES, 0, vertices.length / 2);
    gl.drawArrays(gl.TRIANGLES, 0, fillVertices.length / 2);

    requestAnimationFrame(draw);
}
draw();

/**
 * Event listeners and controls
 */

// resolution change
resolutionInput.addEventListener("input", () => {
    gridSize = parseInt(resolutionInput?.value, 10) || 32;
    step = 2 / gridSize;
    buildGrid();
    updateFillVertices();
    // updateVertices();
});

// change smoothness

smoothnessInput.addEventListener("input", () => {
    K_SMOOTH = parseFloat(smoothnessInput.value);
    updateFillVertices();
    // updateVertices();
});

// change size of bounds
boundsSizeInput.addEventListener("input", () => {
    BOUND = parseFloat(boundsSizeInput.value);
    updateFillVertices();
    // updateVertices();
});

// toggle draw bounds
let boundsInput = document.getElementById("bounds");
// create if not exist
if (!boundsInput) {
    boundsInput = document.createElement("input");
    boundsInput.type = "checkbox";
    boundsInput.id = "bounds";
    boundsInput.checked = drawBounds;
    document.body.appendChild(boundsInput);
}
boundsInput.addEventListener("change", () => {
    drawBounds = boundsInput.checked;
    updateFillVertices();
    // updateVertices();
});