var Scene = (function() {
	
	var now = Date.now,
		time = now();
	
	function loop(cb) {
		var deltaTime = now() - time;
		time = now();
		if(cb(deltaTime)) {
			requestAnimationFrame(loop);
		}
	}
	
	var scenes = [],
		scene;
	
	function load(s) {
		scene = scenes[s];
		scene.init();
	}
	
	return {
		load: load,
	};
	
})();
