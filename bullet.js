var Bullet = function() {
	this.x = 0;
	this.y = 0;
	this.life = 0;
};

Bullet.prototype.update = function() {
	this.y -= 4;
	if(this.y < -8) this.life = 0;
};
