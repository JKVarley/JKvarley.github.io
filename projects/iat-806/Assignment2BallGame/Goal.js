class Goal {
  constructor(x, y, size, c) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = c;
  }

  show() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }

  contains(x, y) {
    if (
      x >= this.x &&
      x <= this.x + this.size &&
      y >= this.y &&
      y <= this.y + this.size
    ) {
      return true;
    } else {
      return false;
    }
  }
}
