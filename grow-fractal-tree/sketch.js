/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

let root;
let len;
let branches = [];
let leaves = [];
let angleSlider;
let cloudX;
function setup() {
  createCanvas(600, 600);
  cloudX = width / 2;
  angleSlider = createSlider(0, PI, PI / 4, 0, 1);
  len = 170;
  root = new Branch(
    createVector(width / 2, height),
    createVector(width / 2, height - len)
  );
  // root.finished = true;
  branches.push(root);
  createP("Try clicking with your mouse");
}

let generation = 0;
function mousePressed() {
  for (let i = branches.length - 1; i >= 0; i--) {
    if (!branches[i].finished) {
      branches[i].finished = true;
      let newBranches = branches[i].branch();
      branches.push(...newBranches);
    }
  }
  generation++;
  if (generation % 5 === 0) {
    stroke("red");
    for (const branch of branches) {
      if (!branch.finished) {
        const leaf = branch.end.copy();
        leaves.push(leaf);
      }
    }
  }
}

function draw() {
  background(50);
  stroke(0, 255, 0);
  ellipse(cloudX, 20 + random(-4, 4), 20 + random(10));
  cloudX -= random(-4, 4);

  let shouldSway = random() < 0.2;
  for (let i = 0; i < branches.length; i++) {
    branches[i].show();
    branches[i].updateAngle(angleSlider.value());
    if (shouldSway) {
      // console.log("in random");
      // console.log(random());
      branches[i].sway(random(-1, 3));
    }
  }
  for (let leaf of leaves) {
    stroke("red");
    ellipse(leaf.x, leaf.y, 10);
    leaf.y += random(0, 4);
  }
}
