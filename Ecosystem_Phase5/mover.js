function Mover(){
  this.rad = 25
  this.loc = new JSVector((Math.random()*canvas.width-(2*this.rad))+this.rad, (Math.random()*canvas.height-(2*this.rad))+this.rad);
  this.vel = new JSVector(Math.random()*10, Math.random()*10);
  this.acc = new JSVector(0, 0);
  this.c = 'rgba(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.random() + ')';
}

Mover.prototype.update = function(){
  this.vel.add(this.acc);
  this.vel.limit(4);
  this.loc.add(this.vel);
  this.acc.mult(0);
  if(this.loc.x + this.rad >= canvas.width || this.loc.x - this.rad <= 0){
    //this.loc.x = canvas.width-this.loc.x;
    this.vel.x = -(this.vel.x);
  }
  if(this.loc.y + this.rad >= canvas.height || this.loc.y - this.rad <= 0){
    //this.loc.y= canvas.height-this.loc.y;
    this.vel.y = -(this.vel.y);
  }
}

Mover.prototype.render = function(){
  // ctx.beginPath();
  // ctx.arc(this.loc.x,this.loc.y,this.rad,0,2*Math.PI);
  // ctx.fillStyle = this.c;
  // ctx.fill();
  // ctx.strokeStyle = this.c;
  // ctx.stroke();
}

Mover.prototype.applyForce = function(f){
  this.acc.add(f);
}
