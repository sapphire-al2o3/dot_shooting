var Enemy = function(x, y) {
	this.x = x;
	this.y = y;
	this.type = 0;
	this.life = 0;
	this.hit = 0;
};

Enemy.prototype.move = function() {
	switch(this.type % 6) {
		case 3:
			this.y += 2;
			break;
		case 4:
			if(this.life == 4) this.y++;
			break;
		case 5:
			if(this.life != this.type) this.y += 2;
		default:
			this.y += 1;
	}
	if(this.y > 480) this.life = 0;
};
