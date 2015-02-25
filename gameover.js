var GameOver = function() {
	'use strict';
	
	var ui = new Sprite('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABAAQMAAADf+uBNAAAABlBMVEUAAAD///+l2Z/dAAAAxElEQVQoz2NgIAPItx9usmeQ51P++IGBwYJP+ZgFg0WfcuMJMOcdMmcXiOMM4lj3P55kx2DR5vwQqMe6T7kJKNN+GCRjCeU0I3GawRx7PmWQPczNH88wUA7skTkFKBy7mj8/YBy7hEMHW2AcRiDnDzKnAcaps6s58AerPf/BwIiB1qAAnWOA8E+iHYKTmJiI4NQb1SM4CUYJcE69vYy9wYD6px6ZI5OAzOE/fgDByc1RQOLkP0CWQdKTm/6AAY9/NlHH0QCDbVgY+Oe/SQAAAABJRU5ErkJggg==');

	var frame = 0,
		timeline = 0,
		t = 0,
		score,
		level,
		time,
		pos = [],
		cursor = 0,
		content;
	
	ui.frame(0, 0, 96, 16);
	ui.frame(0, 16, 56, 16);
	ui.frame(0, 32, 56, 16);
	ui.frame(0, 48, 56, 16);
	
	for(var i = 0; i < 4; i++) {
		pos.push({x: 0, y: 0});
	}
	
	function init(cnt) {
		frame = timeline = t = 0;
		score = level = time = 0;
		content = cnt;
		cursor = 0;
		pos[0].x = 200; pos[0].y = 4;
		pos[1].x = 200; pos[1].y = 28;
		pos[2].x = 200; pos[2].y = 58;
		pos[3].x = 200; pos[3].y = 88;
	}

	function gameover(deltaTime) {

		switch(timeline) {
		case 0:
			if(t > 120) timeline++;
			pos[0].x = clamp(pos[0].x - 4, 10, 1000);
			if(t > 10) pos[1].x = clamp(pos[1].x - 4, 48, 1000);
			if(t > 20) pos[2].x = clamp(pos[2].x - 4, 74, 1000);
			if(t > 30) pos[3].x = clamp(pos[3].x - 4, 96, 1000);
			t++;
			break;
		case 1:
			timeline++;
			break;
		case 2:
			if(Input.getAnyKey()) {
				timeline++;
				t = 0;
			}
			break;
		case 3:
			if(t > 120) timeline++;
			
			pos[0].x -= 4;
			if(t > 10) pos[1].x -= 4;
			if(t > 20) pos[2].x -= 4;
			if(t > 30) pos[3].x -= 4;
			
			t++;
			break;
		case 4:
			Scene.load(0);
			break;
		}

		frame++;

		return 1;
	}

	function draw(ctx) {
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for(var i = 0; i < 4; i++) {
			ui.draw(ctx, pos[i].x, pos[i].y, i);
		}
		drawNumber(ctx, content.number, content.score, pos[1].x + 48, 46);
		drawNumber(ctx, content.number, content.level, pos[2].x + 48, 75);
		drawNumber(ctx, content.number, content.time / 1000 | 0, pos[3].x + 48, 104);
	}
	
	function drawNumber(ctx, s, n, x, y) {
		do {
			var d = n % 10;
			s.draw(ctx, x, y, d);
			x -= 7;
			n = n / 10 | 0;
		} while(n);
	}
	
	function tweet() {
		var url = 'https://twitter.com/share?url=' + encodeURIComponent(location.href);
		url += '&text=' + encodeURIComponent('DOT STG score:' + content.score + ' #jsstg');
		window.open(url);
	}
	
	return {
		init: init,
		update: gameover,
		draw: draw
	};

}();