let balls = [];
//how many balls do we want?
let numberOfBalls = 1000;

function setup() {
  createCanvas(400, 400);

  // this creates the balls in a loop
  for (let i = 0; i < numberOfBalls; i++) {
    let x = 300;
    let y = 300;
    let c = color(random(255), random(255), random(255));
    let r = random(10, 50);
    balls.push(new Ball(x, y, c, r));
  }
}
function draw() {
  background(20);

  for (let ball of balls) {
    ball.move();
    ball.show();
  }
}
//we can create new balls here
class Ball {
  // this constructor is what is called whenever we create a new instance of this class
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
  }

  //methods - the things it can do
  move() {
    this.x += random(-5, 5);
    this.y += random(-5, 5);
  }
  show() {
    fill(this.color);
    rect(this.x, this.y, this.r);
  }
}
