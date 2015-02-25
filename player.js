var Player = function() {
	this.x = 140;
	this.y = 100;
	this.vx = 0;
	this.vy = 0;
	this.reload = 8;
	// あたったフラグ
	this.hit = 0;
	// 体力
	this.life = 5;
	this.laser = 0;
	this.enegy = 0;
	this.empty = false;
	this.shield = 0;
};
