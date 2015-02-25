var Transition = (function() {
	'use strict';
	
	var VS =
		"attribute vec2 position;" +
		"varying vec2 uv;" +
		"void main(){" +
		"uv=position.xy*0.5+0.5;" +
		"gl_Position=vec4(position.xy,0.0,1.0);}";
	
	var FS =
		"precision mediump float;" +
		"varying vec2 uv;" +
		"uniform sampler2D tex;" +
		"uniform float alpha;" +
		"void main(){" +
		"vec4 c=texture2D(tex, uv);" +
		"if(tex.r<alpha)discard;" +
		"gl_FragColor=c;}";
	
	var gl,
		buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
	
	function createTexture() {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		return texture;
	}
	
	function getShader(src, kind) {
		var s = gl.createShader(kind);
		gl.shaderSource(s, src);
		gl.compileShader(s);
		return s;
	}
	
	function createShader(fs, vs) {
		var p = gl.createProgram();
		gl.attachShader(p, getShader(vs, gl.VERTEX_SHADER));
		gl.attachShader(p, getShader(fs, gl.FRAGMENT_SHADER));
		gl.linkProgram(p);
		return p;
	}
	
	function Transition(context, image) {
		gl = context;
		
		this.width = gl.drawingBufferWidth;
		this.height = gl.drawingBufferHeight;
		this.quad = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
		gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
		
		this.program = createShader(FS, VS);
		gl.useProgram(this.program);
		
		var location = [];
		location.push(gl.getUniformLocation(this.program, 'tex'));
		location.push(gl.getUniformLocation(this.program, 'alpha'));
		this.location = location;
		
		var texture = createTexture();
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture)
		
		gl.viewport(0, 0, this.width, this.height);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.DEPTH_TEST);
		
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	}
	
	Transition.prototype.draw = function(t) {
		gl.useProgram(this.program);
		gl.uniform1f(this.location[1], t);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};
	
	return Transition;
})();
