var Pad = function() {
	'use strict';
	
	var keyState = [];
	
	return {
		getKey: function(k) {
			return keyState[k];
		},
		update: function() {
			var pad = navigator.webkitGetGamepads()[0];
			if (pad) {
				pad.buttons[i];
			}
		}
	};
}();