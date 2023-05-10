let mover;
let selector; // to choose b/w type of acceleration

function setup() {
  selector = createSelect();
  selector.option("Constant");
  selector.option("Random");
  selector.option("Perlin");
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
}
