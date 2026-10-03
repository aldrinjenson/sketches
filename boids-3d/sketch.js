// 3D flocking. Drag on the canvas to orbit the camera, scroll to zoom.
// F switches the mouse to placing obstacles: a click drops a sphere where the cursor
// meets the vertical plane through the box's center, facing you.
// Keys: F = orbit/obstacles mode, C = clear obstacles, A = add 25 boids,
// O = auto-orbit, D = debug, B = toggle box, R = reset, Space = pause.

let flock = [];
let obstacles = [];
let mode = 'orbit'; // what the mouse does: 'orbit' or 'obstacles'
let cam;
let orbitAngle = 0;
let params = {
  separation: 1.5,
  alignment: 1.0,
  cohesion: 1.0,
  walls: 2.0,
  perception: 60,
  separationDist: 25,
  boxSize: 300,   // half-width of the cube the boids live in
  wallMargin: 60, // how close to a wall before they start turning back
  avoid: 3,
  avoidMargin: 40,
  obstacleSize: 50,
};
let autoOrbit = true;
let debug = false;
let showBox = true;
let paused = false;
let countLabel, modeLabel, uiEl;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  cam = createCamera();
  cam.camera(0, -250, 1100, 0, 0, 0, 0, 1, 0);
  buildUI();
  reset();
}

function reset() {
  flock = [];
  addBoids(200);
}

function addBoids(n) {
  const h = params.boxSize * 0.8;
  for (let i = 0; i < n; i++) flock.push(new Boid(random(-h, h), random(-h, h), random(-h, h)));
}

function draw() {
  background(225, 35, 6);

  // Don't rotate the camera while the mouse is dragging a slider.
  if (mode === 'orbit' && !overUI()) orbitControl(1, 1, 0.1);
  if (autoOrbit && !paused) orbitAngle += 0.003;
  rotateY(orbitAngle);

  ambientLight(0, 0, 35);
  directionalLight(0, 0, 100, 0.4, 0.8, -0.6);
  noStroke();

  drawObstacles();
  if (!paused) for (const b of flock) b.run(flock, params, obstacles);
  for (const b of flock) b.show();

  if (showBox) drawBox();
  if (debug && flock.length) drawDebug(flock[0]);

  countLabel.html(`${flock.length} boids · ${nf(frameRate(), 2, 0)} fps`);
}

function drawObstacles() {
  for (const o of obstacles) {
    push();
    translate(o.pos.x, o.pos.y, o.pos.z);
    fill(15, 50, 70);
    sphere(o.r, 24, 16);
    if (debug) {
      noFill();
      stroke(15, 60, 90, 20);
      sphere(o.r + params.avoidMargin, 12, 8);
    }
    pop();
  }
}

// Turn a click into a 3D point. Cast a ray from the camera through the cursor,
// intersect it with the plane through the box's center that faces the camera,
// then undo the auto-orbit rotation so the point is in the boids' own coordinates.
function mouseToWorld() {
  const eye = createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
  const forward = createVector(cam.centerX, cam.centerY, cam.centerZ).sub(eye).normalize();
  const up = createVector(cam.upX, cam.upY, cam.upZ);
  const down = p5.Vector.sub(up, p5.Vector.mult(forward, up.dot(forward))).normalize(); // p5's y points down the screen
  const right = p5.Vector.cross(forward, down).normalize();
  const tanY = tan(cam.cameraFOV / 2);
  const tanX = tanY * cam.aspectRatio;
  const nx = (mouseX / width) * 2 - 1;
  const ny = (mouseY / height) * 2 - 1;
  const dir = forward.copy().add(p5.Vector.mult(right, nx * tanX)).add(p5.Vector.mult(down, ny * tanY));
  const t = -eye.dot(forward) / dir.dot(forward);
  const q = p5.Vector.add(eye, dir.mult(t));
  const c = cos(orbitAngle), s = sin(orbitAngle);
  const p = createVector(q.x * c - q.z * s, q.y, q.x * s + q.z * c);
  const h = params.boxSize;
  return createVector(constrain(p.x, -h, h), constrain(p.y, -h, h), constrain(p.z, -h, h));
}

function mousePressed() {
  if (overUI() || mode !== 'obstacles') return;
  obstacles.push({ pos: mouseToWorld(), r: params.obstacleSize });
}

function updateModeLabel() {
  modeLabel.html(`mouse: <b>${mode === 'orbit' ? 'orbit camera' : 'place obstacles'}</b> (F to switch)`);
}

function drawBox() {
  push();
  noFill();
  stroke(220, 20, 60, 35);
  box(params.boxSize * 2);
  pop();
}

function drawDebug(b) {
  push();
  translate(b.position.x, b.position.y, b.position.z);
  noFill();
  stroke(50, 90, 100, 25);
  sphere(params.perception, 12, 8);
  pop();
  push();
  stroke(50, 90, 100, 60);
  for (const o of flock) {
    if (o !== b && p5.Vector.dist(b.position, o.position) < params.perception) {
      line(b.position.x, b.position.y, b.position.z, o.position.x, o.position.y, o.position.z);
    }
  }
  pop();
}

function overUI() {
  const r = uiEl.elt.getBoundingClientRect();
  return winMouseX >= r.left && winMouseX <= r.right && winMouseY >= r.top && winMouseY <= r.bottom;
}

function keyPressed() {
  const k = key.toLowerCase();
  if (k === 'f') { mode = mode === 'orbit' ? 'obstacles' : 'orbit'; updateModeLabel(); }
  if (k === 'c') obstacles = [];
  if (k === 'a') addBoids(25);
  if (k === 'o') autoOrbit = !autoOrbit;
  if (k === 'd') debug = !debug;
  if (k === 'b') showBox = !showBox;
  if (k === 'r') reset();
  if (key === ' ') paused = !paused;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buildUI() {
  uiEl = select('#ui');
  const sliders = [
    ['separation', 0, 4, 0.1],
    ['alignment', 0, 4, 0.1],
    ['cohesion', 0, 4, 0.1],
    ['walls', 0, 5, 0.1],
    ['perception', 10, 200, 1],
    ['separationDist', 5, 100, 1],
    ['avoid', 0, 8, 0.1],
    ['avoidMargin', 5, 120, 1],
    ['obstacleSize', 10, 150, 1],
  ];
  for (const [name, lo, hi, step] of sliders) {
    const row = createElement('label').parent(uiEl);
    const text = createSpan(`${name} ${params[name]}`).parent(row);
    const s = createSlider(lo, hi, params[name], step).parent(row);
    s.input(() => {
      params[name] = s.value();
      text.html(`${name} ${params[name]}`);
    });
  }
  countLabel = createDiv('').parent(uiEl).class('hint');
  modeLabel = createDiv('').parent(uiEl).class('hint');
  updateModeLabel();
  createDiv('drag = orbit · scroll = zoom').parent(uiEl).class('hint');
  createDiv('F orbit/obstacles · C clear · A add · O auto-orbit · D debug · B box · R reset · space pause').parent(uiEl).class('hint');
}
