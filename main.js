let canvas = document.getElementById("canvas");

function getShaderFromUrl(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.setRequestHeader('Cache-Control', 'no-cache');
    req.send(null);
    return req.responseText;
}

let vs = getShaderFromUrl("shader.vert");
let fs = getShaderFromUrl("shader.frag");

let gl;
let programInfo;
let bufferInfo;
let textures;

let iterations = 50;
let center = [0.5, 0.5];
let scale = 0;
let angle = 0;

let urlParams = new URLSearchParams(window.location.search);

let url = urlParams.get("url") || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/540px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";

let img = new Image()
img.src = url
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    init(url)
}

img.onerror = () => {
    window.location.search = '';
}

function init(url) {
    gl = canvas.getContext("webgl");

    programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    textures = twgl.createTextures(gl, {
        image: {
            src: url,
            flipY: 1,
        }
    }, (err, textures, imgs) => {
        console.log(err, textures, imgs)
        window.requestAnimationFrame(draw);
    });
}

const arrays = {
    position:  {
        data: [
            1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
            -1.0, -1.0,
        ],
        numComponents: 2,
    },
};

function draw() {
    let uniforms = {
        u_image: textures.image,
        resolution: [gl.canvas.width, gl.canvas.height],
        iterations: iterations,
        center: center,
        scale: scale,
        angle: angle,
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);
}

let centerSelector = document.getElementById("center");

let dragging = false;

function mousePos(event) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX / canvas.width;
    let y = (event.clientY - rect.top) * scaleY / canvas.height;
    y = 1 - y;
    return {
        x: x,
        y: y,
    };
}

canvas.addEventListener("mousedown", e => {
    if (e.button == 0) {
        centerSelector.style.top = `${e.clientY + window.scrollY}px`;
        centerSelector.style.left = `${e.clientX + window.scrollX}px`;
        dragging = true;

        let pos = mousePos(e);
        center[0] = pos.x;
        center[1] = pos.y;

        centerSelector.classList.remove("hidden");

        window.requestAnimationFrame(draw);
    }
})

canvas.addEventListener("mousemove", e => {
    if (dragging) {
        centerSelector.style.top = `${e.clientY + window.scrollY}px`;
        centerSelector.style.left = `${e.clientX + window.scrollX}px`;

        let pos = mousePos(e);
        center[0] = pos.x;
        center[1] = pos.y;

        window.requestAnimationFrame(draw);
    }
})

canvas.addEventListener("mouseup", e => {
    dragging = false;
    centerSelector.classList.add("hidden");
})


let scaleSlider = document.getElementById("scale");

scaleSlider.addEventListener("input", e => {
    scale = parseFloat(scaleSlider.value);
    scaleNumber.value = scale;
    window.requestAnimationFrame(draw);
})

let scaleNumber = document.getElementById("scaleNumber");

scaleNumber.addEventListener("input", e => {
    scale = parseFloat(scaleNumber.value);
    scaleSlider.value = scale;
    window.requestAnimationFrame(draw);
})

let angleSlider = document.getElementById("angle");

angleSlider.addEventListener("input", e => {
    angle = parseFloat(angleSlider.value);
    angleNumber.value = angle;
    window.requestAnimationFrame(draw);
})

let angleNumber = document.getElementById("angleNumber");

angleNumber.addEventListener("input", e => {
    angle = parseFloat(angleNumber.value);
    angleSlider.value = angle;
    window.requestAnimationFrame(draw);
})

let iterationSlider = document.getElementById("iterations");

iterationSlider.addEventListener("input", e => {
    iterations = parseFloat(iterationSlider.value);
    iterationNumber.value = iterations;
    window.requestAnimationFrame(draw);
})

let iterationNumber = document.getElementById("iterationsNumber");


iterationNumber.addEventListener("input", e => {
    iterations = parseFloat(iterationNumber.value);
    iterationSlider.value = iterations;
    window.requestAnimationFrame(draw);
})

let urlForm = document.getElementById("urlform");
let urlInput = document.getElementById("url");

urlForm.addEventListener("submit", e => {
    e.preventDefault();
    window.location.search = `?url=${urlInput.value}`;
})