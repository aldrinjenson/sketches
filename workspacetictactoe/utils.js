const getWinner = (grid) => {
  const isLineValid = (row) =>
    row.length === 3 && row[0] !== "" && row.every((el) => el === row[0]);

  let i, j;
  let leftDiagEls = [];
  let rightDiagEls = [];
  let freeSpaces = 0;
  for (i = 0; i < grid.length; i++) {
    let colElements = [];
    let rowElements = [];
    for (j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") freeSpaces += 1;
      el = grid[i][j];
      if (i == j) leftDiagEls.push(el);
      if (i + j === grid.length - 1) rightDiagEls.push(el);
      colElements.push(grid[i][j]);
      rowElements.push(grid[j][i]);
    }

    if (isLineValid(colElements)) return colElements[0];
    if (isLineValid(rowElements)) return rowElements[0];
    if (isLineValid(leftDiagEls)) return leftDiagEls[0];
    if (isLineValid(rightDiagEls)) return rightDiagEls[0];
  }

  if (freeSpaces === 0) return "tie";
  return null;
};

const drawWinningStrikeLine = (grid) => {
  const isLineValid = (row) =>
    row.length === 3 && row[0] !== "" && row.every((el) => el === row[0]);

  let lineStart = {},
    lineEnd = {};
  let i, j;
  let leftDiagEls = [];
  let rightDiagEls = [];
  let freeSpaces = 0;
  for (i = 0; i < grid.length; i++) {
    let colElements = [];
    let rowElements = [];
    for (j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "") freeSpaces += 1;
      el = grid[i][j];
      if (i == j) leftDiagEls.push(el);
      if (i + j === grid.length - 1) rightDiagEls.push(el);
      colElements.push(grid[i][j]);
      rowElements.push(grid[j][i]);
    }
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
    if (isLineValid(rightDiagEls)) {
      lineStart = { x: width, y: 0 };
      lineEnd = { x: 0, y: height };
    }
  }

  if (lineStart.x || lineEnd.y) {
    strokeWeight(5);
    stroke("green");
    line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
  }
};
