// A 3D Boid. The flocking rules are IDENTICAL to the 2D version in ../01-boids/boid.js:
// every vector just has a z component now, and "neighbors within a radius" means
// a sphere instead of a circle.
//
// The two genuinely new things in 3D:
//   1. containment - boids live in a box and steer back when they near a wall
//      (a fourth steering force, built exactly like the other three)
//   2. drawing - each boid's cone has to be rotated in 3D to point along its velocity

class Boid {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.velocity = p5.Vector.random3D().setMag(random(2, 4));
    this.acceleration = createVector(0, 0, 0);
    this.r = 4;
    this.maxspeed = 3;
    this.maxforce = 0.05;
    this.hue = random(170, 230);
  }

  run(boids, params, obstacles) {
    this.flock(boids, params);
    this.applyForce(this.avoid(obstacles, params.avoidMargin).mult(params.avoid));
    this.update();
    this.pushOutOf(obstacles);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(boids, p) {
    const sep = this.separate(boids, p.separationDist).mult(p.separation);
    const ali = this.align(boids, p.perception).mult(p.alignment);
    const coh = this.cohesion(boids, p.perception).mult(p.cohesion);
    const wall = this.contain(p.boxSize, p.wallMargin).mult(p.walls);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(wall);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Reynolds' steering: desired velocity minus current velocity, capped at maxforce.
  steerToward(desired) {
    desired.setMag(this.maxspeed);
    return p5.Vector.sub(desired, this.velocity).limit(this.maxforce);
  }

  seek(target) {
    return this.steerToward(p5.Vector.sub(target, this.position));
  }

  // OBSTACLE AVOIDANCE: like separation, but from spheres. Within avoidMargin of a
  // sphere's surface, steer away from its center, harder the closer the boid is.
  avoid(obstacles, margin) {
    const sum = createVector(0, 0, 0);
    let count = 0;
    for (const o of obstacles) {
      const away = p5.Vector.sub(this.position, o.pos);
      const gap = away.mag() - o.r;
      if (gap < margin) {
        sum.add(away.setMag(1 / max(gap, 1)));
        count++;
      }
    }
    return count ? this.steerToward(sum) : createVector(0, 0, 0);
  }

  // Safety net: never let a boid end up inside a sphere.
  pushOutOf(obstacles) {
    for (const o of obstacles) {
      const away = p5.Vector.sub(this.position, o.pos);
      if (away.mag() < o.r) this.position = p5.Vector.add(o.pos, away.setMag(o.r));
    }
  }

  // SEPARATION: move away from boids that are too close (closer = stronger push).
  // In 3D the push can point up or down too, so a crowded boid can dive or climb.
  separate(boids, desiredSeparation) {
    const sum = createVector(0, 0, 0);
    let count = 0;
    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);
      if (other !== this && d > 0 && d < desiredSeparation) {
        sum.add(p5.Vector.sub(this.position, other.position).normalize().div(d));
        count++;
      }
    }
    return count ? this.steerToward(sum) : createVector(0, 0, 0);
  }

  // ALIGNMENT: match the average heading of neighbors inside the perception sphere.
  align(boids, neighborDist) {
    const sum = createVector(0, 0, 0);
    let count = 0;
    for (const other of boids) {
      if (other !== this && p5.Vector.dist(this.position, other.position) < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }
    return count ? this.steerToward(sum) : createVector(0, 0, 0);
  }

  // COHESION: head for the center of neighbors inside the perception sphere.
  cohesion(boids, neighborDist) {
    const sum = createVector(0, 0, 0);
    let count = 0;
    for (const other of boids) {
      if (other !== this && p5.Vector.dist(this.position, other.position) < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }
    return count ? this.seek(sum.div(count)) : createVector(0, 0, 0);
  }

  // CONTAINMENT (Nature of Code's "stay within walls", extended to 3D):
  // near a wall, the boid wants full speed in the direction away from it on that axis,
  // while keeping its velocity on the other axes.
  contain(half, margin) {
    const desired = this.velocity.copy();
    let nearWall = false;
    for (const axis of ['x', 'y', 'z']) {
      if (this.position[axis] < -half + margin) { desired[axis] = this.maxspeed; nearWall = true; }
      if (this.position[axis] > half - margin) { desired[axis] = -this.maxspeed; nearWall = true; }
    }
    return nearWall ? this.steerToward(desired) : createVector(0, 0, 0);
  }

  // Point the cone along the velocity. p5's cone points along +y by default,
  // so rotate +y onto the velocity direction: axis = y x v, angle = acos(y . v).
  show() {
    const v = this.velocity.copy().normalize();
    const up = createVector(0, 1, 0);
    const axis = p5.Vector.cross(up, v);
    const angle = acos(constrain(up.dot(v), -1, 1));
    push();
    translate(this.position.x, this.position.y, this.position.z);
    if (axis.mag() > 1e-6) rotate(angle, axis);
    else if (v.y < 0) rotateX(PI);
    fill(this.hue, 70, 95);
    cone(this.r, this.r * 4, 6, 1);
    pop();
  }
}
