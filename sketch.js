/// <reference path="lib/p5.global-mode.d.ts" />
"use strict";

const grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let boxHeight, boxWidth;
let currPlayer = undefined
function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400, P2D);
  background(200);
  boxWidth = width / 3;
  boxHeight = height / 3;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
    }
  }
}

let players = ["X", "O"];
let playerIndex = 0;
const letterStrokeWeight = 10;
let hasPlayerWon = false;
let playerWhoWon = undefined;
let isGameOver = false;
let message = "";

let usedPairs = new Set();
const generateRandomPair = () => {
  let randomI = floor(random(grid.length - 1));
  let randomJ = floor(random(grid[0].length - 1));

  return randomI, randomJ;
};

const updateStatus = () => {
  if (checkPlayerWin(grid)) {
    hasPlayerWon = true;
    playerWhoWon = currPlayer;
    message = `Game Over!!\nPlayer ${playerWhoWon} has won!`;
  } else if (checkGameOver(grid)) {
    isGameOver = true;
    message =
      "Game Over!!\nNo other possible moves available! Refresh the page to continue again";
  }
};

function autoUpdateGrid() {
  let availablePairs = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") {
        availablePairs.push([i, j]);
      }
    }
  }

  if (!availablePairs.length) return;
  let randomIndex = floor(random(availablePairs.length));
  const newPair = availablePairs[randomIndex];
  const [i, j] = newPair;

  currPlayer = players[playerIndex];
  grid[i][j] = currPlayer;
  playerIndex = (playerIndex + 1) % players.length;

  updateStatus();
}

function draw() {
  stroke("black");
  plotGrid(grid, boxHeight, boxWidth);
  if (message) {
    createP(message);
    noLoop();
    return;
  }
  frameRate(1);
  autoUpdateGrid(); //
}

function mousePressed() {
  if (hasPlayerWon || isGameOver) return;
  let i = floor(mouseX / boxWidth);
  let j = floor(mouseY / boxHeight);
  if (grid[i][j] !== "") return; // exit if cell is already filled

  currPlayer = players[playerIndex];
  grid[i][j] = currPlayer;
  playerIndex = (playerIndex + 1) % players.length;

  updateStatus();
}
