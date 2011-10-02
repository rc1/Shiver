var ShiverAbstract = Backbone.View.extend({

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

	randomizeColor : function () {
		this.color = {		
			r : Math.floor(Math.random() * 255),
			g : Math.floor(Math.random() * 255),
			b : Math.floor(Math.random() * 255) 	
		};

		return this;
	}

});

///
//
//	Shiver Sketch
// 	

var ShiverWindows = ShiverAbstract.extend({

	windows : [], 
	numWindows : 100,

	initialize : function () {
		
		for (var i=0; i<this.numWindows; i++) {

			// Chrome blocks pop-ups sent via timeout. Timeout needed for Safari to render the background color before all windows are created
			if (window.clientInformation.userAgent.indexOf("Chrome") == -1) {

				setTimeout(_.bind(function () {

					var shiverWindow = new ShiverWindow();
					shiverWindow.render();
					this.windows.push(shiverWindow);

				}, this), 0);

			} else {
			
				var shiverWindow = new ShiverWindow();
				shiverWindow.render();
				this.windows.push(shiverWindow);

			}
			
		}

	}

});

var ShiverWindow = ShiverAbstract.extend({
	
	windowRef : undefined,
	lifeSpan : 1000,
	width : 100,
	height : 100,

	initialize : function (options) {

		this.windowRef = window['open']("", this.cid, this.windowOptString());

		this.el = $("body", this.windowRef.document);

		$(this.el).append("<div style=\"background-color:#000000;width:100%;height:100%\"></div>");

		$(this.el).css({ margin : 0, padding : 0 });

		setTimeout(_.bind(function () { this.windowRef.close()}, this), this.lifeSpan);

	},

	render : function () {

		this.randomPosition();

		$("div", this.el).css({ backgroundColor : this.randomizeColor().getRGBA() });

		return this;

	},
	
	windowOptString : function (/* obj */) {
		
		return "width="+this.width+",height="+this.height;

	},

	randomPosition : function () {
		
		var availibleWidth = window.screen.width - this.width,
			availibleHeight = window.screen.height - this.height,
			x = Math.floor(availibleWidth * Math.random()),
			y = Math.floor(availibleHeight * Math.random());

		this.windowRef.moveTo(x, y);

		return this;
	}

});

var Juggler = function () {
	
	var self = this;
	
	this.fps = 27,
	this.callbacks = [],
	this.intervalID = 0,
	this.stats = {
		frameCount : 0
	};

	this.start = function () {
		self.intervalID = setInterval(self.callCallbacks, 1000 / self.fps);
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

var ShiverController = ShiverAbstract.extend({
	
	events : { "click" : "clicked" },
	juggler : new Juggler(),
	// Stripes
	shiverStripeCount : 1024,
	shiverStripes : [],
	// Windows
	shiverWindows : [],

	initialize : function (options) {

		///////
		//////	ShiverStripes
		/////
		var shiverStripeWidth = Math.ceil($(document).width() / this.shiverStripeCount);
		var shiverStripeHeight = $(document).height();
		
		for (var i=0; i<this.shiverStripeCount; i++ ) {
			var shiverStripe = new ShiverStripe();
			this.shiverStripes.push(shiverStripe);
			shiverStripe.width = shiverStripeWidth;
			shiverStripe.height = shiverStripeHeight;
			shiverStripe.left = shiverStripe.width * i;
			$(this.el).append(shiverStripe.render().el);
		}
		this.juggler.addCallback(_.bind(this.render, this)).start();

	},

	render : function () {
		_.each(this.shiverStripes, function (shiver) { shiver.render(); });	
	},

	clicked : function (event) {

		var ShiverWindows = new window.ShiverWindows();

		return false;
	}

});

var ShiverStripe = ShiverAbstract.extend({
	
	tagName	: "div", 

	initialize : function () {
		this.randomizeColor();
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