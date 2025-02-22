document.addEventListener('DOMContentLoaded', () => {
    // Create a WebGL context
    const canvas = document.getElementById('canvas');
    if(!canvas) {
        console.error('Canvas not found');
        return;
    }
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
    }
    
    // Create a shader program
    
});