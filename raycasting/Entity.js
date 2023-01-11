class Entity {
  constructor(x = width / 2, y = height / 2) {
    this.rays = [];
    this.x = x;
    this.y = y;
    for (let angle = 0; angle < 360; angle += 30) {
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
      let closestDist = Infinity;
      let closestPt = null;
      for (let wall of walls) {
        const intersectingPt = ray.lookAt(wall.getPos());
        if (intersectingPt) {
          const dis = dist(this.x, this.y, intersectingPt.x, intersectingPt.y);
          if (dis < closestDist) {
            closestDist = dis;
            closestPt = intersectingPt;
          }
        }
        console.log({ closestPt });

        if (closestPt) {
          stroke(255, 100);
          line(this.x, this.y, closestPt.x, closestDist.y);
        }
      }
    }
  }
}
