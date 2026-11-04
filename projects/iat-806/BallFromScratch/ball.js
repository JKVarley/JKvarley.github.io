class ball {
  // The constructor method initializes the object
  constructor(x, y, color, d) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.d = d;
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.d * 2);
  }

  jiggle() {
    this.x += random(-5, 5);
    if (this.y + this.d < height) {
      this.y += random(-5, 5);
    }
  }
}
