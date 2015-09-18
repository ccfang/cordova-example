cordova.define("org.gk.cordova.plugins.FileOpenerPlugin", function(require, exports, module) {
	var exec = require('cordova/exec');

	var FileOpener = function() {

	};

	FileOpener.prototype.open = function(uri, successCallback, failureCallback) {
		exec(successCallback, failureCallback, "FileOpener", "open", [uri]);
	};

	module.exports = new FileOpener();
});

cordova.define("org.gk.cordova.plugins.SharePlugin", function(require, exports, module) {
	var exec = require('cordova/exec');

	var Share = function() {

	};

	Share.prototype.send = function(title, text, successCallback, failureCallback) {
		exec(successCallback, failureCallback, "Share", "send", [title, text]);
	};

	module.exports = new Share();
});

cordova.define("org.gk.cordova.plugins.ToastPlugin", function(require, exports, module) {
	var exec = require('cordova/exec');

	var Toast = function() {

	};

	Toast.prototype.short = function(msg, successCallback, failureCallback) {
		exec(successCallback, failureCallback, "Toast", "short", [msg]);
	};

	Toast.prototype.long = function(msg, successCallback, failureCallback) {
		exec(successCallback, failureCallback, "Toast", "long", [msg]);
	};

	module.exports = new Toast();
});

(function($) {
	"use strict";

	$.gk = $.gk || {};
	$.gk.fileOpener = cordova.require("org.gk.cordova.plugins.FileOpenerPlugin");
	$.gk.share = cordova.require("org.gk.cordova.plugins.SharePlugin");
	$.gk.toast = cordova.require("org.gk.cordova.plugins.ToastPlugin");

	$.gk.connection = {
		type: function() {
			return navigator.connection.type;
		},

		isWifi: function() {
			var status = navigator.connection.type;
			if (status === Connection.WIFI) {
				return true;
			}
			return false;
		},

		isCell: function() {
			var status = navigator.connection.type;
			switch (status) {
				case Connection.CELL:
				case Connection.CELL_2G:
				case Connection.CELL_3G:
				case Connection.CELL_4G:
					return true;
				default:
					return false;
			}
		}
	};

	$.gk.notification = {
		alert: function(message, alertCallback, title, buttonName) {
			navigator.notification.alert(message, alertCallback, title, buttonName);
		},

		confirm: function(message, confirmCallback, title, buttonLabels) {
			navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
		},

		prompt: function(message, promptCallback, title, buttonLabels, defaultText) {
			navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);
		}
	};

})(jQuery);