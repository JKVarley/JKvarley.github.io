// An example sketch, so the page has something to show.
// Delete all of this and write your own.

let balls = [];
let pucks;

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 300; i++) {
    let x = mouseX;
    let y = mouseY;
    balls.push(new ball(x, y, color(255, 180, 60), 40));
  }
}

function draw() {
  background(253, 253, 251);

  for (let ball of balls) {
    ball.show();
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    ball.jiggle();
  }
}
