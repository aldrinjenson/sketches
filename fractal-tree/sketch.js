/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

let rotateAngle = 0;
let angleSlider;
function setup() {
  createCanvas(400, 400);
  angleSlider = createSlider(0, TWO_PI, PI / 4, 0.01);
}

function draw() {
  background(50);
  stroke(0, 255, 0);
  translate(width / 2, height - 40);
  branch(100, 10, 1);
  frameRate(2);
  rotateAngle = angleSlider.value();
  // angleSlider.value((rotateAngle + 0.1) % 180);
}

const branch = (len, strokeWt, colorFactor = 1) => {
  if (len > 4) {
    strokeWeight(strokeWt + 0.7);
    line(0, 0, 0, -len);
    translate(0, -len);
    push();
    stroke(0, 255 * colorFactor, 10);
    stroke(10, 255, 20);
    rotate(rotateAngle);
    branch(0.67 * len, strokeWt * 0.3, colorFactor * 0.8);
    pop();
    push();
    stroke(255 * colorFactor, 0, 10);
    rotate(-rotateAngle);
    branch(0.67 * len, strokeWt * 0.9, colorFactor * 0.5);
    pop();
    push();
    stroke(0, 0, 255 * colorFactor);
    rotate(-rotateAngle + 77);
    branch(0.67 * len, strokeWt * 0.2, colorFactor * 0.3);
    pop();
  }
};
