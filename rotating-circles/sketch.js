// Three rotating circles in a triangle. Each circle carries evenly spaced points on its
// edge. Point i on one circle is joined by a line to point i on each of the other two
// circles, so every pair of circles gets its own colored set of lines.
// With equal speeds the pattern turns rigidly; give the circles different speeds and
// the lines start to twist and weave.
//
// Keys: T = trails, P = show/hide points, R = reset angles and speeds, Space = pause.

const circles = [
  { name: 'top', angle: 0 },
  { name: 'bottom left', angle: 0 },
  { name: 'bottom right', angle: 0 },
];

// Line colors per pair of circles.
const pairs = [
  { a: 0, b: 1, color: '#ff6b6b' }, // top <-> bottom left
  { a: 1, b: 2, color: '#4ecdc4' }, // bottom left <-> bottom right
  { a: 2, b: 0, color: '#ffd166' }, // bottom right <-> top
];

const DEFAULT_SPEED = 1;
let speedSliders = [];
let pointsSlider, offsetSlider;
let trails = false;
let showPoints = true;
let paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildUI();
}

function draw() {
  background(11, 13, 18, trails ? 25 : 255);

  const n = pointsSlider.value();
  const R = min(width, height) * 0.17;
  const centers = layout(R);

  if (!paused) {
    circles.forEach((c, i) => (c.angle += speedSliders[i].value() * 0.01));
  }

  // Positions of each circle's points this frame.
  // Each circle's points start offset by a multiple of the offset slider, so the
  // lines don't all start out parallel.
  const pts = circles.map((c, ci) => {
    const list = [];
    for (let k = 0; k < n; k++) {
      const a = c.angle + (TWO_PI * k) / n + ci * radians(offsetSlider.value());
      list.push(createVector(centers[ci].x + R * cos(a), centers[ci].y + R * sin(a)));
    }
    return list;
  });

  // Lines between matching points, one color per pair of circles.
  strokeWeight(1.2);
  for (const p of pairs) {
    const col = color(p.color);
    col.setAlpha(170);
    stroke(col);
    for (let k = 0; k < n; k++) {
      line(pts[p.a][k].x, pts[p.a][k].y, pts[p.b][k].x, pts[p.b][k].y);
    }
  }

  // The circles themselves.
  noFill();
  stroke(255, 60);
  strokeWeight(1.5);
  for (const c of centers) circle(c.x, c.y, R * 2);

  // The points on each circumference.
  if (showPoints) {
    noStroke();
    fill(255);
    for (const list of pts) for (const v of list) circle(v.x, v.y, 6);
  }
}

// Equilateral triangle of centers: one top center, two along the bottom.
function layout(R) {
  const cx = width / 2;
  const cy = height / 2 + R * 0.25;
  const d = min(width, height) * 0.33; // distance from triangle center to each circle
  return [
    createVector(cx, cy - d),
    createVector(cx - d * cos(PI / 6), cy + d * sin(PI / 6)),
    createVector(cx + d * cos(PI / 6), cy + d * sin(PI / 6)),
  ];
}

function keyPressed() {
  const k = key.toLowerCase();
  if (k === 't') trails = !trails;
  if (k === 'p') showPoints = !showPoints;
  if (k === 'r') resetAll();
  if (key === ' ') paused = !paused;
}

function resetAll() {
  circles.forEach(c => (c.angle = 0));
  speedSliders.forEach(s => {
    s.value(DEFAULT_SPEED);
    s.elt.dispatchEvent(new Event('input'));
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addSlider(parent, label, lo, hi, val, step, swatch) {
  const row = createElement('label').parent(parent);
  const text = createSpan('').parent(row);
  const s = createSlider(lo, hi, val, step).parent(row);
  const render = () => text.html(`${swatch ? `<span class="sw" style="background:${swatch}"></span>` : ''}${label} ${s.value()}`);
  s.input(render);
  render();
  return s;
}

function buildUI() {
  const ui = select('#ui');
  speedSliders = circles.map(c => addSlider(ui, `${c.name} speed`, -5, 5, DEFAULT_SPEED, 0.1));
  pointsSlider = addSlider(ui, 'points', 2, 60, 12, 1);
  offsetSlider = addSlider(ui, 'offset°', 0, 180, 0, 1);
  const legend = createDiv('').parent(ui).class('hint');
  legend.html(pairs.map(p => `<span class="sw" style="background:${p.color}"></span>${circles[p.a].name} ↔ ${circles[p.b].name}`).join('<br>'));
  createDiv('T trails · P points · R reset · space pause').parent(ui).class('hint');
}
