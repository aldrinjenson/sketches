
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
}

function checkPlayerWin(grid) {
  const isLineValid = (row) =>
    row.length === 3 && row[0] !== "" && row.every((el) => el === row[0]);

  let leftDiagEls = [];
  let rigthDiagEls = [];
  let el = undefined
  for (let i = 0; i < grid.length; i++) {
    let colElements = [];
    let rowElements = [];
    for (let j = 0; j < grid[0].length; j++) {
      el = grid[i][j];
      if (i == j)
        leftDiagEls.push(el);
      if (i + j === grid.length - 1)
        rigthDiagEls.push(el)
      colElements.push(grid[j][i]);
      rowElements.push(grid[i][j]);
    }

    if (
      isLineValid(colElements) ||
      isLineValid(rowElements) ||
      isLineValid(leftDiagEls) ||
      isLineValid(rigthDiagEls)
    ) return true
  }
  return false
}

const checkGameOver = grid => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]) return false
    }
  }
  return true
}