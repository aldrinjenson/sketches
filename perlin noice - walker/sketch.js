function setup() {
  createCanvas(600, 300);
  background(200);
}

let tx = 0.1;
let ty = 0.451;

function draw() {
  let noicex = noise(tx);
  let noicey = noise(ty);
  let x = map(noicex, 0, 1, 0, width);
  let y = map(noicey, 0, 1, 0, height);
  tx += 0.01;
  ty += 0.01;

  let r = map(noicex, 0, 1, 0, 255);
  let g = map(noicex, 0, 1, 0, 255);
  console.log(r, g);

  // fill(r, g, 40);
  stroke(r, g, random(0, 255));
  strokeWeight(2);
  ellipse(x, y, 2);
}
