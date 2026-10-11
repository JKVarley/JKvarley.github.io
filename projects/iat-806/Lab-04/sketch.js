// IAT 806 · Lab 04 starter: the dancer grid from Week 4, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

let frames = []; // the 8 dance poses
let frames2 = []; // TODO: load the jump poses into this array
let numFrames = 8;
let JumpMode = false;
let numCols = 20;
let numRows = 10;
let colWidth;
let rowHeight;

// 2D arrays: one color and one speed for every cell in the grid
let colors = [];
let speeds = [];

async function setup() {
  const canvas = createCanvas(800, 420);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  for (let i = 0; i < numCols; i++) {
    colors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < numRows; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
      speeds[i][j] = random(1, 10);
    }
  }
  for (let i = 0; i < 4; i++) {
    let fileName = "jump_frames/jump" + i + ".png";
    frames2.push(await loadImage(fileName));
  }

  rowHeight = height / numRows;

  for (let i = 0; i < numFrames; i++) {
    let fileName = "dance_frames/dance" + i + ".png";
    frames.push(await loadImage(fileName));
  }
}

function draw() {
  let danceFrames;

  if (JumpMode) {
    danceFrames = frames2;
  } else {
    danceFrames = frames;
  }
  background(120);
  colWidth = width / numCols;

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      let cellX = i * colWidth;
      let cellY = j * rowHeight;
      let distance = dist(cellX, cellY, mouseX, mouseY);
      if (distance < 100) {
        speeds[i][j] = 2;
      } else if (distance < 200) {
        speeds[i][j] = 7;
      } else {
        speeds[i][j] = 30;
      }
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2], 120);
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);
      animate(danceFrames, speeds[i][j], i * colWidth, j * rowHeight, colWidth);
    }
  }
}

function keyPressed() {
  if (key === "1") {
    JumpMode = false;
  } else if (key === "2") {
    JumpMode = true;
  }
}

// draws one dancer: which poses, how fast, where, and how big
function animate(frames, speed, xPosition, yPosition, imageWidth, imageHeight) {
  let index = getFrameIndex(frames, speed);
  let currentFrame = frames[index];
  let origWidth = currentFrame.width;
  let origHeight = currentFrame.height;
  if (imageWidth && !imageHeight) {
    let scale = imageWidth / origWidth;
    imageHeight = scale * origHeight;
  }
  // TODO, complete the keeping scale correct logic.
  image(currentFrame, xPosition, yPosition, imageWidth, imageHeight);
}

// which pose to show right now. speed = draw-frames per pose: smaller = faster
function getFrameIndex(frames, speed) {
  let slowFrame = Math.floor(frameCount / speed);
  let index = slowFrame % frames.length;

  return index;
}
