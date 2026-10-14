// IAT 806 — ASsignment 1 starter: avoid your friends! Run with Live Server.
// - Hold and release the left mouse button to launch the ball away from the mouse.
// - Spacebar pauses/unpauses the game.
// - Enter moves the ball to a random location that is not touching the pit.
console.log("Assignment 1: Avoid your friends!");
let ballX = 80;
let ballY = 410;
let ballsize = 20;
let pitX = [];
let pitY = [];
let pitSize = 20;
let pitFrame = [];
let siatFrames = [];
let campusImage = null;
let speedY = 1;
let numPits = 5;
let ballVelocityX = 0;
let ballVelocityY = 0;
let paused = false;
let collision = false;
let level = 1;
let levelTimer = 0;

function setup() {
  createCanvas(800, 800);
  ballY = height / 2 + ballsize / 2;
  for (let i = 0; i < 8; i++) {
    let fileName = "siat_frames/photo" + i + ".png";
    if (i === 7) {
      fileName = "siat_frames/photo7.jpg";
    }
    loadImage(fileName, (loadedImage) => {
      siatFrames[i] = loadedImage;
    });
  }
  loadImage("Campus.jpeg", (loadedImage) => {
    campusImage = loadedImage;
  });

  // this makes the boxes bigger as the level goes up
  pitSize = 20 + level * 30;
  for (let i = 0; i < numPits; i++) {
    pitX[i] = random(pitSize / 2, width - pitSize / 2);
    pitY[i] = random(-height, 0);

    //adds a random photo to the pits
    pitFrame[i] = floor(random(0, 8));
  }
}

function draw() {
  if (campusImage) {
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = campusImage.width;
    let sourceHeight = campusImage.height;
    let canvasRatio = width / height;
    // this makes the background image the same size as the canvas and fits it to the canvas with stretching.
    if (sourceWidth / sourceHeight > canvasRatio) {
      sourceWidth = sourceHeight * canvasRatio;
      sourceX = (campusImage.width - sourceWidth) / 2;
    } else {
      sourceHeight = sourceWidth / canvasRatio;
      sourceY = (campusImage.height - sourceHeight) / 2;
    }

    image(
      campusImage,
      0,
      0,
      width,
      height,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    );
  } else {
    background(1);
  }

  // this sets the radius and size of the ball so we can bounce it off the edges.
  pitSize = 20 + level * 30;
  let rBall = ballsize / 2;
  let rPit = pitSize / 2;

  if (!paused) {
    levelTimer++;
    if (levelTimer >= 300) {
      level++;
      levelTimer = 0;
    }

    // Move the ball using the velocity created when the mouse is released.
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Slow the ball down gradually.
    ballVelocityX *= 0.99;
    ballVelocityY *= 0.99;

    // Bounce the ball from edges.
    if (ballX > width - rBall) {
      ballX = width - rBall;
      ballVelocityX *= -1;
    }

    if (ballX < rBall) {
      ballX = rBall;
      ballVelocityX *= -1;
    }

    if (ballY > height - rBall) {
      ballY = height - rBall;
      ballVelocityY *= -1;
    }

    if (ballY < rBall) {
      ballY = rBall;
      ballVelocityY *= -1;
    }

    if (ballY < height / 2 + rBall) {
      ballY = height / 2 + rBall;
      ballVelocityY *= -1;
    }

    // Move the rectangle down the canvas and restart it at the top.
    for (let i = 0; i < numPits; i++) {
      pitY[i] += speedY;
      if (pitY[i] - rPit > height) {
        // this makes the boxes start at a random X position at the top of the canvas.
        pitX[i] = random(rPit, width - rPit);
        pitY[i] = -rPit;
        pitFrame[i] = floor(random(0, 8));
      }
    }
  }

  let pitCollision = false;
  for (let i = 0; i < numPits; i++) {
    // Check the distance between the ball and each falling rectangle.
    let closestPitX = constrain(ballX, pitX[i] - rPit, pitX[i] + rPit);
    let closestPitY = constrain(ballY, pitY[i] - rPit, pitY[i] + rPit);
    let distanceBetween = dist(ballX, ballY, closestPitX, closestPitY);
    if (distanceBetween < rBall) {
      pitCollision = true;
    }
  }

  // If ball and pit overlap, reset the level to 1.
  if (pitCollision) {
    // Only trigger once.
    if (collision === false) {
      level = 1;
      collision = true;
    }
  } else {
    // They have separated, so another collision can be detected later.
    collision = false;
  }

  // Draw the ball.
  noStroke();
  fill(255);
  circle(ballX, ballY, ballsize);

  // This draws each rectangle's picture.
  for (let i = 0; i < numPits; i++) {
    if (siatFrames[pitFrame[i]]) {
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = siatFrames[pitFrame[i]].width;
      let sourceHeight = siatFrames[pitFrame[i]].height;

      if (sourceWidth > sourceHeight) {
        sourceX = (sourceWidth - sourceHeight) / 2;
        sourceWidth = sourceHeight;
      } else {
        sourceY = (sourceHeight - sourceWidth) / 2;
        sourceHeight = sourceWidth;
      }
      // this sets all the parameters for the images to be drawn in the right spot, at the right size, etc.
      image(
        siatFrames[pitFrame[i]],
        pitX[i] - rPit,
        pitY[i] - rPit,
        pitSize,
        pitSize,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
      );
    } else {
      fill(255, 0, 0);
      rect(pitX[i] - rPit, pitY[i] - rPit, pitSize, pitSize);
    }
  }

  //draw pause text
  if (paused) {
    fill(240, 240, 54);
    textSize(60);
    text("PAUSED", width / 2 - 60, height / 2);
  }

  // Draw the level .
  fill(255);
  textSize(40);
  text("Level: " + level, 500, 100);

  fill(255);
  textSize(30);
  text("avoid hitting your classmates for as long as possible", 10, 30);

  stroke(255);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  noStroke();
}

function mouseReleased() {
  // Do not launch while paused.
  if (paused) {
    return;
  }

  // Find the vector from the mouse back toward the ball.
  // This launches the ball in the opposite direction of the pull.
  let pullX = ballX - mouseX;
  let pullY = ballY - mouseY;

  // Convert pull distance into speed.
  ballVelocityX = pullX * 0.02;
  ballVelocityY = pullY * 0.02;
}

function keyPressed() {
  // Spacebar pauses or unpauses.
  if (key === " ") {
    paused = !paused;
    //write pause on screen

    return false;
  }
}
