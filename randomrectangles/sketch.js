let rectangleHeights = [];
let w;
let shouldIncreaseHeight = true;
const maxRectangles = 20;

function setup() {
  createCanvas(600, 300);
  background(200);
  for (let i = 0; i < maxRectangles; i++) {
    rectangleHeights.push(random(0, 10));
  }
}

function draw() {
  background(200);
  w = width / rectangleHeights.length;
  for (let i = 0; i < rectangleHeights.length; i++) {
    if (i % 2 == 0) {
      fill("gray");
    } else {
      fill("white");
    }
    rect(i * w, height - rectangleHeights[i], w - 1, rectangleHeights[i]);
    text(round(rectangleHeights[i], 1), i * w, height - rectangleHeights[i]);
    fill("black");
    text(i + 1, i * w + w / 2 - 5, height - 5);
  }

  if (shouldIncreaseHeight) {
    let randomlyChosenRectIndex = floor(random(rectangleHeights.length));
    let newHeight = rectangleHeights[randomlyChosenRectIndex] + 2;
    rectangleHeights[randomlyChosenRectIndex] = newHeight;
    if (newHeight > height) shouldIncreaseHeight = false;
  }
}
