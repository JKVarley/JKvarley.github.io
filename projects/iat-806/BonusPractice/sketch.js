let balls = [];
//how many balls do we want?
let numberOfBalls = 1000;

function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(20);

  if (balls.length < numberOfBalls) {
    let x = mouseX;
    let y = mouseY;
    let c = color(random(255), random(255), random(255));
    let r = random(10, 50);
    balls.push(new Ball(x, y, c, r));
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    ball.move();
    ball.fall();
    ball.explode();
    if (ball.r >= 100) {
      balls.splice(i, 1);
    } else {
      ball.show();
    }
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
    this.ReachedBottom = false;
  }

  //methods - the things it can do
  move() {
    this.x += random(-5, 5);
    if (this.y + this.r < height) {
      this.y += random(-5, 5);
    }
  }
  fall() {
    if (this.y + this.r < height) {
      this.y += random(1, 10);
    }
  }

  explode() {
    if (this.y + this.r >= height) {
      if (!this.ReachedBottom) {
        this.fireColor();
        this.ReachedBottom = true;
      }
      this.r += random(5, 20);
      this.y = height - this.r;
    }
  }
  fireColor() {
    this.color = color(255, random(256), 0);
  }
  show() {
    fill(this.color);
    if (this.ReachedBottom) {
      circle(this.x, this.y + this.r / 2, this.r);
    } else {
      rect(this.x, this.y, this.r);
    }
  }
}
