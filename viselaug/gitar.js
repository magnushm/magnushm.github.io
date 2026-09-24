const createGuitarSketch = (guitarBox) => (p) => {
  let guitarModel;
  let guitarTexture;
  let guitarShader;
  let guitarRotationY = 0.3;
  let guitarRotationX = 0;

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

  p.preload = () => {
    guitarModel = p.loadModel("img/acoustic-guitar.obj");
    guitarTexture = p.loadImage("img/guitar-texture.svg");
  };

  p.setup = () => {
    const canvas = p.createCanvas(guitarBox.clientWidth, guitarBox.clientHeight, p.WEBGL);
    canvas.parent(guitarBox);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
    p.frameRate(20);
    guitarShader = p.createShader(guitarVertexShader, guitarFragmentShader);
  };

  p.draw = () => {
    p.background("white");
    guitarRotationX += 0.04;


    p.push();
    p.translate(0, 40, 55);
    p.rotateY(guitarRotationX);
    p.rotateZ(p.PI + p.sin(guitarRotationY) * -2.6);
    p.scale(24);

    p.noStroke();
    p.shader(guitarShader);
    guitarShader.setUniform("uTexture", guitarTexture);
    guitarShader.setUniform("uTime", p.frameCount / 20.0);
    p.model(guitarModel);
    p.resetShader();

  // Simple foreground details give the low-poly mesh its musical landmarks.
    p.push();
    p.translate(0, -0.15, 0.34);
    p.fill(35, 22, 17);
    p.ellipse(0, 0, 0.72, 0.72);
    p.noFill();
    p.stroke(212, 145, 72, 220);
    p.strokeWeight(0.035);
    p.ellipse(0, 0, 0.9, 0.9);
    p.pop();

    p.push();
    p.translate(0, -0.93, 0.35);
    p.fill(70, 36, 20);
    p.box(0.95, 0.16, 0.04);
    p.pop();

    p.push();
    p.translate(0, 2.8, 0.22);
    p.fill(132, 68, 31);
    p.box(0.42, 2.8, 0.12);
    p.pop();

    p.push();
    p.translate(0, 2.6, 0.31);
    p.fill(58, 32, 21);
    p.box(0.34, 3.05, 0.04);
    p.pop();

    p.push();
    p.translate(0, 4.28, 0.31);
    p.fill(155, 83, 39);
    p.box(0.68, 0.58, 0.14);
    p.pop();

  // Fret markers and six tuning machines add scale to the neck.
    p.noStroke();
    p.fill(220, 178, 105);
    for (const fret of [2.15, 2.75, 3.35, 3.85]) {
      p.push();
      p.translate(0, fret, 0.4);
      p.sphere(0.055, 8, 4);
      p.pop();
    }

    for (const pegY of [4.08, 4.28, 4.48]) {
      for (const side of [-1, 1]) {
        p.push();
        p.translate(side * 0.48, pegY, 0.4);
        p.rotateZ(p.HALF_PI);
        p.fill(75, 45, 28);
        p.cylinder(0.035, 0.22, 8, 1);
        p.pop();

        p.push();
        p.translate(side * 0.63, pegY, 0.4);
        p.fill(210, 170, 100);
        p.sphere(0.09, 8, 4);
        p.pop();
      }
    }

    p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(guitarBox.clientWidth, guitarBox.clientHeight);
  };
};

const guitarStage = document.getElementById("guitar-stage");
if (guitarStage) {
  new p5(createGuitarSketch(guitarStage));
}
