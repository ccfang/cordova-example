(function($) {
	"use strict";

	$.gk = $.gk || {};

	$.gk.capture = {
		captureAudio: function(options, callback, fail) {
			if (typeof(options) === 'function') {
				captureAudio(options, callback);
			} else {
				captureAudio(callback, fail, options);
			}
		},

		captureImage: function(options, callback, fail) {
			if (typeof(options) === 'function') {
				captureImage(options, callback);
			} else {
				captureImage(callback, fail, options);
			}
		},

		captureVideo: function(options, callback, fail) {
			if (typeof(options) === 'function') {
				captureVideo(options, callback);
			} else {
				captureVideo(callback, fail, options);
			}
		},

		getErrorText: function(code) {
			return errorText[code];
		}
	};

	function captureAudio(callback, fail, options) {
		var error = fail || onError;
		navigator.device.capture.captureAudio(callback, error, options);
	}

	function captureImage(callback, fail, options) {
		var error = fail || onError;
		navigator.device.capture.captureImage(callback, error, options);
	}

	function captureVideo(callback, fail, options) {
		var error = fail || onError;
		navigator.device.capture.captureVideo(callback, error, options);
	}

	function onError(error) {
		console.log('Capture Error: ' + errorText[error.code]);
	}

	var errorText = {};
	errorText[CaptureError.CAPTURE_INTERNAL_ERR] = 'CAPTURE_INTERNAL_ERR';
	errorText[CaptureError.CAPTURE_APPLICATION_BUSY] = 'CAPTURE_APPLICATION_BUSY';
	errorText[CaptureError.CAPTURE_INVALID_ARGUMENT] = 'CAPTURE_INVALID_ARGUMENT';
	errorText[CaptureError.CAPTURE_NO_MEDIA_FILES] = 'CAPTURE_NO_MEDIA_FILES';
	errorText[CaptureError.CAPTURE_NOT_SUPPORTED] = 'CAPTURE_NOT_SUPPORTED';

})(jQuery);