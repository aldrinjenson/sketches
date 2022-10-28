/// <reference path="lib/p5.global-mode.d.ts" />

"use strict";

let boxHeight, boxWidth
function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400, P2D);
  background(200);
  boxWidth = width / 3
  boxHeight = height / 3
}

let grid = [
  ['X', 'O', 'X'],
  ['O', 'O', 'X'],
  ['X', 'X', 'X'],
]

const letterStrokeWeight = 10
function draw() {
  stroke('black')
  strokeWeight(2)
  line(0, boxHeight, width, boxHeight)
  line(0, boxHeight * 2, width, boxHeight * 2)
  line(boxWidth, 0, boxWidth, height)
  line(boxWidth * 2, 0, boxWidth * 2, height)

  strokeWeight(letterStrokeWeight)
  textSize(40)
  textAlign(CENTER)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const el = grid[i][j]
      let textX = (i * boxWidth) + boxWidth / 2
      let textY = (j * boxHeight) + (boxHeight / 2) + letterStrokeWeight * 2
      text(el, textX, textY);
    }
  }

}