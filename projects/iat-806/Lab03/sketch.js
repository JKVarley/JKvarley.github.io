// IAT 806 · Lab 03 starter: the dancers from Week 3, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

const FRAME_COUNT = 8;
const SOUND_COUNT = 6;
let soundIndex = 0;
let danceFrames = [];
let clubFrames = [];
let countryFrames = [];

let jazzSounds = [];
let clubSounds = [];
let countrySounds = [];

let sounds = [];
let index = 0;

// one array holds all eight poses
let frames = [];

// which frame the click-controlled dancer shows

// parallel arrays, one entry per animated dancer
let xs = [200, 360, 520];
let speeds = [4, 8, 16]; // draw-frames per pose: smaller = faster

async function setup() {
  const canvas = createCanvas(700, 420);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  textFont("monospace");
  textSize(14);

  for (let i = 0; i < FRAME_COUNT; i++) {
    const frameNumber = String(i + 1).padStart(2, "0");
    danceFrames.push(
      await loadImage("dance_frames/dance_frame_" + frameNumber + ".png"),
    );
  }

  for (let i = 0; i < FRAME_COUNT; i++) {
    const frameNumber = String(i + 1).padStart(2, "0");
    clubFrames.push(
      await loadImage("club_frames/club_frames_" + frameNumber + ".png"),
    );
  }

  for (let i = 0; i < FRAME_COUNT; i++) {
    const frameNumber = String(i + 1).padStart(2, "0");
    countryFrames.push(
      await loadImage("country_frames/country_frame_" + frameNumber + ".png"),
    );
  }

  for (let i = 0; i < SOUND_COUNT; i++) {
    jazzSounds.push(await loadSound("JazzSounds/sound" + i + ".mp3"));
  }

  for (let i = 0; i < SOUND_COUNT; i++) {
    clubSounds.push(await loadSound("ClubSounds/ClubSounds" + i + ".mp3"));
  }

  for (let i = 0; i < SOUND_COUNT; i++) {
    countrySounds.push(
      await loadSound("CountrySounds/CountrySounds" + i + ".mp3"),
    );
  }
}

frames = danceFrames;
sounds = jazzSounds;

function draw() {
  background(240);

  // contact sheet: every pose, side by side
  for (let i = 0; i < frames.length; i++) {
    image(frames[i], i * 85, 0, 80, 100);
  }

  // click-controlled dancer
  image(frames[index], 20, 140, 160, 200);
  fill(0);
  text("click: frames[" + index + "]", 20, 370);
text("Click to dance and play music, or press #1,2,3 to change eras", 20, 380);
  // one loop draws every dancer, each at its own x and speed
  for (let i = 0; i < xs.length; i++) {
    let pose = floor(frameCount / speeds[i]) % frames.length;
    image(frames[pose], xs[i], 140, 160, 200);
  }
}

// advance the index, wrapping at the end
function mousePressed() {
  index = (index + 1) % frames.length;

  userStartAudio(); // browsers block sound until the user clicks; this switches it on
  sounds[soundIndex].play();
  soundIndex = (soundIndex + 1) % sounds.length;
}

function keyPressed() {
  if (key === "1") {
    frames = danceFrames;
    sounds = jazzSounds;
  }

  if (key === "2") {
    frames = clubFrames;
    sounds = clubSounds;
  }

  if (key === "3") {
    frames = countryFrames;
    sounds = countrySounds;
  }

  index = 0;
  soundIndex = 0;
}
