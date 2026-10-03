// A Boid, following Daniel Shiffman's The Nature of Code, chapter 5 (Autonomous Agents),
// which itself follows Craig Reynolds' 1986 "Boids" model.
//
// Every boid is a "vehicle": it has position, velocity and acceleration, and it steers
// using Reynolds' formula:  steering force = desired velocity - current velocity,
// capped at maxforce. Flocking is just three such steering forces added together.

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().setMag(random(2, 4));
    this.acceleration = createVector(0, 0);
    this.r = 4;          // size, for drawing
    this.maxspeed = 3;   // how fast it can go
    this.maxforce = 0.05; // how sharply it can turn
    this.hue = random(170, 230);
  }

  run(boids, params, obstacles) {
    this.flock(boids, params);
    this.applyForce(this.avoid(obstacles, params.avoidMargin).mult(params.avoid));
    this.update();
    this.pushOutOf(obstacles);
    this.wrapEdges();
    this.show();
  }

  applyForce(force) {
    // Newton's second law with mass = 1: acceleration accumulates forces.
    this.acceleration.add(force);
  }

  flock(boids, p) {
    const sep = this.separate(boids, p.separationDist);
    const ali = this.align(boids, p.perception);
    const coh = this.cohesion(boids, p.perception);

    // Weighting the three rules is where the "personality" of the flock comes from.
    sep.mult(p.separation);
    ali.mult(p.alignment);
    coh.mult(p.cohesion);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // forces are recomputed fresh every frame
  }

  // Reynolds' steering: go toward a target at full speed, but only turn by maxforce.
  seek(target) {
    const desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  // OBSTACLE AVOIDANCE: a fourth steering force, built like separation.
  // Within avoidMargin of an obstacle's surface, steer straight away from its center,
  // harder the closer the boid is.
  avoid(obstacles, margin) {
    const sum = createVector(0, 0);
    let count = 0;
    for (const o of obstacles) {
      const away = p5.Vector.sub(this.position, o.pos);
      const gap = away.mag() - o.r; // distance to the obstacle's edge
      if (gap < margin) {
        away.setMag(1 / max(gap, 1));
        sum.add(away);
        count++;
      }
    }
    if (count === 0) return createVector(0, 0);
    sum.setMag(this.maxspeed);
    return p5.Vector.sub(sum, this.velocity).limit(this.maxforce);
  }

  // Safety net: steering can't always turn in time, so never let a boid sit inside one.
  pushOutOf(obstacles) {
    for (const o of obstacles) {
      const away = p5.Vector.sub(this.position, o.pos);
      if (away.mag() < o.r) this.position = p5.Vector.add(o.pos, away.setMag(o.r));
    }
  }

  // Rule 1 - SEPARATION: steer away from neighbors that are too close.
  // Closer neighbors push harder (the difference vector is divided by distance).
  separate(boids, desiredSeparation) {
    const sum = createVector(0, 0);
    let count = 0;
    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);
      if (other !== this && d > 0 && d < desiredSeparation) {
        const diff = p5.Vector.sub(this.position, other.position);
        diff.normalize().div(d);
        sum.add(diff);
        count++;
      }
    }
    if (count === 0) return createVector(0, 0);
    sum.setMag(this.maxspeed);
    return p5.Vector.sub(sum, this.velocity).limit(this.maxforce);
  }

  // Rule 2 - ALIGNMENT: steer toward the average heading of nearby boids.
  align(boids, neighborDist) {
    const sum = createVector(0, 0);
    let count = 0;
    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);
      if (other !== this && d < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count === 0) return createVector(0, 0);
    sum.setMag(this.maxspeed);
    return p5.Vector.sub(sum, this.velocity).limit(this.maxforce);
  }

  // Rule 3 - COHESION: steer toward the average position (center) of nearby boids.
  cohesion(boids, neighborDist) {
    const sum = createVector(0, 0);
    let count = 0;
    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);
      if (other !== this && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }
    if (count === 0) return createVector(0, 0);
    sum.div(count);
    return this.seek(sum);
  }

  wrapEdges() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // Draw a little triangle pointing in the direction of motion.
  show() {
    const angle = this.velocity.heading() + HALF_PI;
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    noStroke();
    fill(this.hue, 70, 95);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
}
