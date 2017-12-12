function Boid(id, loc){
  this.acc = new JSVector(0, 0);
  this.vel = new JSVector((Math.random()*3)-1.5, (Math.random()*3)-1.5);
  this.id = id;
  this.loc = loc;
  this.maxSpeed = 2;
  this.maxForce = 1;
  this.lifespan = 4000.0;
  this.rad = 30;
  this.star = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',';
  this.flock = function(boids){
    var sep = this.seperate(boids);
    var ali = this.alignment(boids);
    var coh = this.seperate(boids);

    sep.mult(0.2);
    ali.mult(0.075);
    coh.mult(0.05);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }
}

Boid.prototype.update = function(){
  this.flock(flock.boids);
  this.vel.add(this.acc);
  this.vel.limit(this.maxSpeed);
  this.loc.add(this.vel);
  this.acc.mult(0);
  this.lifespan -= 2;
  if(this.loc.x + this.rad >= canvas.width || this.loc.x - this.rad <= 0){
    this.loc.x = canvas.width-this.loc.x;
    //this.vel.x = -(this.vel.x);
  }
  if(this.loc.y + this.rad >= canvas.height || this.loc.y - this.rad <= 0){
    this.loc.y= canvas.height-this.loc.y;
    //this.vel.y = -(this.vel.y);
  }
}

Boid.prototype.render = function(){
  this.c = this.star + this.lifespan/4000.0 + ')';
  ctx.strokeStyle = this.c;
  ctx.fillStyle = this.c;
  ctx.save();
  ctx.translate(this.loc.x, this.loc.y);
  this.angle = this.vel.getDirection()+Math.PI/2;
  ctx.rotate(this.angle);
  ctx.beginPath();
  //ctx.arc(0,0,this.rad,0,2*Math.PI);
  ctx.moveTo(-6, 0);
  ctx.lineTo(6, 0);
  ctx.lineTo(0, -24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

}

Boid.prototype.isDead = function(){
  if (this.lifespan < 0.0) {
    return true;
  } else {
    return false;
  }
}

Boid.prototype.seek = function(target){
  var desired = JSVector.sub(target, this.loc);
  desired.normalize();
  desired.mult(this.maxSpeed);
  var steer = JSVector.sub(desired, this.vel);
  steer.limit(this.maxForce * 0.001);
  return steer;
}

Boid.prototype.applyForce = function(f){
  this.acc.add(f);
}

Boid.prototype.seperate = function(boids){
  var desiredSep = 30;
  var sum = new JSVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++){
    var distance = this.loc.distance(boids[i].loc);
    if (distance < desiredSep && distance > 0){
      var f = JSVector.subGetNew(this.loc, boids[i].loc);
      f.normalize();
      f.div(distance);
      sum.add(f);
      count++;
    }
  }
  if (count > 0){
    sum.div(count);
  }
  if (sum.getMag() > 0){
    sum.normalize();
    sum.mult(this.maxSpeed);
    sum.sub(this.vel);
  }
  sum.limit(this.maxForce);
  return sum;
}

Boid.prototype.alignment = function(boids){
  var neighborDist = 80;
  var sum = new JSVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++){
    var distance = this.loc.distance(boids[i].loc);
    if (distance < neighborDist && distance > 0){
      sum.add(boids[i].vel);
      count++;
    }
  }
  if (count > 0){
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    var steer = JSVector.subGetNew(sum, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return new JSVector(0, 0);
  }
}

Boid.prototype.cohesion = function(boids){
  var neighborDist = 150;
  var sum = new JSVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++){
    var distance = this.loc.distance(boids[i].loc);
    if (distance < neighborDist && distance > 0){
        sum.add(boids[i].loc);
        count++;
    }
  }
  if (count > 0){
    sum.div(count);
    return this.seek(sum);
  } else {
    return new JSVector(0, 0);
  }
}
