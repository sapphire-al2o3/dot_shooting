(function() {
	'use strict';
	
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		
		ENEMY_MAX = 50,
		SHOT_MAX = 50,
		EFFECT_MAX = 50,
		RENDER_W = 160,
		WINDOW_H = 120,
		SCROLL_LEFT = 60,
		SCROLL_RIGHT = 160,
		SCROLL_W = SCROLL_RIGHT - SCROLL_LEFT,
		PLAYER_X = SCROLL_RIGHT,
		PLAYER_Y = WINDOW_H - 5,
		FRAME_LEFT = SCROLL_LEFT - 2,
		FRAME_RIGHT = SCROLL_RIGHT + 2,
		
		player,
		bomb = {},
		enemys = [],
		bullets = [],
		effects = [],
		
		frame,
		time = 0,
		pause = false,
		content = {};
	
	content.score = 0;
	content.level = 0;
	content.time = 0;
		
	var sprite = new Sprite('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAABlBMVEUAAAD///+l2Z/dAAAAj0lEQVQY063NwQ3DIAwF0B+IyiEHLPUSqYeu0UOkZpqMQd0NOkJG6AiWsgi3rlEwkKr3fEt+FsIAlHRaDcu5cH5d1uENH724iJMo/dyzmbFHF3YsOk4M4taEYys/DBvGTQPKnZClBEg7qLxJVfw7TdrCAowhfDaMad6ejXrYrpQFH3XyolwrrNwr5Y8HDsgX1kolq0M9FpsAAAAASUVORK5CYII=');
	
	var hud = new Sprite('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAB4AQMAAAB4jmZdAAAABlBMVEUAAAD///+l2Z/dAAAAvElEQVQ4y2NgIAWwP4Ay+GAifOzn588HS52RiDBoALF0JCLsYQwDEM1//PwM+QZkc+r/g8BMhsEL+JAZbBCfnlE/Bmbw6OiogRn8z/yfQUTYfMBq+J8/bn/GMFR9yvMBJnIYEs98vN8EoFLHP0AZxyBq+N8c/sCAxac3B42/+DHTKn9//0aI4yMiNkK8E38Dyojgnw+R8j/QCEvtfMRGpTxY6gcDAyS4OEhkwLXjALkvoYxaWOIK1Rzg0AUAiVFPTW6jsVQAAAAASUVORK5CYII=');
	
	var number = new Sprite('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAJAQMAAACfXjnRAAAABlBMVEUAAAD///+l2Z/dAAAARUlEQVQI12OwMXz8yL1fzqaCgSHng0HaGWmznBtApgGQKYHJ/Pjs/Hyzmh9ApmFD+sHZbDkSYGYCJrNC8fOBfjmWCgEGAPXJIo4uZ9ggAAAAAElFTkSuQmCC');
	
	// player
	sprite.frame(0, 0, 16, 8);
	sprite.frame(16, 0, 16, 8);
	sprite.frame(32, 0, 16, 8);
	
	// back fire
	sprite.frame( 0, 16, 8, 8);
	sprite.frame( 8, 16, 8, 8);
	sprite.frame(16, 16, 8, 8);
	sprite.frame(24, 16, 8, 8);
	sprite.frame(32, 16, 8, 8);
	sprite.frame(40, 16, 8, 8);
	
	// HP
	sprite.frame( 0, 32, 12, 8);
	
	number.slice(7, 9, 80);
	
	content.number = number;
	
	Input.bind();
	
	var a_c = 0;
	
	var gl = document.getElementById('screen').getContext('webgl'),
		display = new Display(gl);
	
	var Main = {
		init: init,
		update: update,
		draw: draw
	};
	
	Scene.set([Title, Main, GameOver], content);
	
	Scene.load(0);
	mainloop();
	
	function mainloop() {
		Input.update();
		
		Scene.update();
		Scene.draw(ctx);
		display.draw(canvas);

		frame++;
		
		requestAnimationFrame(mainloop);
	}
	
	function init() {
		for(var i = 0; i < SHOT_MAX; i++) {
			bullets[i] = new Bullet();
		}
		
		for(var i = 0; i < ENEMY_MAX; i++) {
			enemys[i] = new Enemy();
		}
		
		for(var i = 0; i < EFFECT_MAX; i++) {
			effects[i] = new Effect();
		}
		
		player = new Player();
		frame = 0;
		pause = false;
		content.level = 1;
		content.score = 0;
		content.time = 0;
		bomb.x = 0;
		bomb.y = 0;
		bomb.count = 0;
		time = Date.now();
	}
	
	function update() {
		
		if(Input.getKeyDown(13)) {
			pause = !pause;
            if(pause) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
		}
		
		if(pause) return;
		
		createEnemy();
		move();
		moveEnemy();
		
		bullets.forEach(function(b) {
			if(b.life) {
				b.y -= 4;
				if(b.y < -16) b.life = 0;
			}
		});
		
		hitEmeny();
		hitPlayer();
		
		if(bomb.count === 51) {
			breakEnemy();
		}
		
		if(content.score > content.level * 100) content.level++;
		
		if(player.life === 0) {
			content.time = Date.now() - time;
			Scene.load(2);
		}
	}
	
	function draw() {
		
		if(pause) return;
		
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.save();
		ctx.beginPath();
		ctx.rect(FRAME_LEFT, 0, FRAME_RIGHT - FRAME_LEFT, WINDOW_H);
		ctx.clip();
		
		
		ctx.fillStyle = '#FFF';
		
		// 弾
		bullets.forEach(function(b) {
			if(b.life) {
				ctx.fillRect(b.x, b.y, 1, -6);
			}
		});
		
		// player
		if(player.life > 0 && !(player.hit & 8)) {
			var a = player.vx > 0 ? 1 : player.vx < 0 ? 2 : 0;
			sprite.draw(ctx, player.x - 7, player.y - 4, a);
			
			if(frame % 8 == 0) {
				a_c = (a_c + 1) % 6;
			}
			if(player.vy > 0) {
				a_c = 0;
			} else if(player.vy < 0) {
				a_c = 2;
			}
			sprite.draw(ctx, player.x - 3, player.y + 5, 3 + a_c);
		}
		
		ctx.fillStyle = '#FFF';
		
		// 敵
		enemys.forEach(function(e) {
			if(e.life) {
				ctx.fillRect(e.x - e.life / 2 | 0, e.y - e.life / 2 | 0, e.life, e.life);
			}
		});
		
		// エフェクト
		effects.forEach(function(e) {
			if(e.life) {
				var r0 = 1,
					r1 = 0;
				if(e.life > 16) {
					r0 = r1 = 0;
				} else if(e.life > 8) {
					r0 = 4;
				} else if(e.life > 3) {
					r0 = 10;
				} else {
					r0 = 10;
					r1 = 8;
				}
				ctx.fillStyle = '#FFF';
				ctx.beginPath();
				ctx.arc(e.x, e.y, r0, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.arc(e.x, e.y, r1, 0, Math.PI * 2);
				ctx.fill();
				e.life--;
			}
		});
		
		if(bomb.count > 50) {
			var r = 110 - bomb.count;
			ctx.fillStyle = '#FFF';
			ctx.beginPath();
			ctx.arc(bomb.x, bomb.y, r, 0, Math.PI * 2);
			ctx.fill();
			bomb.count--;
		}
		
		// レーザー
		if(player.laser) {
			ctx.fillStyle = '#FFF';
			var x = player.x - player.laser / 4 + 1 | 0;
			ctx.fillRect(x, 0, player.laser / 2 | 0, player.y - 6);
		}
		
		// シールド
		if(player.shield) {
			ctx.strokeStyle = '#FFF';
			ctx.beginPath();
			ctx.arc(player.x, player.y, 8, 0, Math.PI * 2);
			ctx.stroke();
		}
		
		ctx.restore();
		
		// hud
		
		hud.draw(ctx, 0, 0);
		
		// laser
		ctx.fillStyle = '#FFF';
		ctx.fillRect(5, 95, 46 - player.enegy * 46 / 1000 | 0, 4);
		
		// HP
		for(var i = 0; i < player.life; i++) {
			sprite.draw(ctx, i * 10 + 2, 68, 9);
		}
		if(!(player.hit & 8) && player.hit > 0) {
			sprite.draw(ctx, player.life * 10 + 2, 68, 9);
		}
		
		// スコア
		drawNumber(content.score, 52, 18);
		
		// level
		drawNumber(content.level, 52, 46);
	}
	
	// 数字の表示
	function drawNumber(n, x, y) {
		do {
			var d = n % 10;
			number.draw(ctx, x, y, d);
			x -= 7;
			n = n / 10 | 0;
		} while(n);
	}
	
	// 敵の生成
	function createEnemy() {
		if(frame % 10) return;
		
		for(var i = 0; i < enemys.length; i++) {
			var e = enemys[i];
			if(e.life == 0) {
				e.type = 1 + rand(clamp(content.level, 0, 100));
				e.y = -10 - e.type / 4 | 0;
				e.x = Math.random() * SCROLL_W + SCROLL_LEFT | 0;
				e.life = e.type;
				break;
			}
		}
	}
	
	// プレイヤーの移動
	function move() {
		
		if(player.life === 0) return;
		
		var vx = Input.getAxisX(),
			vy = Input.getAxisY();
		
		var x = player.x + vx * 2,
			y = player.y + vy * 2;
		
		x = clamp(x, SCROLL_LEFT, PLAYER_X);
		y = clamp(y, 0, PLAYER_Y);
		
		player.x = x;
		player.y = y;
		player.vx = vx;
		player.vy = vy;
		
		// shot
		if(Input.getKey(32)) {
			createShot(x, y);
		}
		
		
		if(!player.empty) {
			if(Input.getKey(90)) {
				// laser
				player.laser++;
				player.enegy += 4;
			} else if(Input.getKey(83)) {
				// shield
				player.shield++;
				player.enegy += 4;
			} else {
				player.laser--;
				player.shield--;
				player.enegy--;
			}
			
		} else {
			player.enegy -= 2;
		}
		player.laser = clamp(player.laser, 0, 10);
		player.shield = clamp(player.shield, 0, 10);
		player.enegy = clamp(player.enegy, 0, 1000);
		if(player.empty && player.enegy === 0) {
			player.empty = false;
		}
		if(player.enegy === 1000) {
			player.laser = 0;
			player.shield = 0;
			player.empty = true;
		}
		if(Input.getKeyDown(66)) {
			createBomb(player.x, player.y);
		}
	}
	
	// 敵の移動
	function moveEnemy() {
		for(var i = 0; i < enemys.length; i++) {
			enemys[i].move();
		}
	}
	
	// 敵と弾の当たり判定
	function hitEmeny() {
		
		if(player.laser) {
			enemys.forEach(function(e) {
				if(e.life) {
					var dx = e.x - player.x;
					if(Math.abs(dx) <= e.life + 1 && e.y < player.x) {
						e.life--;
						if(e.life === 0) {
							content.score += e.type;
							createEffect(e.x, e.y);
						}
					}
				}
			});
		}
		
		bullets.forEach(function(b) {
			if(b.life) {
				enemys.forEach(function(e) {
					if(e.life) {
						var d = e.life * e.life + 16;
						if(distance2(e, b) < d) {
							e.life--;
							b.life = 0;
							if(e.life === 0) {
								content.score += e.type;
								createEffect(e.x, e.y);
							}
						}
					}
				});
			}
		});
	}
	
	// プレイヤーと敵の当たり判定
	function hitPlayer() {
		if(player.hit) {
			player.hit--;
			return;
		}
		
		if(player.shield) {
			return;
		}
		
		for(var i = 0; i < enemys.length; i++) {
			var e = enemys[i];
			if(e.life) {
				var dx = e.x - player.x,
					dy = e.y - player.y,
					d = e.life;
				if(dx * dx + dy * dy < d * d + 4) {
					player.life--;
					player.hit = 100;
					break;
				}
			}
		}
	}
	
	// 弾生成
	function createShot(x, y) {
		player.reload--;
		if(player.reload) return;
		player.reload = 8;
		
		var count = 0;
		
		for(var i = 0; i < bullets.length; i++) {
			var b = bullets[i];
			if(!b.life && count < 6 - player.life) {
				b.x = x + count * 6 - (5 - player.life) * 3;
				b.y = y;
				b.life = 1;
				count++;
			}
		}
	}
	
	
	// ボムの生成
	function createBomb(x, y) {
		if(player.life === 1 || player.hit) return;
		player.life--;
		player.hit = 100;
		bomb.count = 100;
		bomb.x = x;
		bomb.y = y;
	}
	
	// エフェクト生成
	function createEffect(x, y, w) {
		w = w || 0;
		for(var i = 0; i < effects.length; i++) {
			var e = effects[i];
			if(e.life === 0) {
				e.life = 16 + w;
				e.x = x;
				e.y = y;
				break;
			}
		}
	}
	
	// 敵全滅
	function breakEnemy() {
		enemys.forEach(function(e) {
			if(e.life) {
				content.score += e.type;
				e.life = 0;
				createEffect(e.x, e.y, rand(3) * 10);
			}
		});
	}
	
})();
