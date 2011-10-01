///
//
//	Shiver Sketch
// 	
///

var Juggler = function () {
	
	var self = this;
	
	this.fps = 10,
	this.callbacks = [],
	this.intervalID = 0,
	this.stats = {
		frameCount : 0
	};

	this.start = function () {
		self.intervalID = setInterval(self.callCallbacks, self.fps);
		return self;
	};

	this.stop = function () {
		clearInterval(self.intervalID);
		return self;
	};

	this.addCallback = function (callback) {
		self.callbacks.push(callback);
		return self;
	};

	this.removeCallback = function (callback) {
		self.callbacks.pop(callback);
		return self;
	};

	this.callCallbacks = function () {
		self.stats.frameCount++;
		_.each(self.callbacks, function (callback) { callback(); });
		return self;	
	};
};

var ShiverController = Backbone.View.extend({
	
	events : { "click" : "clicked" },
	juggler : new Juggler(),
	shiverCount : 1024,
	shivers : [],

	initialize : function (options) {

		var shiverWidth = Math.ceil($(document).width() / this.shiverCount);
		var shiverHeight = $(document).height();
		
		for (var i=0; i<this.shiverCount; i++ ) {
			var shiver = new Shiver();
			this.shivers.push(shiver);
			shiver.width = shiverWidth;
			shiver.height = shiverHeight;
			shiver.left = shiver.width * i;
			$(this.el).append(shiver.render().el);
		}

		this.juggler.addCallback(_.bind(this.render, this)).start();

	},

	render : function () {
		_.each(this.shivers, function (shiver) { shiver.render(); });	
	},

	clicked : function () {

		return false;
	}

});

var Shiver = Backbone.View.extend({
	
	tagName	: "div", 
	top : 0,
	left : 0,
	width : 0,
	height : 0,

	getCSS : function () {
		return {
			position: "absolute",
			top: this.top,
			left: this.left,
			width : this.width,
			height: this.height,
			backgroundColor : this.getRGBA()
		};
	},

	getRGBA : function () {
		return "rgba(" + this.color.r + ",  " + this.color.g + ", " + this.color.b + ", 1)";
	},

	initialize : function () {
		this.randomizeColor();
	},

	randomizeColor : function () {
		this.color = {		
			r : Math.floor(Math.random() * 255),
			g : Math.floor(Math.random() * 255),
			b : Math.floor(Math.random() * 255) 	
		};

		return this;
	},

	render : function () {
		$(this.el).css(this.randomizeColor().getCSS());
		return this;
	}

});

/////
////	On Load
///
$(function () {
	
	var shiverController = new ShiverController({ el: $("#theTrigger") });

});