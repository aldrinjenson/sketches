/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

let walls = [];
let entity;
function setup() {
  createCanvas(400, 400);
  entity = new Entity(mouseX, mouseY);
  stroke(0, 255, 0);
  noFill();
  for (let i = 0; i < 4; i++) {
    let start = createVector(random(0, width), random(0, height));
    let end = createVector(random(0, width), random(0, height));
    let newWall = new Wall(start, end);
    walls.push(newWall);
  }
}

function draw() {
  background(60);
  for (let wall of walls) {
    wall.show();
  }
  entity.show();
  entity.update(mouseX, mouseY);
  entity.showRays(walls);
}
