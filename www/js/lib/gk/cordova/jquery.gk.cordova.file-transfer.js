(function($) {
	"use strict";

	$.gk = $.gk || {};

	$.gk.fileTransfer = {
		download: function(server, filePath, config, callback, fail) {
			if (typeof(config) === 'function') {
				download(server, filePath, config, callback);
			} else {
				download(server, filePath, callback, fail, config);
			}

		},

		getErrorText: function(code) {
			return errorText[code];
		},

		upload: function(filePath, server, config, callback, fail) {
			if (typeof(config) === 'function') {
				upload(filePath, server, config, callback);
			} else {
				upload(filePath, server, callback, fail, config);
			}
		}
	};

	function download(server, filePath, callback, fail, config, trustAllHosts) {
		var error = fail || onError;
		var ft = new FileTransfer();
		ft.download(encodeURI(server), filePath, callback, error, trustAllHosts, config);
	}

	function upload(filePath, server, callback, fail, config, trustAllHosts) {
		var error = fail || onError;
		var options;
		if (config) {
			options = new FileUploadOptions();
			options.fileKey = config.fileKey;
			options.fileName = config.fileName;
			options.mimeType = config.mimeType;
			options.params = config.params;
		}

		var ft = new FileTransfer();
		ft.upload(filePath, encodeURI(server), callback, error, options, trustAllHosts);
	}

	function onError(error) {
		console.log('File Transfer Error: ' + errorText[error.code]);
	}

	var errorText = {};
	errorText[FileTransferError.FILE_NOT_FOUND_ERR] = 'FILE_NOT_FOUND_ERR';
	errorText[FileTransferError.INVALID_URL_ERR] = 'INVALID_URL_ERR';
	errorText[FileTransferError.CONNECTION_ERR] = 'CONNECTION_ERR';
	errorText[FileTransferError.ABORT_ERR] = 'ABORT_ERR';

})(jQuery);