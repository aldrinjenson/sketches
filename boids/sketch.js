// Flocking - Craig Reynolds' boids, Nature of Code style.
// Click or drag to add boids. F switches the mouse to placing obstacles and back.
// Keys: F = boids/obstacles mode, C = clear obstacles, T = trails,
// D = debug one boid's neighborhood, R = reset, Space = pause.

let flock = [];
let obstacles = [];
let mode = 'boids'; // what a click does: 'boids' or 'obstacles'
let params = {
  separation: 1.5,
  alignment: 1.0,
  cohesion: 1.0,
  perception: 50,      // neighbor radius for alignment and cohesion
  separationDist: 25,  // personal space radius for separation
  avoid: 3,            // weight of obstacle avoidance
  avoidMargin: 40,     // how far from an obstacle's edge boids start turning
  obstacleSize: 40,    // radius of the next obstacle you place
};
let trails = false;
let debug = false;
let paused = false;
let countLabel, modeLabel, uiEl;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  buildUI();
  reset();
}

function reset() {
  flock = [];
  for (let i = 0; i < 150; i++) flock.push(new Boid(random(width), random(height)));
}

function draw() {
  if (paused) return;
  background(230, 30, 7, trails ? 12 : 100);

  drawObstacles();
  for (const b of flock) b.run(flock, params, obstacles);

  if (debug && flock.length) drawDebug(flock[0]);
  countLabel.html(`${flock.length} boids · ${nf(frameRate(), 2, 0)} fps`);
}

function drawDebug(b) {
  noFill();
  stroke(50, 90, 100, 60);
  circle(b.position.x, b.position.y, params.perception * 2);
  stroke(0, 90, 100, 60);
  circle(b.position.x, b.position.y, params.separationDist * 2);
  stroke(50, 90, 100, 30);
  for (const o of flock) {
    if (o !== b && p5.Vector.dist(b.position, o.position) < params.perception) {
      line(b.position.x, b.position.y, o.position.x, o.position.y);
    }
  }
}

function drawObstacles() {
  for (const o of obstacles) {
    noStroke();
    fill(15, 60, 45);
    circle(o.pos.x, o.pos.y, o.r * 2);
    if (debug) {
      noFill();
      stroke(15, 60, 80, 40);
      circle(o.pos.x, o.pos.y, (o.r + params.avoidMargin) * 2);
    }
  }
}

function overUI() {
  const r = uiEl.elt.getBoundingClientRect();
  return winMouseX >= r.left && winMouseX <= r.right && winMouseY >= r.top && winMouseY <= r.bottom;
}

function mousePressed() {
  if (overUI()) return;
  if (mode === 'obstacles') obstacles.push({ pos: createVector(mouseX, mouseY), r: params.obstacleSize });
  else flock.push(new Boid(mouseX, mouseY));
}

function mouseDragged() {
  if (overUI() || mode !== 'boids') return;
  flock.push(new Boid(mouseX, mouseY));
}

function updateModeLabel() {
  modeLabel.html(`click mode: <b>${mode === 'boids' ? 'add boids' : 'place obstacles'}</b> (F to switch)`);
}

function keyPressed() {
  if (key === 'f' || key === 'F') { mode = mode === 'boids' ? 'obstacles' : 'boids'; updateModeLabel(); }
  if (key === 'c' || key === 'C') obstacles = [];
  if (key === 't' || key === 'T') trails = !trails;
  if (key === 'd' || key === 'D') debug = !debug;
  if (key === 'r' || key === 'R') reset();
  if (key === ' ') paused = !paused;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buildUI() {
  const ui = (uiEl = select('#ui'));
  const sliders = [
    ['separation', 0, 4, 0.1],
    ['alignment', 0, 4, 0.1],
    ['cohesion', 0, 4, 0.1],
    ['perception', 10, 150, 1],
    ['separationDist', 5, 100, 1],
    ['avoid', 0, 8, 0.1],
    ['avoidMargin', 5, 120, 1],
    ['obstacleSize', 10, 150, 1],
  ];
  for (const [name, lo, hi, step] of sliders) {
    const row = createElement('label').parent(ui);
    const text = createSpan(`${name} ${params[name]}`).parent(row);
    const s = createSlider(lo, hi, params[name], step).parent(row);
    s.input(() => {
      params[name] = s.value();
      text.html(`${name} ${params[name]}`);
    });
  }
  countLabel = createDiv('').parent(ui).class('hint');
  modeLabel = createDiv('').parent(ui).class('hint');
  updateModeLabel();
  createDiv('F boids/obstacles · C clear obstacles · T trails · D debug · R reset · space pause').parent(ui).class('hint');
}
