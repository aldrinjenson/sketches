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
}

let playerIndex = 0;
const letterStrokeWeight = 10;
let hasPlayerWon = false;
let isTieGame = false;
let message = "";

const scoreMap = {
  X: 1,
  O: -1,
  tie: 0,
};

const minimax = (board, depth, isMax) => {
  let score = evaluate(board); // If Maximizer has won the game // return his/her evaluated score
  if (score == 10) return score; // If Minimizer has won the game // return his/her evaluated score
  if (score == -10) return score; // If there are no more moves and // no winner then it is a tie
  if (isMovesLeft(board) == false) return 0; // If this maximizer's move
  if (isMax) {
    let best = -1000; // Traverse all cells
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Check if cell is empty
        if (board[i][j] == "") {
          // Make the move
          board[i][j] = currPlayer; // Call minimax recursively // and choose the maximum value
          best = Math.max(best, minimax(board, depth + 1, !isMax)); // Undo the move
          board[i][j] = "";
        }
      }
    }
    return best;
  } // If this minimizer's move
  else {
    let best = 1000; // Traverse all cells
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Check if cell is empty
        if (board[i][j] == "") {
          // Make the move
          board[i][j] = opponent; // Call minimax recursively and // choose the minimum value
          best = Math.min(best, minimax(board, depth + 1, !isMax)); // Undo the move
          board[i][j] = "";
        }
      }
    }
    return best;
  }
};

const generateBestPair = (grid) => {
  const board = JSON.parse(JSON.stringify(grid));
  console.log(board);

  let bestVal = -1000;
  let bestMove = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        console.log("inside");
        // Make the move
        board[i][j] = currPlayer; // compute evaluation function // for this move.
        let moveVal = minimax(board, 0, false); // Undo the move
        console.log({ moveVal });

        board[i][j] = "";
        if (moveVal > bestVal) {
          bestMove = [i, j];
          bestVal = moveVal;
        }
      }
    }
  }
  console.log(bestMove);

  return bestMove;
  // return generateRandomPair();
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
    playNextTurn();
  }
}

const playNextTurn = () => {
  const [i, j] = generateBestPair(grid);
  grid[i][j] = currPlayer;
  playerIndex = (playerIndex + 1) % players.length;
  updateStatus();
};

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
