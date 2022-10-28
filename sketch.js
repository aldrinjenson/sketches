/// <reference path="lib/p5.global-mode.d.ts" />
"use strict";

let boxHeight, boxWidth;
function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400, P2D);
  background(200);
  boxWidth = width / 3;
  boxHeight = height / 3;
}

let grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let players = ["X", "O"];
let playerIndex = 0;
const letterStrokeWeight = 10;
let hasPlayerWon = false
let playerWhoWon = undefined
let isGameOver = false



function draw() {
  stroke("black");
  plotGrid(grid, boxHeight, boxWidth)

  if (hasPlayerWon) {
    alert(`Game Over!! Player ${playerWhoWon} has won!`)
    noLoop()
    return;
  } else if (isGameOver) {
    alert(`Game Over!! No other possible moves available! Refresh the page to continue again`)
    noLoop()
    return;
  }
  console.log('drawing');


}

function mousePressed() {
  if (hasPlayerWon || isGameOver) return

  let i = floor(mouseX / boxWidth);
  let j = floor(mouseY / boxHeight);
  let currPlayer = players[playerIndex]
  if (grid[i][j] == "") {
    grid[i][j] = currPlayer
    playerIndex = (playerIndex + 1) % players.length;
    if (checkPlayerWin(grid)) {
      hasPlayerWon = true
      playerWhoWon = currPlayer
    } else if (checkGameOver(grid)) {
      isGameOver = true
    }
  }

}
