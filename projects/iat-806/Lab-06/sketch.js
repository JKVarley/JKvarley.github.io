// an array to put all the balls in.
let balls = [];
// numBalls is written in camelCase.
// you could also write in camel_case
// this is the number of balls that you want to create.
let numBalls = 2500;
// no color variables, no position variables, they are all defined within the class.

let bodySegmentation;
let video;
let segmentation;

let options = {
  maskType: "person",
};

async function setup() {
  createCanvas(640, 480);
  for (let i = 0; i < numBalls; i++) {
    balls.push(createRandomBall());
  }

  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);

  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(120);

  for (let ball of balls) {
    let onBody = segmentation && ball.isOnBody(segmentation.mask);

    let active = ball.contains(mouseX, mouseY) || onBody;

    ball.respond(active);

    ball.update(1);
  }
}

function checkMouseOver() {
  balls.forEach((ball, i) => {});
}

function mousePressed() {
  let i = balls.findLastIndex((ball) => ball.contains(mouseX, mouseY));

  if (i !== -1) {
    balls.splice(i, 1);
  } else {
    let ballC = color(20, 130, 140 + random(-100, 100), 180);
    balls.push(new Ball(mouseX, mouseY, ballC, 10));
  }
}

function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(140, 0, 140 + random(-100, 100), 50);
  let ballR = 5;
  let ball;
  if (Math.random() < 0.9) {
    ball = new Ball(ballX, ballY, ballC, ballR);
  } else {
    ball = new FlickerBall(ballX, ballY, ballC, ballR);
  }

  return ball;
}

function gotResults(result) {
  segmentation = result;
}
