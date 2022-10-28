/// <reference path="lib/p5.global-mode.d.ts" />
"use strict";

const grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let players = ["X", "O"];
let human, ai
let currPlayer = "X"; // first player
let boxHeight, boxWidth;
function setup() {
  if (random() < 0.5) {
    human = "X"
    ai = 'O'
  } else {
    human = "O"
    ai = "X"
  }
  console.log({ human, ai, currPlayer });
  angleMode(DEGREES);
  createCanvas(400, 400, P2D);
  background(200);
  boxWidth = width / 3;
  boxHeight = height / 3;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) { }
  }
}

let playerIndex = 0;
const letterStrokeWeight = 10;
let hasPlayerWon = false;
let isGameOver = false;
let message = "";

let usedPairs = new Set();
const generateRandomPair = () => {
  let randomI = floor(random(grid.length - 1));
  let randomJ = floor(random(grid[0].length - 1));

  return randomI, randomJ;
};

const updateStatus = () => {
  isGameOver = checkGameOver(grid);
  if (checkPlayerWin(grid)) {
    hasPlayerWon = true;
    let playerWhoWon = "AI";
    if (currPlayer === human) {
      playerWhoWon = "Human";
    }
    message = `Game Over!!\nPlayer ${playerWhoWon} has won!`;
  } else if (isGameOver) {
    // isGameOver = true;
    message =
      "Game Over!!\nNo other possible moves available! Refresh the page to continue again";
  }
  currPlayer = players[playerIndex];
};

function nextTurn() {
  let availablePairs = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") {
        availablePairs.push([i, j]);
      }
    }
  }

  if (!availablePairs.length) return;
  // let randomIndex = floor(random(availablePairs.length));
  // const newPair = availablePairs[randomIndex];
  const newPair = random(availablePairs)
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
  }
  frameRate(3);
  if (currPlayer === ai) {
    console.log("inside");
    nextTurn(); //
  }
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
