var CreateSynthControl = require('./create-synth-control');
var CreateSynth = require('./create-synth');
var TimingCallbacks = require('../api/abc_timing_callbacks');

function SynthController() {
	var self = this;
	self.warp = 100;
	self.cursorControl = null;
	self.visualObj = null;
	self.timer = null;
	self.midiBuffer = null;
	self.options = null;
	self.currentTempo = null;
	self.control = null;
	self.isLooping = false;
	self.isStarted = false;
	self.notSuspended = false;

	self.load = function (selector, visualObj, cursorControl, visualOptions) {
		if (!visualOptions)
			visualOptions = {};
		self.control = new CreateSynthControl(selector, {
			loopHandler: visualOptions.displayLoop ? self.toggleLoop : undefined,
			restartHandler: visualOptions.displayRestart ? self.restart : undefined,
			playHandler: visualOptions.displayPlay ? self.play : undefined,
			progressHandler: visualOptions.displayProgress ? self.randomAccess : undefined,
			warpHandler: visualOptions.displayWarp ? self.onWarp : undefined,
			afterResume: self.init
		});
		self.cursorControl = cursorControl;
		self.visualObj = visualObj;
	};

	self.init = function () {
		self.notSuspended = true;
		if (self.visualObj)
			return self.go();
		else
			return Promise.resolve({ status: "no-buffer"});
	};

	self.setTunes = function(visualObjs) {
		if (self.control) {
			self.setProgress(0, 1);
			self.control.resetAll();
		}
		self.isLooping = false;
		if (self.isStarted)
			self.play(); // this will pause the playback

		// TODO-PER: how to handle multiple tunes?
		self.visualObj = visualObjs[0];
		if (self.notSuspended)
			return self.go();
		else
			return Promise.resolve({ status: "no-audio-context"});
	};

	self.go = function () {
		var millisecondsPerMeasure = self.visualObj.millisecondsPerMeasure() * 100 / self.warp;
		self.currentTempo = Math.round(self.visualObj.getBeatsPerMeasure() / millisecondsPerMeasure * 60000);
		self.control.setTempo(self.currentTempo);
		self.percent = 0;

		if (!self.midiBuffer)
			self.midiBuffer = new CreateSynth();
		return self.midiBuffer.init({
			visualObj: self.visualObj,
			options: self.options,
			millisecondsPerMeasure: millisecondsPerMeasure
		}).then(function () {
			return self.midiBuffer.prime();
		}).then(function () {
			// Need to create the TimingCallbacks after priming the midi so that the midi data is available for the callbacks.
			self.timer = new TimingCallbacks(self.visualObj, {
				beatCallback: self.beatCallback,
				eventCallback: self.eventCallback,
				beatSubdivisions: 16,
				qpm: self.currentTempo
			});
			if (self.cursorControl && self.cursorControl.onReady && typeof self.cursorControl.onReady  === 'function')
				self.cursorControl.onReady(self);
			return Promise.resolve({ status: "created" });
		});
	};

	self.destroy = function () {
		if (self.timer) {
			self.timer.reset();
			self.timer.stop();
			self.timer = null;
		}
		if (self.midiBuffer) {
			self.midiBuffer.stop();
			self.midiBuffer = null;
		}
		self.setProgress(0, 1);
		self.control.resetAll();
	};

	self.play = function () {
		self.isStarted = !self.isStarted;
		if (self.isStarted) {
			if (self.cursorControl && self.cursorControl.onStart && typeof self.cursorControl.onStart  === 'function')
				self.cursorControl.onStart();
			self.midiBuffer.start();
			self.timer.start();
			self.control.pushPlay(true);
		} else {
			self.timer.pause();
			self.midiBuffer.pause();
			self.control.pushPlay(false);
		}
	};

	self.toggleLoop = function () {
		self.isLooping = !self.isLooping;
		self.control.pushLoop(self.isLooping);
	};

	self.restart = function () {
		self.timer.reset();
		self.midiBuffer.seek(0);
	};

	self.randomAccess = function (ev) {
		var background = (ev.target.classList.contains('abcjs-midi-progress-indicator')) ? ev.target.parentNode : ev.target;
		var percent = (ev.x - background.offsetLeft) / background.offsetWidth;
		if (percent < 0)
			percent = 0;
		if (percent > 100)
			percent = 100;
		self.timer.setProgress(percent);
		self.midiBuffer.seek(percent);
	};

	self.onWarp = function (ev) {
		var newWarp = ev.target.value;
		if (parseInt(newWarp, 10) > 0) {
			self.warp = parseInt(newWarp, 10);
			var wasPlaying = self.isStarted;
			var startPercent = self.percent;
			self.destroy();
			self.isStarted = false;
			self.go().then(function () {
				self.setProgress(startPercent, self.midiBuffer.duration * 1000);
				if (wasPlaying) {
					self.play();
				}
				self.timer.setProgress(startPercent);
				self.midiBuffer.seek(startPercent);
			});
		}
	};

	self.setProgress = function (percent, totalTime) {
		self.percent = percent;
		self.control.setProgress(percent, totalTime);
	};

	self.finished = function () {
		self.timer.reset();
		if (self.isLooping) {
			self.timer.start();
			self.midiBuffer.start();
		} else {
			self.timer.stop();
			if (self.isStarted) {
				self.control.pushPlay(false);
				self.isStarted = false;
				if (self.cursorControl && self.cursorControl.onFinished && typeof self.cursorControl.onFinished  === 'function')
					self.cursorControl.onFinished();
				self.setProgress(0, 1);
			}
		}
	};

	self.beatCallback = function (beatNumber, totalBeats, totalTime) {
		var percent = beatNumber / totalBeats;
		self.setProgress(percent, totalTime);
	};

	self.eventCallback = function (event) {
		if (event) {
			if (self.cursorControl && self.cursorControl.onEvent && typeof self.cursorControl.onEvent  === 'function')
				self.cursorControl.onEvent(event);
		} else {
			self.finished();
		}
	};

	self.getUrl = function () {
		return self.midiBuffer.download();
	};

	self.download = function(fileName) {
		var url = self.getUrl();
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.setAttribute("style","display: none;");
		link.href = url;
		link.download = fileName ? fileName : 'output.wav';
		link.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};
}

module.exports = SynthController;
