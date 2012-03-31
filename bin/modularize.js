'use strict';

var path     = require('path'),
	fs       = require('fs'),
	crypto   = require('crypto'),
	argv     = require('optimist')['default']({
		'o': 'modularize.js',
		'i': 800
	}).argv,
	parseFile = require('../lib/parse-file'),
	create    = require('../lib/create-bundle'),
	getHash   = require('../lib/get-hash'),
	uglify    = require('../lib/uglify'),
	startFile, endFile, cache = {};

if (!argv.s) {
	throw new Error('No start point defined!');
}

startFile = path.normalize(process.cwd() + '/' + argv.s);
endFile = path.normalize(process.cwd() + '/' + argv.o);

parseFile(startFile, startFile, cache);

create(startFile, cache, endFile, function () {
	if (argv.m) {
		uglify(endFile, argv);
	}
});

if (argv.w) {
	console.log("\nWatching files...");
	setInterval(function () {
		var changed = false;
		Object.keys(cache).forEach(function (file) {
			var hash = getHash(file);
			if (cache[file].hash !== hash) {
				console.log("File changed " + file);
				cache[file].data = null;
				parseFile(file, cache[file].path, cache);
				changed = true;
			}
		});

		if (changed) {
			create(startFile, cache, endFile, function () {
				if (argv.m) {
					uglify(endFile, argv);
				}
			});
			console.log("Builded");
		}
	}, argv.i);
}
