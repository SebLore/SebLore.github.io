

// Initialize WebGL
const canvas = document.getElementById("glCanvas");
if (!canvas)
    document.createElement("canvas", "id=glCanvas width=800 height=500");
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
                gl_Position = vec4(a_position.x, a_position.y, 0, 1.0);
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
let metaballsShader = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(metaballsShader);

// debugging: shaders to draw the grid
const gridVS = `
    attribute vec2 a_position;
    
    void main(){
        gl_Position = vec4(a_position, 0, 1.0);
    }`;

const gridFS = `
    precision mediump float;

    void main(){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
    }
    `;

let gridShader = createProgram(gl, gridVS, gridFS);


// debugging: draw the circle with pixels in the fragment shader
const circleVS = `
        attribute vec2 a_position;
        varying vec2 v_uv;

        void main() {
            v_uv = (a_position + 1.0) * 0.5; // Convert from clip-space to [0,1]
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
        `

const circleFS = `
        precision mediump float;

        uniform vec2 u_center;       // Ring center in [0, 1] UV space
        uniform float u_innerRadius;
        uniform float u_outerRadius;
        uniform vec3 u_color;

        varying vec2 v_uv;

        void main() {
            float dist = distance(v_uv, u_center);

            if (dist < u_innerRadius || dist > u_outerRadius) {
                discard; // Outside ring — skip this pixel
            }

            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `

let ringShader = createProgram(gl, circleVS, circleFS);

function newFrame() {
    gl.clearColor(135 / 255, 206 / 255, 235 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}