
let size = 200
let x = mouseX
let y = mouseY

class ball {


  // The constructor method initializes the object
  constructor(x, y, c, size) {
    this.color = c;       // "this" refers to the new object being created
    this.r = size;
    x = mouseX
    y = mouseY
   
  }

  show() {
    fill(this.fillColor);
    stroke(this.strokeColor);
    circle(this.x, this.y, this.r * 2);
  }
}
update() {

 
}


}

