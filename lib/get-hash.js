'use strict';

var fs     = require('fs'),
	crypto = require('crypto');

module.exports = function (file) {
	var hash = crypto.createHash('md5'), fInfo = fs.statSync(file);
	hash.update("" + fInfo.size + fInfo.mtime.getTime() + fInfo.ctime.getTime());
	return hash.digest('hex');
};
