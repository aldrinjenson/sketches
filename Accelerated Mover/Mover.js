const MAX_SPEED = 15;
let accelerationType;

let accelerationMode = "Constant";

function handleSelectChange(e) {
  const newVal = e.target.value;
  accelerationMode = newVal;
}

let t = 5;
class Mover {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector();
    // this.acceleration = createVector(-0.001, 0.01);
    this.acceleration = createVector();
  }
  update() {
    if (accelerationMode === "Constant") {
      this.acceleration = createVector(-0.001, 0.01);
    } else if (accelerationMode === "Random") {
      this.acceleration = p5.Vector.random2D(); // random unit vector
      this.acceleration.mult(0.5); // to make the value a bit smaller than 1
    } else if (accelerationMode === "Perlin") {
      let n = noise(t);
      t += 0.001;
      this.acceleration = createVector(n, n);
      this.acceleration.mult(0.01); // to make the value a bit smaller than 1
    }
    this.velocity.add(this.acceleration);
    this.velocity.limit(MAX_SPEED);
    this.position.add(this.velocity);
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  show() {
    fill(127);
    stroke(10);
    ellipse(this.position.x, this.position.y, 48);
    text(`Acceleration type = ${accelerationMode}`, 10, height - 55);
    text(
      `Acceleration Magnitude = ${round(this.acceleration.mag(), 2)}`,
      10,
      height - 40
    );
    text(`Current speed = ${round(this.velocity.mag(), 2)}`, 10, height - 25);
    text(`Max speed = ${round(MAX_SPEED)}`, 10, height - 10);
  }
}
