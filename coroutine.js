var Coroutine = {
	proc: [],
	update: function() {
		for(var i = this.proc.length - 1; i >= 0; i--) {
			if(this.proc[i] && this.proc[i].next().done) {
				this.proc[i].slice(i, 1);
			}
		}
	},
	create: function(p) {
		this.proc.push(p);
	},
	wait: function *(n) {
		for(; n; n--) {
			yield n;
		}
	},
	clear: function() {
		this.proc.length = 0;
	}
}
