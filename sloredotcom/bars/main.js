
document.addEventListener("DOMContentLoaded", () => {

    // WebGL context and program
    var gl, program;
    // animation parameters
    var sorting = false;
    var animSpeed = 500 - document.getElementById("speedControl").value;

    // bar parameters
    var n = 50; // Default number of bars
    const minHeight = -0.9; // Minimum height of bars
    const maxHeight = 0.9; // Maximum height of bars

    // colors
    const activeBarColor = [0.5, 0.0, 0.5, 1.0]; // Magenta halved
    const defaultBarColor = [0.3, 0.3, 0.3, 1.0]; // Gray

    // Initialize bars array globally
    var bars = [];

    function setUpAttributesAndBuffers() {
        const positionAttribLocation = gl.getAttribLocation(program, "a_position");
        const colorAttribLocation = gl.getAttribLocation(program, "a_color");

        const { vertices, colors, indices } = getBarVertices();

        // Position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);  // GL_STATIC_DRAW
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // Color buffer
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);  // GL_STATIC_DRAW
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

        // Index buffer (for drawElements)
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    async function initializeShaders() {
        const vertexShaderPath = document.getElementById("vertex-shader").getAttribute("data-shader-path");
        const fragmentShaderPath = document.getElementById("fragment-shader").getAttribute("data-shader-path");

        const vertexShaderSource = await loadShaderSource(vertexShaderPath);
        const fragmentShaderSource = await loadShaderSource(fragmentShaderPath);

        if (!vertexShaderSource || !fragmentShaderSource) {
            console.error("Error loading shader sources.");
            return;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);
        setUpAttributesAndBuffers();
        drawBars();  // Call drawBars only after the shaders are initialized

        // return program;
    }

    function initializeBars(bars, n, minHeight, maxHeight, defaultBarColor) {
        let heights = generateStepArray(n, minHeight, maxHeight);
        for (let i = 0; i < n; i++) {
            let normalizedHeight = i / (n);
            let color = defaultBarColor; // gray
            bars.push({
                height: minHeight + normalizedHeight * (maxHeight - minHeight),
                color: color
            });
        }
    }

    function getBarVertices(bars, n, maxHeight) {
        let vertices = [];
        let colors = [];
        const barWidth = 2 / n - (maxHeight / n); // Bar width with spacing
        const indices = [];

        bars.forEach((bar, i) => {
            let x = (i / n) * 2 - 0.99; // Normalize x position (-0.99 to 0.99)
            let height = bar.height;

            // Rectangle vertices (two triangles)
            vertices.push(
                x, -1,               // Bottom left
                x + barWidth, -1,    // Bottom right
                x, height,           // Top left

                x, height,           // Top left
                x + barWidth, -1,    // Bottom right
                x + barWidth, height // Top right
            );

            // Assign color to each vertex (6 vertices per bar)
            colors.push(...Array(6).fill(bar.color).flat());

            // Define indices for two triangles per bar
            const baseIndex = i * 6; // Each bar has 6 indices (2 triangles)
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex + 3, baseIndex + 4, baseIndex + 5);
        });

        return { vertices: new Float32Array(vertices), colors: new Float32Array(colors), indices: new Uint16Array(indices) };
    }

    function setUpAttributesAndBuffers() {
        const positionAttribLocation = gl.getAttribLocation(program, "a_position");
        const colorAttribLocation = gl.getAttribLocation(program, "a_color");

        const { vertices, colors, indices } = getBarVertices(bars, n, maxHeight);

        // Position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);  // GL_STATIC_DRAW
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // Color buffer
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);  // GL_STATIC_DRAW
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

        // Index buffer (for drawElements)
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    function generateBarVertices(minHeight, maxHeight, n) {
        let vertices = [];
        let colors = [];
        const barWidth = 2 / n - (maxHeight / n); // Bar width with spacing
        const indices = [];

        bars.forEach((bar, i) => {
            let x = (i / n) * 2 - 0.99; // Normalize x position (-0.99 to 0.99)
            let height = bar.height;

            // Rectangle vertices (two triangles)
            vertices.push(
                x, -1,               // Bottom left
                x + barWidth, -1,    // Bottom right
                x, height,           // Top left

                x, height,           // Top left
                x + barWidth, -1,    // Bottom right
                x + barWidth, height // Top right
            );

            // Assign color to each vertex (6 vertices per bar)
            colors.push(...Array(6).fill(bar.color).flat());

            // Define indices for two triangles per bar
            const baseIndex = i * 6; // Each bar has 6 indices (2 triangles)
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex + 3, baseIndex + 4, baseIndex + 5);
        });

        return { vertices: new Float32Array(vertices), colors: new Float32Array(colors), indices: new Uint16Array(indices) };
    }

    function drawBars() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const { vertices, colors, indices } = getBarVertices(bars, n, maxHeight);

        // Position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // GL_STATIC_DRAW

        const positionAttribLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // Color buffer
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW); // GL_STATIC_DRAW
        const colorAttribLocation = gl.getAttribLocation(program, "a_color");
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

        // Create and bind the index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Draw the bars using the index buffer
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    // Bubble Sort Animation
    window.sortAnim = async function bubbleSort() {
        console.log("Bubble Sort started");
        let swapped;
        sorting = true;
        do {
            swapped = false;
            for (let i = 0; i < bars.length - 1; i++) {
                // set the active bar to be a highlighted color
                bars[i].color = activeBarColor; // magenta
                if (bars[i].height > bars[i + 1].height) {
                    [bars[i], bars[i + 1]] = [bars[i + 1], bars[i]];
                    swapped = true;
                    drawBars(gl);
                    await new Promise(resolve => setTimeout(resolve, animSpeed)); // Animation delay
                }
                // reset the color at the end
                bars[i].color = defaultBarColor; //
                if (sorting == false)
                    break;
            }
            bars[bars.length - 1].color = defaultBarColor; // reset the color at the end
        } while (swapped && sorting);
        // when finished, go through the array again and set all colors to magenta,
        // sequentially, then reset them all to gray
        for (let i = 0; i < bars.length; i++) {
            bars[i].color = activeBarColor; // magenta
            drawBars(gl);
            await new Promise(resolve => setTimeout(resolve, animSpeed)); // Animation delay
        }

        drawBars(gl);
        console.log("Bubble Sort completed");
    };
    
    gl = initializeWebGL("glCanvas");
    if(!gl) {
        console.error("WebGL not supported!");
        return;
    }

    function main() {

        // Initialize everything
        initializeBars(bars, n, minHeight, maxHeight, defaultBarColor);
        shuffle(bars);

        initializeShaders();
        // .then((program) => {
        //     if (!program) {
        //         console.error("Failed to initialize shaders.");
        //         return;
        //     }
        // });


        // Controls

        var shuffleButton = document.getElementById("shuffleButton");
        if (shuffleButton) {
            shuffleButton.addEventListener("click", () => {
                sorting = false;
                shuffle(bars);
                // make sure all bars are grey
                bars.forEach(bar => bar.color = defaultBarColor);
                drawBars(gl);
            });
        } else {
            console.log("Shuffle button not found.");
        };
        var speedControl = document.getElementById("speedControl");
        if (speedControl) {
            speedControl.addEventListener("input", (event) => {
                animSpeed = 500 - event.target.value; // Inverse relationship (higher value = faster)
            });
        } else {
            console.log("Speed control not found.");
        }

        document.getElementById("setBarCountButton").addEventListener("click", () => {
            if (sorting)
                sorting = false;
            const newCount = parseInt(document.getElementById("barCountInput").value);
            if (newCount >= 10 && newCount <= 2000) {
                n = newCount;
                bars = [];
                initializeBars(bars, n, minHeight, maxHeight);
                shuffle(bars);
                drawBars(gl);
            }
        });

        document.getElementById("stopButton").addEventListener("click", () => {
            sorting = false;
        });
    }
    main();
});
