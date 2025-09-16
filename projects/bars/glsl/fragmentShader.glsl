#version 300 es
precision mediump float;

struct Vertex{
    vec2 position;
    vec4 color;
};

in Vertex v_vertex;
out vec4 FragColor;

void main(){
    FragColor=v_vertex.color;
}
