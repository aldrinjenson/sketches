class Wall {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  show() {
    strokeWeight(3);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
  getPos() {
    return createVector(this.start, this.end);
  }
}
