let balls = [];

let numBalls = 5000;

function setup() {
  const canvas = createCanvas(600, 600);

  for (let i = 0; i < numBalls; i++) {
    let ball = createRandomBall();
    balls.push(ball);
  }
}

function draw() {
  background(120);

  for (let ball of balls) {
    ball.update(2);
  }
}
