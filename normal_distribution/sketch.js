let sdSlider;
let meanSlider;

function setup() {
  createCanvas(600, 400);
  // noStroke();
  sdSlider = createSlider(0, 100, 40, 2);
  meanSlider = createSlider(0, width, width / 2, 2);
  background(250);
}

let prevSd = 39;
let prevMean = 39;

function draw() {
  let mean = meanSlider.value();
  let sd = sdSlider.value();
  console.log(sd, prevSd);

  function repaint() {
    background(200);
    stroke(10);
    text("Standard Deviation = " + sd, 10, height - 5);
    text("Mean = " + mean, 10, height - 20);
  }

  if (sd != prevSd) {
    prevSd = sd;
    repaint();
  }

  if (mean != prevMean) {
    prevMean = mean;
    repaint();
  }

  let x = randomGaussian(mean, sd);
  fill(random(255), random(255), random(255), 70);
  ellipse(x, height / 3, 16, 20);

  line(0, height / 2, width, height / 2);
  noStroke();
  fill("black");
  for (let i = 0; i < width; i += 20) {
    let y = height / 2;
    if (i % 40 == 0) {
      y += 10;
    }
    text(i, i, y);
  }
}
