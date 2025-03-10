var registerAudioContext = require('./register-audio-context');
var activeAudioContext = require('./active-audio-context');
// TODO-PER: The require statements for svg don't play well for node apps without extra plugins. The following lines would be clearer than inlining the SVG
// var loopImage = require('./images/loop.svg');
// var playImage = require('./images/play.svg');
// var pauseImage = require('./images/pause.svg');
// var loadingImage = require('./images/loading.svg');
// var resetImage = require('./images/reset.svg');
var loopImage = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" preserveAspectRatio="xMidYMid meet">\n' +
	'<g transform="translate(0,700) scale(0.1,-0.1)" >\n' +
	'<path d="M3111 6981 c-20 -37 -90 -55 -364 -96 -120 -18 -190 -33 -244 -55 ' +
	'-42 -17 -124 -42 -182 -56 -78 -18 -119 -34 -157 -60 -28 -19 -86 -46 -128 ' +
	'-60 -43 -13 -107 -42 -144 -64 -37 -23 -84 -46 -106 -52 -21 -7 -56 -29 -79 ' +
	'-50 -22 -22 -61 -50 -86 -63 -26 -13 -67 -40 -91 -60 -24 -20 -65 -47 -90 -60 ' +
	'-25 -13 -53 -31 -61 -41 -8 -9 -32 -30 -54 -46 -75 -54 -486 -460 -512 -507 ' +
	'-15 -25 -48 -69 -75 -98 -26 -28 -48 -57 -48 -63 0 -6 -18 -29 -39 -53 -21 ' +
	'-23 -56 -71 -77 -107 -20 -36 -50 -80 -65 -97 -16 -18 -33 -52 -40 -75 -12 ' +
	'-47 -47 -115 -84 -166 -13 -18 -30 -56 -38 -83 -8 -27 -34 -80 -56 -118 -33 ' +
	'-53 -46 -91 -62 -167 -12 -63 -34 -127 -59 -179 -42 -84 -60 -166 -60 -270 0 ' +
	'-90 26 -122 125 -154 54 -17 96 -19 430 -20 305 -1 381 2 430 14 82 22 140 51 ' +
	'153 78 6 12 22 47 37 77 14 30 38 77 54 103 15 27 34 73 40 103 7 30 28 78 48 ' +
	'107 19 28 44 74 55 101 10 28 34 67 53 87 18 20 49 61 68 90 19 30 44 63 57 ' +
	'74 13 11 36 40 52 65 59 94 232 270 306 313 20 11 57 37 82 58 25 20 70 52 ' +
	'100 72 30 19 66 47 79 61 13 14 49 35 80 46 30 12 80 37 111 56 31 19 95 45 ' +
	'143 58 48 12 110 37 139 55 63 40 127 55 323 76 83 9 208 28 279 41 156 29 ' +
	'165 29 330 4 453 -71 514 -84 606 -130 31 -16 83 -36 116 -45 32 -9 84 -34 ' +
	'115 -56 31 -21 82 -48 113 -60 32 -11 72 -33 89 -48 18 -16 59 -45 92 -65 33 ' +
	'-21 74 -51 90 -66 17 -15 49 -40 73 -54 52 -32 65 -61 50 -113 -8 -31 -61 -90 ' +
	'-277 -308 -300 -303 -361 -382 -369 -481 -2 -29 0 -66 6 -81 13 -40 88 -138 ' +
	'115 -151 12 -6 54 -26 92 -44 l70 -33 945 -2 c520 -1 975 2 1012 7 64 8 191 ' +
	'50 231 76 11 7 33 34 50 60 22 34 42 51 65 58 l32 9 0 1101 0 1102 -32 9 c-21 ' +
	'7 -44 26 -64 55 -60 84 -77 97 -140 110 -44 9 -76 10 -127 2 -59 -9 -77 -17 ' +
	'-134 -62 -37 -28 -172 -155 -301 -281 -129 -127 -249 -237 -267 -245 -25 -10 ' +
	'-41 -11 -71 -2 -58 15 -112 45 -124 69 -6 11 -35 35 -64 54 -28 18 -58 41 -66 ' +
	'50 -8 9 -41 35 -75 58 -33 22 -77 56 -99 75 -21 18 -64 46 -95 61 -31 14 -73 ' +
	'39 -93 55 -20 15 -70 40 -110 55 -40 15 -97 44 -127 64 -29 21 -78 44 -107 53 ' +
	'-30 8 -77 31 -105 51 -42 28 -73 39 -173 60 -68 14 -154 39 -196 58 -95 43 ' +
	'-131 51 -343 76 -209 24 -242 32 -279 70 l-30 29 -328 0 c-312 0 -330 -1 -339 ' +
	'-19z"></path>\n' +
	'<path d="M254 2875 c-89 -16 -107 -26 -145 -78 -32 -44 -62 -66 -91 -67 -17 0 ' +
	'-18 -61 -18 -1140 l0 -1140 24 0 c16 0 41 -17 72 -50 40 -42 61 -55 117 -72 ' +
	'l69 -21 82 23 c44 12 96 30 114 39 18 9 148 132 290 272 141 141 267 261 279 ' +
	'268 51 26 86 14 176 -61 32 -26 62 -48 66 -48 5 0 36 -25 70 -55 34 -30 74 ' +
	'-61 89 -69 15 -8 37 -28 50 -45 12 -17 50 -45 84 -62 34 -17 78 -44 98 -60 19 ' +
	'-16 61 -37 93 -48 32 -11 81 -37 107 -56 27 -20 76 -45 109 -56 33 -12 75 -31 ' +
	'93 -44 62 -45 93 -58 191 -82 54 -12 130 -37 168 -54 68 -29 180 -58 226 -59 ' +
	'62 0 183 -64 183 -96 0 -12 88 -14 639 -14 l639 0 12 30 c18 44 76 66 233 89 ' +
	'89 14 160 30 200 47 34 15 106 42 159 60 54 18 112 44 130 57 47 35 85 52 146 ' +
	'67 29 7 76 28 105 48 29 20 77 48 107 63 30 15 66 39 80 54 14 15 50 40 81 56 ' +
	'31 15 78 46 104 69 26 22 61 46 79 54 17 7 43 26 56 42 14 16 41 41 60 56 64 ' +
	'48 380 362 408 405 15 23 40 51 55 63 15 12 36 38 46 58 11 21 37 57 58 82 22 ' +
	'25 49 62 62 83 13 20 38 56 57 78 19 23 50 74 69 113 19 39 46 86 59 104 14 ' +
	'18 34 62 46 98 12 36 32 77 45 92 31 38 60 97 80 167 9 33 26 76 37 95 29 50 ' +
	'47 103 68 206 10 52 32 117 51 155 29 56 33 74 34 140 0 94 -10 108 -101 138 ' +
	'-61 20 -83 21 -463 21 -226 0 -421 -4 -451 -10 -63 -12 -86 -30 -110 -85 -10 ' +
	'-22 -33 -63 -52 -92 -21 -31 -42 -80 -53 -123 -11 -44 -32 -93 -56 -128 -20 ' +
	'-32 -47 -83 -59 -115 -12 -32 -37 -77 -56 -100 -19 -23 -50 -65 -69 -94 -19 ' +
	'-29 -44 -57 -54 -63 -11 -5 -29 -27 -42 -47 -52 -85 -234 -277 -300 -315 -25 ' +
	'-15 -53 -38 -62 -51 -9 -14 -42 -39 -74 -57 -32 -18 -75 -48 -95 -66 -21 -18 ' +
	'-59 -44 -85 -58 -26 -13 -72 -40 -100 -59 -35 -24 -78 -41 -128 -52 -47 -11 ' +
	'-99 -31 -139 -56 -69 -42 -94 -49 -391 -110 -245 -51 -425 -66 -595 -50 -168 ' +
	'16 -230 27 -330 61 -47 16 -123 35 -170 44 -98 17 -123 25 -172 58 -20 14 -71 ' +
	'37 -114 53 -44 15 -95 40 -115 56 -20 16 -70 42 -110 59 -40 16 -88 45 -108 ' +
	'63 -20 19 -55 46 -78 61 -24 14 -49 35 -55 47 -7 11 -34 33 -60 49 -50 31 -65 ' +
	'61 -53 102 4 13 130 147 281 298 236 238 277 283 299 335 15 32 35 71 46 86 ' +
	'12 18 19 44 19 76 0 42 -8 63 -53 138 -92 151 11 139 -1207 141 -798 2 -1030 ' +
	'0 -1086 -11z"></path>\n' +
	'</g>\n' +
	'</svg>\n';
var playImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="abcjs-play-svg">\n' +
	'    <g>\n' +
	'    <polygon points="4 0 23 12.5 4 25"/>\n' +
	'    </g>\n' +
	'</svg>';
var pauseImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="abcjs-pause-svg">\n' +
	'  <g>\n' +
	'    <rect width="8.23" height="25"/>\n' +
	'    <rect width="8.23" height="25" x="17"/>\n' +
	'  </g>\n' +
	'</svg>';
var loadingImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="abcjs-loading-svg">\n' +
	'    <circle cx="50" cy="50" fill="none" stroke-width="20" r="35" stroke-dasharray="160 55"></circle>\n' +
	'</svg>';
var resetImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">\n' +
	'  <g>\n' +
	'    <polygon points="5 12.5 24 0 24 25"/>\n' +
	'    <rect width="3" height="25" x="0" y="0"/>\n' +
	'  </g>\n' +
	'</svg>';

function CreateSynthControl(parent, options) {
	var self = this;
	// parent is either an element or a selector.
	if (typeof parent === "string") {
		var selector = parent;
		parent = document.querySelector(selector);
		if (!parent)
			throw new Error("Cannot find element \"" + selector + "\" in the DOM.");
	} else if (!(parent instanceof HTMLElement))
		throw new Error("The first parameter must be a valid element or selector in the DOM.");

	self.parent = parent;
	self.options = {};
	if (options)
		self.options = Object.assign({}, options);

	// This can be called in the following cases:
	// AC already registered and not suspended
	// AC already registered and suspended
	// AC not registered and not passed in
	// AC not registered but passed in (but suspended)
	// AC not registered but passed in (not suspended)
	// If the AC is already registered, then just use it - ignore what is passed in
	// Create the AC if necessary if there isn't one already.
	// We don't care right now if the AC is suspended - whenever a button is clicked then we check it.
	if (self.options.ac)
		registerAudioContext(self.options.ac);
	buildDom(self.parent, self.options);
	attachListeners(self);

	self.setTempo = function(tempo) {
		self.parent.querySelector(".abcjs-midi-current-tempo").innerHTML = tempo;
	};
	self.resetAll = function() {
		var pushedButtons = self.parent.querySelectorAll(".abcjs-pushed");
		for (var i = 0; i < pushedButtons.length; i++) {
			var button = pushedButtons[i];
			button.classList.remove("abcjs-pushed");
		}
	};
	self.pushPlay = function(push) {
		var startButton = self.parent.querySelector(".abcjs-midi-start");
		if (push)
			startButton.classList.add("abcjs-pushed");
		else
			startButton.classList.remove("abcjs-pushed");
	};
	self.pushLoop = function(push) {
		var loopButton = self.parent.querySelector(".abcjs-midi-loop");
		if (push)
			loopButton.classList.add("abcjs-pushed");
		else
			loopButton.classList.remove("abcjs-pushed");
	};

	self.setProgress = function (percent, totalTime) {
		var progressBackground = self.parent.querySelector(".abcjs-midi-progress-background");
		var progressThumb = self.parent.querySelector(".abcjs-midi-progress-indicator");
		var width = progressBackground.clientWidth;
		var left = width * percent;
		progressThumb.style.left = left + "px";

		var clock = self.parent.querySelector(".abcjs-midi-clock");
		var totalSeconds = (totalTime * percent) / 1000;
		var minutes = Math.floor(totalSeconds / 60);
		var seconds = Math.floor(totalSeconds % 60);
		var secondsFormatted = seconds < 10 ? "0" + seconds : seconds;
		clock.innerHTML = minutes + ":" + secondsFormatted;
	};

	if (self.options.afterResume) {
		var isResumed = false;
		if (self.options.ac) {
			isResumed = self.options.ac.state !== "suspended";
		} else if (activeAudioContext()) {
			isResumed = activeAudioContext().state !== "suspended";
		}
		if (isResumed)
			self.options.afterResume();
	}
}

