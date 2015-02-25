(function(global) {
	
	// maxまでの整数の乱数を発生させる
	function rand(max) {
		return Math.random() * (max + 1) | 0;
	}
	
	// aとbの距離の二乗を求める
	function distance2(a, b) {
		var dx = a.x - b.x,
			dy = a.y - b.y;
		return dx * dx + dy * dy;
	}
	
	// 値をクランプする
	function clamp(x, min, max) {
		return x < min ? min : x > max ? max : x;
	}
	
	global.rand = rand;
	global.distance2 = distance2;
	global.clamp = clamp;
	
})(this);
