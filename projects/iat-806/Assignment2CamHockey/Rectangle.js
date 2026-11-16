class Rectangle {
  constructor(x, y, c, w, h) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.width = w;
    this.height = h;
  }

  show() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  overlaps(lemming) {
    if (
      lemming.x + lemming.r / 2 > this.x &&
      lemming.x - lemming.r / 2 < this.x + this.width &&
      lemming.y + lemming.r / 2 > this.y &&
      lemming.y - lemming.r / 2 < this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
