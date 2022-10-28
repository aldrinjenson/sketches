/// <reference path="lib/p5.global-mode.d.ts" />
"use strict";

const grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let players = ["X", "O"];
let human, ai;
let currPlayer = "X"; // first player
let boxHeight, boxWidth;

function setup() {
  human = "X";
  ai = "O";
  // if (random() < 0.5) {
  //   human = "X";
  //   ai = "O";
  // } else {
  //   human = "O";
  //   ai = "X";
  // }
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
let isTieGame = false;
let message = "";

let usedPairs = new Set();
const generateRandomPair = () => {
  let randomI = floor(random(grid.length - 1));
  let randomJ = floor(random(grid[0].length - 1));

  return randomI, randomJ;
};

const updateStatus = () => {
  let winner = null
  let winnerName = ''
  if (checkPlayerWin(grid, human)) {
    winnerName = "Human";
    winner = human
    message = `Game Over!!\nPlayer ${winnerName} has won!`;
  } else if (checkPlayerWin(grid, ai)) {
    winnerName = "AI";
    winner = ai
    message = `Game Over!!\nPlayer ${winnerName} has won!`;
  } else if (checkTieGame(grid)) {
    winner = 'tie'
    message =
      "Game Over!!\nNo other possible moves available! Refresh the page to continue again";
  }
  currPlayer = players[playerIndex];
  return winner
};

function nextBestTurn() {
  let availablePairs = [];
  let maxScore = -Infinity;
  let bestPair = undefined;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {

      if (grid[i][j] === "") {

        grid[i][j] = ai;
        let score = miniMax(grid, 0, false);
        console.log({ score });

        if (score >= maxScore) {
          maxScore = score;
          bestPair = [i, j];
        }
        availablePairs.push([i, j]);
        grid[i][j] = ''
      }
    }
  }

  if (!availablePairs.length) return;
  const [i, j] = bestPair;
  currPlayer = players[playerIndex];
  grid[i][j] = currPlayer;
  playerIndex = (playerIndex + 1) % players.length;

  // updateStatus();
}

const scoreMap = {
  X: 1,
  O: -1,
  tie: 0,
};

let maxDepth = 10
const miniMax = (board, depth, shouldMaximise) => {
  let winner = updateStatus()
  console.log(board[0]);

  // console.log({ human, ai, winner });
  console.log({ winner });
  if (depth === maxDepth) {
    console.log('max depth reached');
    return
  }


  if (winner !== null) {
    const score = scoreMap[winner];
    console.log('returning score = ', score);

    return score;
  }
  // if (depth % 2 == 0)
  //   board[0, 0] = 'X'
  // else
  //   board[0, 0] = 'O'
  // miniMax(board, depth + 1, false)
  // // return 1

  let bestScore = 0;
  // console.log('here');

  if (shouldMaximise) {
    bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === "") {
          board[i][j] = ai;
          let score = miniMax(board, depth + 1, false);
          bestScore = max(score, bestScore);
          board[i][j] = "";
        }
      }
    }
  }
  else {
    bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === "") {
          board[i][j] = human;
          let score = miniMax(board, depth + 1, true);
          bestScore = min(score, bestScore);
          board[i][j] = "";
        }
      }
    }
  }

  return bestScore;
};


function draw() {
  stroke("black");
  plotGrid(grid, boxHeight, boxWidth);
  if (message) {
    createP(message);
    noLoop();
    console.log(grid);

  }
  frameRate(3);
  if (currPlayer === ai) {
    nextBestTurn();
  }
}

function mousePressed() {
  if (hasPlayerWon || isTieGame) return;
  let i = floor(mouseX / boxWidth);
  let j = floor(mouseY / boxHeight);
  if (grid[i][j] !== "") return; // exit if cell is already filled

  currPlayer = players[playerIndex];
  grid[i][j] = currPlayer;
  playerIndex = (playerIndex + 1) % players.length;

  updateStatus();
}
