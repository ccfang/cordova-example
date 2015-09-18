(function($) {
	"use strict";

	var reg = /^file:\/{1,}/;

	$.gk = $.gk || {};

	$.gk.file = {
		getDirectory: function(path, callback, fail) {
			if (typeof(path) === 'function') {
				getPersistentFileSystem(function(fs) {
					path(fs.root);
				});
			} else {
				getDirectory(path, true, callback, fail);
			}
		},

		getDirectoryList: function(path, callback, fail) {
			if (typeof(path) === 'function') {
				getPersistentFileSystem(function(fs) {
					getDirectoryList(fs.root, path, callback);
				});
			} else {
				getDirectory(path, false, function(entry) {
					getDirectoryList(entry, callback, fail);
				}, fail);
			}
		},

		getErrorText: function(code) {
			return errorText[code];
		},

		getFile: function(path, callback, fail) {
			getFile(path, false, callback, fail);
		},

		getFileList: function(path, callback, fail) {
			if (typeof(path) === 'function') {
				getPersistentFileSystem(function(fs) {
					getFileList(fs.root, path, callback);
				});
			} else {
				getDirectory(path, false, function(entry) {
					getFileList(entry, callback, fail);
				}, fail);
			}
		},

		moveFileTo: function(path, newPath, callback, fail) {
			getFile(path, false, function(entry) {
				var newDir = newPath.substring(0, newPath.lastIndexOf('/'));
				var newName = newPath.substring(newPath.lastIndexOf('/') + 1);
				getDirectory(newDir, true, function(newEntry) {
					moveFileTo(entry, newEntry, newName, callback, fail);
				}, fail);
			}, fail);
		},

		removeDirectory: function(path, callback, fail) {
			getDirectory(path, false, function(entry) {
				removeDirectory(entry, callback, fail);
			}, fail);
		},

		renameDirectory: function(path, newPath, callback, fail) {
			getDirectory(path, false, function(entry) {
				getDirectory(newPath, true, function(newEntry) {
					moveDirectoryTo(entry, newEntry, callback, fail);
				}, fail);
			}, fail);
		}
	};

	function getDirectory(path, create, callback, fail) {
		var error = fail || onError;
		if (reg.test(path)) {
			path = path.replace(reg, 'file:///');
			window.resolveLocalFileSystemURI(path, callback, error);
		} else {
			getPersistentFileSystem(function(fs) {
				fs.root.getDirectory(path, {
					create: create,
					exclusive: false
				}, callback, error);
			});
		}
	}

	function getDirectoryList(entry, callback, fail) {
		var error = fail || onError;
		var reader = entry.createReader();
		reader.readEntries(callback && function(entries) {
			var lists = [];
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].isDirectory) {
					lists.push(entries[i]);
				}
			}
			callback(lists);
		}, error);
	}

	function getFile(path, create, callback, fail) {
		var error = fail || onError;
		if (reg.test(path)) {
			path = path.replace(reg, 'file:///');
			window.resolveLocalFileSystemURI(path, callback, error);
		} else {
			getPersistentFileSystem(function(fs) {
				fs.root.getFile(path, {
					create: create,
					exclusive: false
				}, callback, error);
			});
		}
	}

	function getFileList(entry, callback, fail) {
		var error = fail || onError;
		var reader = entry.createReader();
		reader.readEntries(callback, error);
	}

	function moveDirectoryTo(entry, newEntry, callback, fail) {
		var error = fail || onError;
		newEntry.getParent(function(parent) {
			entry.moveTo(parent, newEntry.name, callback, error);
		}, error);
	}

	function moveFileTo(entry, newEntry, newName, callback, fail) {
		var error = fail || onError;
		entry.moveTo(newEntry, newName, callback, error);
	}

	function removeDirectory(dirEntry, callback, fail) {
		var error = fail || onError;
		dirEntry.removeRecursively(callback, error);
	}

	function getPersistentFileSystem(callback) {
		getFileSystem(LocalFileSystem.PERSISTENT, callback);
	}

	function getTemporaryFileSystem(callback) {
		getFileSystem(LocalFileSystem.TEMPORARY, callback);
	}

	function getFileSystem(constants, callback) {
		window.requestFileSystem(constants, 0, callback, function(evt) {
			console.log('File System Error: ' + evt.target.error.code);
		});
	}

	function onError(error) {
		console.log('File Error: ' + errorText[error.code]);
	}

	var errorText = {};
	errorText[FileError.NOT_FOUND_ERR] = 'NOT_FOUND_ERR';
	errorText[FileError.SECURITY_ERR] = 'SECURITY_ERR';
	errorText[FileError.ABORT_ERR] = 'ABORT_ERR';
	errorText[FileError.NOT_READABLE_ERR] = 'NOT_READABLE_ERR';
	errorText[FileError.ENCODING_ERR] = 'ENCODING_ERR';
	errorText[FileError.NO_MODIFICATION_ALLOWED_ERR] = 'NO_MODIFICATION_ALLOWED_ERR';
	errorText[FileError.INVALID_STATE_ERR] = 'INVALID_STATE_ERR';
	errorText[FileError.SYNTAX_ERR] = 'SYNTAX_ERR';
	errorText[FileError.INVALID_MODIFICATION_ERR] = 'INVALID_MODIFICATION_ERR';
	errorText[FileError.QUOTA_EXCEEDED_ERR] = 'QUOTA_EXCEEDED_ERR';
	errorText[FileError.TYPE_MISMATCH_ERR] = 'TYPE_MISMATCH_ERR';
	errorText[FileError.PATH_EXISTS_ERR] = 'PATH_EXISTS_ERR';

})(jQuery);