var Title = (function() {
	'use strict';
	
	var ui = new Sprite('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAgAQMAAAC//W0vAAAABlBMVEUAAAD///+l2Z/dAAAAgklEQVQY02NgIAHwNz/8w8Df//AHA4PMcYECBhnm5gYg0x0nk5+5eQeUydiMzJwBNQHClG9+UMAgz9z8gQg31DEwsD9gOANipjEwsCUw3AEz35Wz5S34eQWkoCuNPWvBxxAgM6HHmC1rwc0pIGZfOVvWg7N3YMYoMLDAmAkMPAw0AwDjEy4mFtlPUQAAAABJRU5ErkJggg==');
	
	ui.frame(0, 0, 80, 16);
	ui.frame(0, 16, 64, 8);
	
	var count = 0,
		frame = 0,
		t = 0,
		timeline = 0,
		fade = false;
	
	function init(cnt) {
		count = 0;
		t = 0;
		timeline = 0;
		fade = false;
		frame = 0;
	}
	
	function update() {
		switch(timeline) {
		case 0:
//			if(t === 60) {
				timeline++;
//			}
//			t++;
			break;
		case 1:
			if(Input.getAnyKey()) {
				timeline++;
				t = 60;
				fade = true;
			}
			break;
		case 2:
			if(t === 0) {
				timeline++;
				t = 1;
			}
			t--;
			break;
		case 3:
			Scene.load(1);
			break;
		}
		frame++;
	}
	
	function draw(ctx) {
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		ui.draw(ctx, 44, 36, 0);
		if(fade || frame & 32) {
			ui.draw(ctx, 48, 82, 1);
		}
		
		if(fade) {
			ctx.globalAlpha = clamp(1 - t / 60, 0, 1);
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}
	
	return {
		init: init,
		update: update,
		draw: draw
	};
	
})();
