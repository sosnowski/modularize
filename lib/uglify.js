'use strict';

var jsp  = require("uglify-js").parser,
	pro  = require("uglify-js").uglify,
	fs   = require('fs'),
	path = require('path');

module.exports = function (filePath, argv) {
	console.log("Uglifying...");

	var baseName = path.basename(filePath, '.js'),
		ast = jsp.parse(fs.readFileSync(filePath, 'utf8'));

	if (argv.h) {
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	}

	fs.writeFileSync(path.dirname(filePath) + '/' + baseName +
		'.min.js', pro.gen_code(ast));
};
