let position;
let velocity;

function setup() {
  createCanvas(600, 400);
  stroke(0);
  position = createVector(width / 2, height / 2);
  velocity = createVector(5, 7.5);
  background(200);
}

function draw() {
  ellipse(position.x, position.y, 30);
  position.add(velocity);

  if (position.x > width || position.x < 0) {
    velocity.x = velocity.x *= -1;
  }
  if (position.y > height || position.y < 0) {
    velocity.y = velocity.y *= -1;
  }
  let choice = random();
  if (choice < 0.01) {
    console.log("changing");
    velocity.x = velocity.x + random(0.5);
  }
}
