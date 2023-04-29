let lineStart = {},
  lineEnd = {};

function plotGrid(grid, boxHeight, boxWidth) {
  strokeWeight(2);
  line(0, boxHeight, width, boxHeight);
  line(0, boxHeight * 2, width, boxHeight * 2);
  line(boxWidth, 0, boxWidth, height);
  line(boxWidth * 2, 0, boxWidth * 2, height);

  strokeWeight(letterStrokeWeight);
  textSize(40);
  textAlign(CENTER);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const el = grid[i][j];
      let textX = i * boxWidth + boxWidth / 2;
      let textY = j * boxHeight + boxHeight / 2 + letterStrokeWeight * 2;
      text(el, textX, textY);
    }
  }
  (lineStart.x || lineEnd.y) &&
    line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
}

function checkPlayerWin(grid, player) {
  const isLineValid = (row) => {
    if (row.length === 3 && row[0] !== "" && row.every((el) => el === player)) {
      return true;
    }
    return false;
  };

  let leftDiagEls = [];
  let rigthDiagEls = [];
  let el = undefined;
  let i, j;
  for (i = 0; i < grid.length; i++) {
    let colElements = [];
    let rowElements = [];
    for (j = 0; j < grid[0].length; j++) {
      el = grid[i][j];
      if (i == j) leftDiagEls.push(el);
      if (i + j === grid.length - 1) rigthDiagEls.push(el);
      colElements.push(grid[i][j]);
      rowElements.push(grid[j][i]);
    }

    stroke("green");

    if (isLineValid(rowElements)) {
      lineStart = { x: 0, y: i * boxHeight + boxHeight / 2 };
      lineEnd = { x: width, y: i * boxWidth + boxHeight / 2 };
    }
    if (isLineValid(colElements)) {
      lineStart = { x: i * boxWidth + boxWidth / 2, y: 0 };
      lineEnd = { x: i * boxWidth + boxWidth / 2, y: height };
    }
    if (isLineValid(leftDiagEls)) {
      lineStart = { x: 0, y: 0 };
      lineEnd = { x: width, y: height };
    }
    if (isLineValid(rigthDiagEls)) {
      lineStart = { x: width, y: 0 };
      lineEnd = { x: 0, y: height };
    }

    if (
      isLineValid(colElements) ||
      isLineValid(rowElements) ||
      isLineValid(leftDiagEls) ||
      isLineValid(rigthDiagEls)
    )
      return true;
  }
  return false;
}

const checkTieGame = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") return false;
    }
  }
  return true;
};

const generateRandomPair = () => {
  let i, j;
  for (i = 0; i < grid.length; i++) {
    for (j = 0; j < grid[0].length; j++) {
      if (!grid[i][j]) return [i, j];
    }
  }
};

const updateStatus = () => {
  let winner = null;
  let winnerName = "";
  if (checkPlayerWin(grid, human)) {
    winnerName = "Human";
    winner = human;
    message = `Game Over!!\nPlayer ${winnerName} has won!`;
  } else if (checkPlayerWin(grid, ai)) {
    winnerName = "AI";
    winner = ai;
    message = `Game Over!!\nPlayer ${winnerName} has won!`;
  } else if (checkTieGame(grid)) {
    winner = "tie";
    message =
      "Game Over!!\nNo other possible moves available! Refresh the page to continue again";
  }
  currPlayer = players[playerIndex];
  return winner;
};

const isMovesLeft = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!grid.length) return true;
    }
  }
  return false;
};

function evaluate(b) {
  // Checking for Rows for X or O victory.
  let player = "X",
    opponent = "O";
  console.log({ player, opponent });

  for (let row = 0; row < 3; row++) {
    if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
      if (b[row][0] == player) return +10;
      else if (b[row][0] == opponent) return -10;
    }
  } // Checking for Columns for X or O victory.
  for (let col = 0; col < 3; col++) {
    if (b[0][col] == b[1][col] && b[1][col] == b[2][col]) {
      if (b[0][col] == player) return +10;
      else if (b[0][col] == opponent) return -10;
    }
  } // Checking for Diagonals for X or O victory.
  if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
    if (b[0][0] == player) return +10;
    else if (b[0][0] == opponent) return -10;
  }
  if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
    if (b[0][2] == player) return +10;
    else if (b[0][2] == opponent) return -10;
  } // Else if none of them have // won then return 0
  return 0;
}
