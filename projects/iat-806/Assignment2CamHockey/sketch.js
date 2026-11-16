let lemmings = [];
let lastLemmingTime;
let goal;
let leftGoal;
let redRectangles = [];
let handPose;
let video;
let hands = [];
let pitImage;
let tableImage;
let gameStartTime;
let redScore = 0;
let yellowScore = 0;

async function setup() {
  createCanvas(640, 480);
  pitImage = await loadImage("PitImage.jpg");
  tableImage = await loadImage("tableImage.jpg");

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  let lemmingY = 10;
  if (random(0, 1) < 0.5) {
    lemmingY = height - 10;
  }
  lemmings.push(
    new Lemming(width / random(1.5, 2.5), lemmingY, color(0, 0, 255), 20),
  );
  goal = new Goal(width - 50, height / 2 - 25, 50, color(255, 255, 0));
  leftGoal = new Goal(0, height / 2 - 25, 50, color(255, 0, 0));

  for (let i = 0; i < 2; i++) {
    let rectangleX = random(width / 2, width - 50);
    let rectangleY = random(0, height / 2 - 50);
    redRectangles.push(
      new Rectangle(rectangleX, rectangleY, color(255, 0, 0), 50, 50),
    );
  }

  for (let i = 0; i < 2; i++) {
    let rectangleX = random(0, width / 2 - 50);
    let rectangleY = random(0, height / 2 - 50);
    redRectangles.push(
      new Rectangle(rectangleX, rectangleY, color(255, 0, 0), 50, 50),
    );
  }

  handPose = await ml5.handPose();
  handPose.detectStart(video, gotHands);
  lastLemmingTime = millis();
  gameStartTime = millis();
}

function draw() {
  image(tableImage, 0, 0, width, height);

  let timeLeft = 60 - Math.floor((millis() - gameStartTime) / 1000);
  if (timeLeft < 0) {
    timeLeft = 0;
  }

  if (timeLeft > 0 && millis() - lastLemmingTime >= 3000) {
    let lemmingY = 10;
    if (random(0, 1) < 0.5) {
      lemmingY = height - 10;
    }
    lemmings.push(
      new Lemming(width / random(1.5, 2.5), lemmingY, color(0, 0, 255), 20),
    );
    lastLemmingTime = millis();
  }
  let speedMultiplier = 1.6 - timeLeft * 0.01;

  stroke(255);
  line(width / 2, 0, width / 2, height);
  noStroke();

  goal.show();
  leftGoal.show();

  for (let rectangle of redRectangles) {
    image(
      pitImage,
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    );
  }

  if (timeLeft > 0) {
    for (let hand of hands) {
      let keypoint = hand.keypoints[8];
      let handX = width - keypoint.x;
      if (hand.handedness == "Left") {
        fill(255, 255, 0);
      } else {
        fill(255, 0, 0);
      }
      noStroke();
      circle(handX, keypoint.y, 50);
    }

    for (let i = lemmings.length - 1; i >= 0; i--) {
      let lemming = lemmings[i];
      lemming.move(speedMultiplier);
      for (let hand of hands) {
        let keypoint = hand.keypoints[8];
        let handX = width - keypoint.x;
        lemming.bounce(handX, keypoint.y, 50);
      }

      let hitRectangle = false;
      for (let rectangle of redRectangles) {
        if (rectangle.overlaps(lemming)) {
          hitRectangle = true;
        }
      }

      let hitYellowGoal = goal.contains(lemming.x, lemming.y);
      let hitRedGoal = leftGoal.contains(lemming.x, lemming.y);

      if (hitYellowGoal) {
        yellowScore++;
      }
      if (hitRedGoal) {
        redScore++;
      }

      if (hitYellowGoal || hitRedGoal) {
        for (let rectangle of redRectangles) {
          rectangle.x = random(0, width - rectangle.width);
          rectangle.y = random(0, height - rectangle.height);
        }
      }

      if (hitYellowGoal || hitRedGoal || hitRectangle) {
        lemmings.splice(i, 1);
      } else {
        lemming.show();
      }
    }
  } else {
    for (let lemming of lemmings) {
      lemming.show();
    }

    fill(1);
    textSize(32);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
  }

  textSize(20);
  fill(1, 1, 1);
  textAlign(LEFT);
  text(yellowScore, 20, 40);
  fill(1);
  textAlign(CENTER);
  text(timeLeft, width / 2, 45);
  fill(1, 1, 1);
  textAlign(RIGHT);
  text(redScore, width - 20, 40);
}

function gotHands(results) {
  hands = results;
}
