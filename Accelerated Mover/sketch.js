let mover;
let selector;

function setup() {
  selector = createSelect();
  selector.option("Constant");
  selector.option("Random");
  selector.changed(handleSelectChange);
  createCanvas(800, 600);
  mover = new Mover();
  stroke(0);
  background(200);
}

function draw() {
  background(200);
  mover.update();
  mover.checkEdges();
  mover.show();
  // ellipse(position.x, position.y, 30);
  // position.add(velocity);
}
