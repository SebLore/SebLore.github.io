// create buffer for draw data
let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(metaBallMesh), gl.DYNAMIC_DRAW);

let meta_aPosition = gl.getAttribLocation(metaballsShader, "a_position");
gl.enableVertexAttribArray(meta_aPosition);
gl.vertexAttribPointer(meta_aPosition, 2, gl.FLOAT, false, 0, 0);

// vertices for grid
let grid_aPosition = gl.getAttribLocation(gridShader, "a_position");
gl.enableVertexAttribArray(grid_aPosition);
gl.vertexAttribPointer(grid_aPosition, 2, gl.FLOAT, false, 0, 0);


let gridBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVertices), gl.STATIC_DRAW);

const circle_aPosition = gl.getAttribLocation(ringShader, "a_position");
gl.enableVertexAttribArray(circle_aPosition);
gl.vertexAttribPointer(circle_aPosition, 2, gl.FLOAT, false, 0, 0);

// Fullscreen quad (clip space coords)
const quadVerts = new Float32Array([
    -1, -1,
    1, -1,
    1, 1,
    -1, -1,
    1, 1,
    -1, 1,
]);

const quadBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);


function DrawBalls() {     // upDate the buffer with the new vertices
    gl.useProgram(metaballsShader);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(meta_aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(metaBallMesh),
        gl.DYNAMIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLES, 0, metaBallMesh.length / 2); // divide by 2 cause vec2
}

function DrawGrid() {
    gl.useProgram(gridShader);
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
    gl.vertexAttribPointer(grid_aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(gridVertices),
        gl.DYNAMIC_DRAW
    );
    gl.drawArrays(gl.LINES, 0, gridVertices.length / 2);
}

function DrawCircles() {
    // Draw setup
    gl.useProgram(ringShader);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.vertexAttribPointer(circle_aPosition, 2, gl.FLOAT, false, 0, 0);
    // Send uniforms
    circles.forEach(c => {
        gl.uniform2f(gl.getUniformLocation(ringShader, "u_center"), (c.x + 1.0) * 0.5, (c.y + 1.0) * 0.5);
        gl.uniform1f(gl.getUniformLocation(ringShader, "u_innerRadius"), c.r * 0.5);
        gl.uniform1f(gl.getUniformLocation(ringShader, "u_outerRadius"), (c.r + 0.01) * 0.5);
        gl.uniform3f(gl.getUniformLocation(ringShader, "u_color"), 1.0, 1.0, 0.0);
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, quadVerts.length / 2);
    });

}

// gl settings
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

var drawBalls = true;
var drawGrid = true;
var drawCircles = true;
var time = new Clock;
let paused = false;

// Draw
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

function draw() {
    let dt = time.delta() * speed;

    if (!paused) {
        newFrame();
        circles.forEach(c => c.Update(dt));

        if (drawBalls) {
            updateMetaBallVertices();
            DrawBalls();
        }
        if (drawGrid) {
            DrawGrid();
        }
        if (drawCircles) {
            DrawCircles();
        }
    }
    requestAnimationFrame(draw);
}
draw(); // start the loop