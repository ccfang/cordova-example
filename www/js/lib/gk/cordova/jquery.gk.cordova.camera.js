(function($) {

	"use strict";

	$.gk = $.gk || {};

	var defaults = {
		correctOrientation: true
	};

	$.gk.camera = {
		getPicture: function(config, callback, fail) {
			if (typeof(config) === 'function') {
				getPicture(config, callback);
			} else {
				getPicture(callback, fail, config);
			}
		}
	};

	function getPicture(callback, fail, config) {
		var error = fail || onError;
		var options = $.extend(true, {}, defaults, config);
		navigator.camera.getPicture(callback, error, options);
	}

	function onError(message) {
		console.log('Camera Error: ' + message);
	}

})(jQuery);