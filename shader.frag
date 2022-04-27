precision mediump float;

uniform vec2 resolution;

uniform sampler2D u_image;

uniform int iterations;

uniform vec2 center;

uniform float scale;

uniform float angle;

vec2 rotate(vec2 vector, float angle) {
    return vec2(
        vector.x * cos(radians(angle)) - vector.y * sin(radians(angle)),
        vector.x * sin(radians(angle)) + vector.y * cos(radians(angle))
    );
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec4 color = vec4(0.0);

    // float angle = 10.0;

    // int iterations = 100;

    vec2 pos = uv;

    // float scale = 0.2;

    // vec2 center = vec2(0.5, .7);

    vec2 offset = (uv - center) * -1.0 * scale;

    for (int i = 0; i < 1000; i++) {
        if (i == iterations) {
            break;
        }
        vec4 sample = texture2D(u_image, pos);
        color += sample * ((float(iterations) - float(i)) / float(iterations));
        pos += offset / float(iterations);
        pos = rotate((pos - center) * resolution, angle / float(iterations)) / resolution + center;
    }

    color /= float(iterations) / 2.0 + .5;

    gl_FragColor = color;

}