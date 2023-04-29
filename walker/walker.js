class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(
      floor(random(0, 180)),
      floor(random(90, 255)),
      floor(random(0, 255))
    );
    ellipse(this.x, this.y, 2);
  }

  step() {
    let xstep = random(-1, 1);
    let ystep = random(-1, 1);
    this.x += xstep * 2;
    this.y += ystep * 2;

    if (this.x > width || this.y > height) {
      this.x = width / 2;
      this.y = height / 2;
    }
  }
}
