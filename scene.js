var Scene = (function() {

	var current,
		scenes,
		content;
	
	function set(s, cnt) {
		current;
		scenes = s;
		content = cnt;
	};

	function load(l) {
		current = scenes[l];
		current.init(content);
	};

	function update() {
		current.update();
	};

	function draw(ctx) {
		current.draw(ctx);
	};
	
	return {
		set: set,
		load: load,
		update: update,
		draw: draw
	};
	
})();
