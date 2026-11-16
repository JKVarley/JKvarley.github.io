// an array to put all the balls in.
let balls = [];
// numBalls is written in camelCase.
// you could also write in camel_case
// this is the number of balls that you want to create.
let numBalls = 500;
// no color variables, no position variables, they are all defined within the class.

let handPose;
let video;
let hands = [];

async function setup() {
  createCanvas(640, 480);
  for (let i = 0; i < numBalls; i++) {
    balls.push(createRandomBall());
  }

  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose = await ml5.handPose();
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(120);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  for (let ball of balls) {
    let onHand = false;
    for (let hand of hands) {
      for (let keypoint of hand.keypoints) {
        let handX = width - keypoint.x;
        if (ball.contains(handX, keypoint.y)) {
          onHand = true;
        }
      }
    }

    let active = ball.contains(mouseX, mouseY) || onHand;

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
  return new Ball(ballX, ballY, ballC, ballR);
}

function gotHands(results) {
  hands = results;
}
