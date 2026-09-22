p5.disableFriendlyErrors = true;

let canvas;
let guitarModel;
let guitarTexture;
let guitarShader;
let guitarRotation = 0;
let guitarRotationX = 0;
let guitarRotationY = 0.3;

const guitarVertexShader = `
  precision mediump float;
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    vec4 position = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
  }
`;

const guitarFragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vTexCoord;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 distanceFromCenter = vTexCoord - center;
    float distance = length(distanceFromCenter);
    float wave = sin(distance * 42.0 - uTime * 3.0);
    float ring = smoothstep(0.72, 0.98, wave) * smoothstep(0.62, 0.0, distance);
    vec2 rippleOffset = normalize(distanceFromCenter + vec2(0.0001)) * ring * 0.018;
    vec4 wood = texture2D(uTexture, vTexCoord + rippleOffset);
    wood.rgb += vec3(ring * 0.22);
    gl_FragColor = wood;
  }
`;

function preload() {
  guitarModel = loadModel("img/acoustic-guitar.obj");
  guitarTexture = loadImage("img/guitar-texture.svg");
}

function setup() {
  const guitarBox = document.querySelector(".guitar-entry");
  canvas = createCanvas(guitarBox.clientWidth, guitarBox.clientHeight, WEBGL);
  canvas.parent(guitarBox);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  frameRate(20);
  guitarShader = createShader(guitarVertexShader, guitarFragmentShader);
}

function draw() {
  background("white");
  guitarRotationX += 0.04;


  push();
  translate(0, 40, 55);
  rotateY(guitarRotationX);
  rotateZ(PI + sin(guitarRotationY) * -2.6);
  scale(24);

  noStroke();
  shader(guitarShader);
  guitarShader.setUniform("uTexture", guitarTexture);
  guitarShader.setUniform("uTime", frameCount / 20.0);
  model(guitarModel);
  resetShader();

  // Simple foreground details give the low-poly mesh its musical landmarks.
  push();
  translate(0, -0.15, 0.34);
  fill(35, 22, 17);
  ellipse(0, 0, 0.72, 0.72);
  noFill();
  stroke(212, 145, 72, 220);
  strokeWeight(0.035);
  ellipse(0, 0, 0.9, 0.9);
  pop();

  push();
  translate(0, -0.93, 0.35);
  fill(70, 36, 20);
  box(0.95, 0.16, 0.04);
  pop();

  push();
  translate(0, 2.8, 0.22);
  fill(132, 68, 31);
  box(0.42, 2.8, 0.12);
  pop();

  push();
  translate(0, 2.6, 0.31);
  fill(58, 32, 21);
  box(0.34, 3.05, 0.04);
  pop();

  push();
  translate(0, 4.28, 0.31);
  fill(155, 83, 39);
  box(0.68, 0.58, 0.14);
  pop();

  // Fret markers and six tuning machines add scale to the neck.
  noStroke();
  fill(220, 178, 105);
  for (const fret of [2.15, 2.75, 3.35, 3.85]) {
    push();
    translate(0, fret, 0.4);
    sphere(0.055, 8, 4);
    pop();
  }

  for (const pegY of [4.08, 4.28, 4.48]) {
    for (const side of [-1, 1]) {
      push();
      translate(side * 0.48, pegY, 0.4);
      rotateZ(HALF_PI);
      fill(75, 45, 28);
      cylinder(0.035, 0.22, 8, 1);
      pop();

      push();
      translate(side * 0.63, pegY, 0.4);
      fill(210, 170, 100);
      sphere(0.09, 8, 4);
      pop();
    }
  }

  pop();
}

function windowResized() {
  const guitarBox = document.querySelector(".guitar-entry");
  resizeCanvas(guitarBox.clientWidth, guitarBox.clientHeight);
}
