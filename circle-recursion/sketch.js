/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

function setup() {
  createCanvas(400, 400, P2D);
  background(0);
  stroke(0, 255, 0);
  noFill();
}

function draw() {
  translate(width / 2, height / 2);
  drawCircle(0, 0, 500);
}

let dx = 123;
const drawCircle = (x, y, radius) => {
  ellipse(x, y, radius);
  if (radius > 10) {
    let newRadius = radius / 2;
    drawCircle(x - dx, y, newRadius);
    drawCircle(x + dx, y, newRadius);
    // drawCircle(x - newRadius, y, newRadius);
    drawCircle(x, y + dx, newRadius);
    drawCircle(x, y - dx, newRadius);
  }
};
