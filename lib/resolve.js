'use strict';

var fs   = require('fs'),
	sysPath = require('path'),
	loadAsFile, loadAsDir, loadNodeModules, nodeModulesPath, isCore;

isCore = function (path) {
	return false;
};

loadAsFile = function (path) {
	// console.log("LF "+path);
	var filePath = (sysPath.existsSync(path) && fs.statSync(path).isFile() && path) ||
		(sysPath.existsSync(path + '.js') && fs.statSync(path + '.js').isFile() &&
		path + '.js');
	return filePath ? {
		path: filePath,
		file: filePath
	} : false;
};

loadAsDir = function (path) {
	// console.log("LD "+path);
	var pckg, newPath, res, pack = sysPath.normalize(path + '/package.json');
	if (sysPath.existsSync(pack)) {
		pckg = JSON.parse(fs.readFileSync(pack, 'utf8'));
		newPath = path + '/' + pckg.main;
	} else {
		newPath = path + '/index.js';
	}
	newPath = sysPath.normalize(newPath);
	res = loadAsFile(newPath);
	return res ? {
		file: res.file,
		path: path
	} : false;
};

loadNodeModules = function (path, start) {
	var dirs = nodeModulesPath(start), res;
	for (var i = 0; i < dirs.length; i++) {
		res = loadAsFile(sysPath.normalize(dirs[i] + '/' + path)) ||
			loadAsDir(sysPath.normalize(dirs[i] + '/' + path));
		if (res) {
			return res;
		}
	}
	return false;
};

nodeModulesPath = function (path) {
	var parts, root, pathes = [];
	parts = path.indexOf('/') > -1 ? path.split('/') : path.split('\\');
	root = parts.indexOf('node_modules');
	root = root > -1 ? root : 0;

	for (var i = parts.length - 1; i >= root; i--) {
		if (parts[i] === 'node_modules') {
			continue;
		}
		pathes.push(sysPath.normalize(parts.slice(0, i + 1).join('/') + '/node_modules'));
	}
	return pathes;
};

module.exports = function (bpath, folder) {
	folder = sysPath.normalize(folder + '/');
	var path = sysPath.normalize(bpath);
	if (isCore(path)) {
		return false;
	} else if (bpath.slice(0, 1) === '.' || bpath.slice(0, 1) === '/') {
		return loadAsFile(folder + path) || loadAsDir(folder + path);
	} else {
		return loadNodeModules(path, folder);
	}
};
