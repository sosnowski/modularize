'use strict';

var fs          = require('fs'),
	path        = require('path'),
	parseFile   = require('./parse-file'),
	bundleTpl;

bundleTpl = fs.readFileSync(path.normalize(__dirname + '/../chunks/bundle.js'));

module.exports = function (startPath, cache, outputPath, afterCreate) {
	var output, keys = Object.keys(cache);

	output = fs.createWriteStream(outputPath, {
		encoding: 'utf8'
	});

	output.on('close', afterCreate);

	output.write('(function () {\n');
	output.write(bundleTpl);

	output.write('modules = {\n\t', 'utf8');

	keys.forEach(function (key, index) {
		var data = cache[key];
		output.write('"' + data.path.replace(/\\/g, '/') + '": ' +
			"function (require, module, exports, __dirname, __filename) {\n\t\t", 'utf8');
		output.write(data.data.toString().replace(/\n/g, "\n\t\t"), 'utf8');
		output.write("\n\t}", 'utf8');
		if (index < keys.length - 1) {
			output.write(",", 'utf8');
		}
		output.write('\n\t', 'utf8');
	});

	output.write('\n}\n', 'utf8');
	output.write("startPoint = '" + startPath.replace(/\\/g, '/') + "';", 'utf8');
	output.write('\n}())');
	output.end();
};
