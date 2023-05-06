// https://nature-of-code-2nd-edition.netlify.app/introduction/#i5-a-custom-distribution-of-random-numbers

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
    let randomlyChosenRectIndex;
    while (true) {
      let r1 = random(rectangleHeights.length);
      let probability = r1;
      let r2 = random(rectangleHeights.length);

      if (r2 < probability) {
        randomlyChosenRectIndex = floor(r2);
        break;
      }
    }
    let newHeight = rectangleHeights[randomlyChosenRectIndex] + 2;
    rectangleHeights[randomlyChosenRectIndex] = newHeight;
    if (newHeight > height) shouldIncreaseHeight = false;
  }
}
