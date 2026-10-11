let frames = [];
let myAge = 10;
let myName = "Kyle";
let myStudentsAges = [];
let numFrames = 8;

let firstName = "John Kyle";
let lastName = "Varley";

let fullName = firstName + " " + lastName;
let numRows = 8;
let numCols = 10;
let colWidth;
let rowHeight;

async function setup() {
  createCanvas(800, 420);
  colWidth = width / numCols;
  rowHeight = height / numRows;
  for (let i = 0; i < numCols; i++) {
    // let fileName = `dance_frames/dance${i}.png`;
    let fileName = "dance_frames/dance" + i + ".png";

    frames.push(await loadImage(fileName));
  }
}

let imageWidth = 50;
let imageHeight = 50;

function draw() {
  background(120);
  fill(80, 90, 50);

  for (let i = 0; i < numFrames; i++) {
    for (let j = 0; j < numRows; j++) {
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);
    }
  }

  text(fullName, 100, 100);

  let speed = 10;
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;

  text(index, 20, 400);

  animate(10, 300, 100, 50, 50);
  animate(20, 400, 100, 50, 50);
  animate(30, 600, 100, 50, 50);
}

function animate(speed, xposition, yposition, imageWidth, imageHeight) {
  let index = getframeindex(speed);
  let currentFrame = frames[index];
  let origWidth = currentFrame.width;
  let origHeight = currentFrame.height;

  if (imageWidth && imageHeight) {
    let scale = imageWidth / origWidth;
    imageHeight = scale * origHeight;
  }
  image(frames[index], xposition, yposition, imageWidth, imageHeight);
}
function getframeindex(speed) {
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;
  return index;
}
