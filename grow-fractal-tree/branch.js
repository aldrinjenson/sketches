// let angle = 45;
class Branch {
  constructor(start, end, angle = PI / 4) {
    this.begin = start;
    this.end = end;
    this.angle = angle;
  }
  show() {
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }
  branch() {
    // let angle = angleSlider.value();
    let dir = p5.Vector.sub(this.end, this.begin);
    if (dir.mag() < 3) return [];
    dir.mult(0.67);
    dir.rotate(this.angle);
    const newEnd = p5.Vector.add(this.end, dir);
    const b1 = new Branch(this.end, newEnd);
    dir.rotate(-2 * this.angle);
    const b2 = new Branch(this.end, p5.Vector.add(this.end, dir));
    return [b1, b2];
  }
  jiggle() {
    this.begin.x += random(-1, 1);
    this.end.x += random(-1, 1);
  }

  updateAngle(ang) {}
  sway(amount) {
    // this.begin.x -= amount;
    // this.end.x -= amount;
  }
}
