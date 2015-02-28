var Input = function() {
	'use strict';
	
	var target,
		keyCode,
		keyCount = 0,
		keyState = [],
		prevKeyState = [],
		changed = [];
	
	var KEY_LEFT = 37,
		KEY_RIGHT = 39;
	
	keyState[37] = 0;
	keyState[38] = 0;
	keyState[39] = 0;
	keyState[40] = 0;
	
	function keydown(e) {
		keyCode = e.keyCode;
		keyState[e.keyCode] = true;
		e.preventDefault();
	}
	
	function keyup(e) {
		keyCode = 0;
		keyState[e.keyCode] = false;
		e.preventDefault();
	}
	
	return {
		bind: function(t) {
			target = t || document;
			target.addEventListener('keydown', keydown);
			target.addEventListener('keyup', keyup);
		},
		unbind: function() {
			target.removeEventListener('keydown', keydown);
			target.removeEventListener('keyup', keyup);
		},
		getKeyDown: function(k) {
			return changed[k] & keyState[k]
		},
		getKeyCode: function() {
			return keyCode;
		},
		getAnyKey: function() {
			return keyCount > 0;
		},
		getKey: function(k) {
			return keyState[k];
		},
		getKeyUp: function(k) {
			return changed[k] & !keyState[k];
		},
		getAxisX: function() {
			return keyState[39] - keyState[37];
		},
		getAxisY: function() {
			return keyState[40] - keyState[38];
		},
		update: function() {
			keyCount = 0;
			for(var k in keyState) {
				changed[k] = keyState[k] ^ prevKeyState[k];
				prevKeyState[k] = keyState[k];
				keyCount += changed[k] & keyState[k];
			}
		}
	};
}();

