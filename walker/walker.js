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
    //// non-uniform distribution
    // let p = random(1);
    // console.log(p);
    // if (p < 0.4) {
    //   this.x++;
    // } else if (p < 0.6) {
    //   this.x--;
    // } else if (p < 0.8) {
    //   this.y++;
    // } else {
    //   this.y--;
    // }

    // uniform distribution
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
