

var on = false;


function setup() {
createCanvas(windowWidth,windowHeight);
background("white");
x = width/2;
y = height/2;


}
function draw() {  
    ormStart();
    textSize(32);
    fill(0, 102, 153);
   
}
class ormR {
  constructor() {
    this.stroke = (150,200,300);
    this.point = (50,50,300);
    var speedX = 5;
    var speedY = 5;
     if (on) {
x = x + random(-speedX, speedX);
y = y + random(-speedY, speedY);

}

   

    
  }
}
new ormR()


function ormStart(){

stroke(150,200,mouseY);
point(x,y, 300);
strokeWeight(10);
var speedX = 3;
var speedY = 3;

if (on) {
x = x + random(-speedX, speedX);
y = y + random(-speedY, speedY);

}

else {
x = x;
y = y;
}


}

function mousePressed() {
  
    if (on) {
        on = false; 
    }
    else { on = true; 
     }
} 

