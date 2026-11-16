class Lemming {
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
    this.xSpeed = random(-1.35, 1.35);
    this.ySpeed = 1.35;
  }

  move(speedMultiplier) {
    this.x += this.xSpeed * speedMultiplier;
    this.y += this.ySpeed * speedMultiplier;

    if (this.x > width - this.r / 2) {
      this.x = width - this.r / 2;
      this.xSpeed = -this.xSpeed;
    }

    if (this.x < this.r / 2) {
      this.x = this.r / 2;
      this.xSpeed = -this.xSpeed;
    }

    if (this.y > height - this.r / 2) {
      this.y = height - this.r / 2;
      this.ySpeed = -this.ySpeed;
    }

    if (this.y < this.r / 2) {
      this.y = this.r / 2;
      this.ySpeed = -this.ySpeed;
    }
  }

  bounce(handX, handY, handSize) {
    let distance = dist(this.x, this.y, handX, handY);
    if (distance < this.r / 2 + handSize / 2 && distance > 0) {
      let normalX = (this.x - handX) / distance;
      let normalY = (this.y - handY) / distance;
      let speedTowardsHand = this.xSpeed * normalX + this.ySpeed * normalY;

      if (speedTowardsHand < 0) {
        this.xSpeed -= 2 * speedTowardsHand * normalX;
        this.ySpeed -= 2 * speedTowardsHand * normalY;
      }
    }
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.r);
  }
}
