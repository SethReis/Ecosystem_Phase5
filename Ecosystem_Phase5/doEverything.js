window.onload = init; // Wait for the page to load before we begin animation
var canvas;
var ctx;// This is a better name for a global variable
var k = 0;
var flock;

function init(){
  //get the canvas
  canvas = document.getElementById('cnv');
  // Set the dimensions of the canvas
  flock = new Flock();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.border = 'solid black 0px';
  //var color = Math.floor((Math.random()*2)+1);
  //canvas.style.backgroundColor = '';
  canvas.style.backgroundColor = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.random() + ')';
  // get the context
  ctx = canvas.getContext('2d'); // This is the context
  for (var i = 0; i < 20; i++){
    flock.addBoid(new Boid(i, new JSVector(Math.random()*canvas.width, Math.random()*canvas.height)));
  }
  mover = new Mover();
  orb = new Orb();
  snake = new Snake();
  animate(); // Call to your animate function
}
// To do::
//  1. Declare and init variables x, y, dx, dy, radius;
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  k++;
  // Looping through backwards to delete
  for (var i = flock.boids.length-1; i >= 0; i--) {
    if (k === 10){
      flock.addBoid(new Boid(i, new JSVector(canvas.width/2, canvas.height/2)));
      k = 0;
    }
    var boid = flock.boids[i];
    boid.update();
    boid.render();
    if (boid.isDead()) {
      //remove the boidicle
      flock.boids.splice(i, 1);
    }
    var distance = mover.loc.distance(boid.loc)
    if (distance <= 2500){
      var f = JSVector.subGetNew(boid.loc, mover.loc);
      f.normalize();
      f.mult(.3);
      mover.applyForce(f);
    }
  }
  mover.update();
  mover.render();
  for(var j = 0; j < flock.boids.length; j++){
    var boid= flock.boids[j];
    var distance = boid.loc.distance(mover.loc)
    if (distance <= 200){
      var f = JSVector.subGetNew(boid.loc, JSVector.addGetNew(mover.loc, orb.loc));
      f.normalize();
      f.mult(.3);
      boid.applyForce(f);
    }
  }
  orb.update();
  orb.render();
  snake.update();
  snake.render();
  for(var j = flock.boids.length-1; j >= 0; j--){
    var boid = flock.boids[j];
    var distance = boid.loc.distance(JSVector.addGetNew(mover.loc, orb.loc));
    if (distance <= snake.rad + 2){
      flock.boids.splice(j, 1);
      for (var i = 0; i < 5; i++){
        snake.segs.push(new JSVector(0, 0));
        snake.rad += 0.1;
      }
    }
  }
}
