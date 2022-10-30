/// <reference path="lib/p5.global-mode.d.ts" />
let boxHeight, boxWidth;
let letterStrokeWeight = 10;

const players = ["X", "O"];
const firstPlayer = "X"; // randomize this later
let currPlayer;
let playerIndex = 0;

function setup() {
  currPlayer = firstPlayer;
  createCanvas(400, 400, P2D);
  background(200);
  boxWidth = width / 3;
  boxHeight = height / 3;
  strokeWeight(letterStrokeWeight);
  line(0, boxHeight, width, boxHeight);
  line(0, boxHeight * 2, width, boxHeight * 2);
  line(boxWidth, 0, boxWidth, height);
  line(boxWidth * 2, 0, boxWidth * 2, height);
}

const grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

function draw() {
  strokeWeight(letterStrokeWeight);
  textSize(50);
  textAlign(CENTER);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const el = grid[i][j];
      let textX = i * boxWidth + boxWidth / 2;
      let textY = j * boxHeight + boxHeight / 2 + letterStrokeWeight * 2;
      text(el, textX, textY);
    }
  }
  frameRate(3);
  if (currPlayer === "O") {
    playNextBestMove();
  }
  const winner = getWinner(grid);
  if (winner) {
    createP("Game over");
    createP(winner);
    noLoop();
    drawWinningStrikeLine(grid);
  }
}

const playNextBestMove = () => {
  let maxScore = -Infinity;
  let bestPair = undefined;

  let freeSpaces = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") {
        freeSpaces++;
        const gridCopy = JSON.parse(JSON.stringify(grid));
        gridCopy[i][j] = "O";
        let score = miniMax(gridCopy, 3, false);
        console.log({ score });
        if (score > maxScore) {
          maxScore = score;
          bestPair = [i, j];
        }
      }
    }
  }
  if (freeSpaces === 0) {
    console.log("all spaces filled");
    return;
  }
  const [i, j] = bestPair;
  grid[i][j] = currPlayer;
  updatePlayerTurn();
};

const scoreMap = {
  X: 10,
  O: -10,
  tie: 0,
};

const miniMax = (board, depth, shouldMaximise) => {
  console.log(board[0]);
  console.log(JSON.stringify(board));

  const winner = getWinner(board);
  if (winner) {
    const score = scoreMap[winner];
    console.log({ winner, score });
    return score;
  }

  if (shouldMaximise) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === "") {
          const newBoard2 = JSON.parse(JSON.stringify(board));
          newBoard2[i][j] = "O";
          // board[i][j] = "O";
          let score = miniMax(newBoard2, depth + 1, false);
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === "") {
          const newBoard = JSON.parse(JSON.stringify(board));
          newBoard[i][j] = "X";
          // board[i][j] = "X";
          let score = miniMax(newBoard, depth + 1, true);
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
};

const updatePlayerTurn = () => {
  playerIndex = (playerIndex + 1) % players.length;
  currPlayer = players[playerIndex];
};

function mousePressed() {
  if (getWinner(grid)) return;
  let i = floor(mouseX / boxWidth);
  let j = floor(mouseY / boxHeight);
  if (grid[i][j] !== "") return; // exit if cell is already filled
  grid[i][j] = currPlayer;
  updatePlayerTurn();
}
