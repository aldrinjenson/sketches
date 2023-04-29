let walker;

function setup() {
  createCanvas(600, 400);
  stroke(0);
  // strokeWeight(0.5);
  background(200);
  walker = new Walker(5, 6);
}

function draw() {
  // background(200);
  walker.show();
  walker.step();
}
