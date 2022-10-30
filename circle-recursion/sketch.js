/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

let dxSlider;
let radiusSlider;
let halvingSlider;
let dx;
function setup() {
  createCanvas(400, 400, P2D);
  background(0);
  stroke(0, 255, 0);
  noFill();
  dxSlider = createSlider(2, 4, 2, 0.05);
  radiusSlider = createSlider(2, 1000, 200);
}

function draw() {
  translate(width / 2, height / 2);
  background(0);
  drawCircle(0, 0, radiusSlider.value());
}

const drawCircle = (x, y, rad) => {
  ellipse(x, y, rad);
  let newRad = rad / dxSlider.value();
  if (newRad > 2) {
    stroke("green");
    drawCircle(x + newRad, y, newRad);
    stroke("red");
    drawCircle(x - newRad, y, newRad);
    stroke("yellow");
    drawCircle(x, y + newRad, newRad);
    // stroke("blue");
    // drawCircle(x, y - newRad, newRad);
  }
};
