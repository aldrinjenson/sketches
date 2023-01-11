class Entity {
  constructor(x = width / 2, y = height / 2) {
    this.rays = [];
    this.x = x;
    this.y = y;
    for (let angle = 0; angle < 360; angle += 10) {
      const newRay = new Ray(x, y, angle);
      this.rays.push(newRay);
    }
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    ellipse(this.x, this.y, 10);
  }

  showRays(walls) {
    for (let ray of this.rays) {
      ray.update(this.x, this.y);
      for (let wall of walls) {
        ray.lookAt(wall.getPos());
      }
    }
  }
}
