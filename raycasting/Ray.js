class Ray {
  constructor(startX, startY, angle) {
    this.angle = angle;
    this.pos = { x: startX, y: startY };
    this.dir = p5.Vector.fromAngle(angle);
    this.dir.mult(10);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10, this.dir.y * 10);
    pop();
  }
  update(startX, startY) {
    this.pos = { x: startX, y: startY };
    // this.dir.x = 50 + this.pos.x;
    // this.dir.y = 50 + this.pos.y;
  }
  lookAt({ x: wallPosStart, y: wallPosEnd }) {
    const x1 = wallPosStart.x;
    const y1 = wallPosStart.y;
    const x2 = wallPosEnd.x;
    const y2 = wallPosEnd.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    const doesLineIntersects = t > 0 && t < 1 && u > 0;

    if (doesLineIntersects) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);

      push();
      // translate(this.pos.x, this.pos.y);
      // line(0, 0, pt.x, pt.y);
      pop();
    }
  }
}
