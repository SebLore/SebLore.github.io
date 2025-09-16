#version 300 es
struct Vertex{
    vec2 position;
    vec4 color;
};

in vec2 a_position;
in vec4 a_color;

out Vertex v_vertex;

void main(){
    v_vertex.position=a_position;
    v_vertex.color=a_color;
    gl_Position=vec4(a_position,0.,1.);
}