function buildDom(parent, options) {
	var hasLoop = !!options.loopHandler;
	var hasRestart = !!options.restartHandler;
	var hasPlay = !!options.playHandler;
	var hasProgress = !!options.progressHandler;
	var hasWarp = !!options.warpHandler;
	var hasClock = options.hasClock !== false;

	var html = '<div class="abcjs-inline-audio">\n';
	if (hasLoop) {
		var repeatTitle = options.repeatTitle ? options.repeatTitle : "Click to toggle play once/repeat.";
		var repeatAria = options.repeatAria ? options.repeatAria : repeatTitle;
		html += '<button type="button" class="abcjs-midi-loop abcjs-btn" title="' + repeatTitle + '" aria-label="' + repeatAria + '">' + loopImage + '</button>\n';
	}
	if (hasRestart) {
		var restartTitle = options.restartTitle ? options.restartTitle : "Click to go to beginning.";
		var restartAria = options.restartAria ? options.restartAria : restartTitle;
		html += '<button type="button" class="abcjs-midi-reset abcjs-btn" title="' + restartTitle + '" aria-label="' + restartAria + '">' + resetImage + '</button>\n';
	}
	if (hasPlay) {
		var playTitle = options.playTitle ? options.playTitle : "Click to play/pause.";
		var playAria = options.playAria ? options.playAria : playTitle;
		html += '<button type="button" class="abcjs-midi-start abcjs-btn" title="' + playTitle + '" aria-label="' + playAria + '">' + playImage + pauseImage + loadingImage + '</button>\n';
	}
	if (hasProgress) {
		var randomTitle = options.randomTitle ? options.randomTitle : "Click to change the playback position.";
		var randomAria = options.randomAria ? options.randomAria : randomTitle;
		html += '<button type="button" class="abcjs-midi-progress-background" title="' + randomTitle + '" aria-label="' + randomAria + '"><span class="abcjs-midi-progress-indicator"></span></button>\n';
	}
	if (hasClock) {
		html += '<span class="abcjs-midi-clock"></span>\n';
	}
	if (hasWarp) {
		var warpTitle = options.warpTitle ? options.warpTitle : "Change the playback speed.";
		var warpAria = options.warpAria ? options.warpAria : warpTitle;
		var bpm = options.bpm ? options.bpm : "BPM";
		html += '<span class="abcjs-tempo-wrapper"><label><input class="abcjs-midi-tempo" type="number" min="1" max="300" value="100" title="' + warpTitle + '" aria-label="' + warpAria + '">%</label><span>&nbsp;(<span class="abcjs-midi-current-tempo"></span> ' + bpm + ')</span></span>\n';
	}
	html += '</div>\n';
	parent.innerHTML = html;
}

