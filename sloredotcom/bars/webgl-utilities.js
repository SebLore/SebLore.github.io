function initializeWebGL(canvasid) {
    if (canvasid === null) {
        document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.id = "glCanvas";
        canvas.width = 800;
        canvas.height = 600;
    }

    var canvas = document.getElementById(canvasid);
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL not supported!");
        return null;
    }
    return gl;
}

async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Failed to load shader: ${url}`);
        return null;
    }
    return await response.text();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}