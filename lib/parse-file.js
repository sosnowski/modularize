'use strict';

var fs          = require('fs'),
	path        = require('path'),
	detective   = require('detective'),
	getHash     = require('./get-hash'),
	resolve     = require('./resolve'),
	parse;

module.exports = parse = function (file, fPath, cache) {
	console.log("Parse " + file);
	var requires, hash = getHash(file);
	if (!cache[file]) {
		cache[file] = {
			path: fPath,
			data: null,
			hash: null
		};
	}
	if (cache[file].hash !== hash) {
		cache[file].data = fs.readFileSync(file);
		cache[file].hash = hash;
		requires = detective(cache[file].data);
		requires.forEach(function (req) {
			var result = resolve(req, path.dirname(file));
			if (!result) {
				throw new Error("Module " + req + " not found in " + file);
			}
			parse(result.file, result.path, cache);
		});
	} else {
		console.log("Cache");
	}
};
