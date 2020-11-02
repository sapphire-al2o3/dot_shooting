var Sprite = function(src) {
	this.image = new Image();
	this.image.src = src;
	this.frames = [];
};

Sprite.prototype.frame = function(x, y, w, h) {
	this.frames.push({
		x: x,
		y: y,
		w: w,
		h: h,
		f: 0
	});
};

Sprite.prototype.slice = function(w, h, width) {
	for(var i = 0; i < width; i++) {
		this.frames.push({
			x: i * w,
			y: 0,
			w: w,
			h: h,
			f: 0
		});
		width -= w;
	}
};

Sprite.prototype.draw = function(ctx, x, y, i) {
	if(i === undefined) {
		ctx.drawImage(this.image, x, y);
	} else {
		var f = this.frames[i];
		ctx.drawImage(this.image, f.x, f.y, f.w, f.h, x, y, f.w, f.h);
	}
};