function acResumerMiddleWare(next, ev, playBtn, afterResume) {
	var needsInit = true;
	if (!activeAudioContext()) {
		registerAudioContext();
	} else {
		needsInit = activeAudioContext().state === "suspended";
	}
	if (needsInit) {
		if (playBtn)
			playBtn.classList.add("abcjs-loading");
		activeAudioContext().resume().then(function () {
			if (afterResume) {
				afterResume().then(function (response) {
					playBtn.classList.remove("abcjs-loading");
					next(ev);
				});
			} else
				next(ev);
		});
	} else {
		next(ev);
	}
}

function attachListeners(self) {
	var hasLoop = !!self.options.loopHandler;
	var hasRestart = !!self.options.restartHandler;
	var hasPlay = !!self.options.playHandler;
	var hasProgress = !!self.options.progressHandler;
	var hasWarp = !!self.options.warpHandler;
	var playBtn = self.parent.querySelector(".abcjs-midi-start");

	if (hasLoop)
		self.parent.querySelector(".abcjs-midi-loop").addEventListener("click", function(ev){acResumerMiddleWare(self.options.loopHandler, ev, playBtn, self.options.afterResume)});
	if (hasRestart)
		self.parent.querySelector(".abcjs-midi-reset").addEventListener("click", function(ev){acResumerMiddleWare(self.options.restartHandler, ev, playBtn, self.options.afterResume)});
	if (hasPlay)
		playBtn.addEventListener("click", function(ev){acResumerMiddleWare(self.options.playHandler, ev, playBtn, self.options.afterResume)});
	if (hasProgress)
		self.parent.querySelector(".abcjs-midi-progress-background").addEventListener("click", function(ev){acResumerMiddleWare(self.options.progressHandler, ev, playBtn, self.options.afterResume)});
	if (hasWarp)
		self.parent.querySelector(".abcjs-midi-tempo").addEventListener("change", function(ev){acResumerMiddleWare(self.options.warpHandler, ev, playBtn, self.options.afterResume)});
}
module.exports = CreateSynthControl;
