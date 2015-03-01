var Pad = function() {
	'use strict';
	
	var keyState = [],
		prevKeyState = [],
		chenged = [];
	
	return {
		getKey: function(k) {
			return keyState[k];
		},
		getKeyDown: function(k) {
			return changed[k] & keyState[k];
		},
		getKeyUp: function(k) {
			return changed[k] & !keyState[k];
		},
		update: function() {
			var pad = navigator.webkitGetGamepads()[0];
			if (pad) {
				for(var i = 0; i < pad.buttons.length; i++) {
					keyState[i] = pad.buttons[i];
					changed[i] = keyState[i] ^ prevKeyState[i];
					prevKeyState[i] = keyState[i];
				}
			}
		}
	};
}();