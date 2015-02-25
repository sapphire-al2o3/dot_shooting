var Effect = function() {
	this.x = 0;
	this.y = 0;
	this.life = 0;
};

Effect.prototype.update = function() {
	this.life--;
};
