var Pad = function() {
	'use strict';
	
	var pad,
		keyState = [],
		prevKeyState = [],
		chenged = [];
	
	function connected(e) {
		
	}
	
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
		getAxisX: function() {
//			pad.axis
		},
		update: function() {
			pad = navigator.webkitGetGamepads()[0];
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