var modules, createRequire, findFileOrFolder, findModule, modulesNames, cachedModules = {};

findFileOrFolder = function (path, basePath) {
	var startPoint, pathParts = path.split('/'),
		baseParts = path.slice(0, 1) === '/' ? [] : basePath.split('/'),
		index = baseParts.length - 1, resPath, resIndex;
	pathParts.forEach(function (part) {
		if (part === '..') {
			index--;
		} else if (part !== '.') {
			baseParts[++index] = part;
		}
	});

	resPath = baseParts.slice(0, index + 1).join('/');
	// console.log("Test path: "+resPath);
	resIndex = modulesNames.indexOf(resPath + '.js') > -1 ? modulesNames.indexOf(resPath + '.js') : modulesNames.indexOf(resPath);
	return resIndex > -1 ? modulesNames[resIndex] : false;
};

findModule = function (path, basePath) {
	var baseParts = basePath.split('/'), index = baseParts.length - 1, modulesPath,
		result = false, root = baseParts.indexOf('node_modules');
	root = root > -1 ? root : 0;
	while (index >= root && result === false) {
		modulesPath = baseParts.slice(0, index + 1).join('/') + '/node_modules';
		result = findFileOrFolder(path, modulesPath);
		index--;
	}
	return result;
};

createRequire = function (basePath) {
	var require, resolve = function (path) {
		var result;
		if (path.slice(0, 1) === '.' || path.slice(0, 1) === '/') {
			// console.log('file');
			result = findFileOrFolder(path, basePath);
		} else {
			// console.log('module')
			result = findModule(path, basePath);
		}
		if (result === false) {
			throw new Error("Module " + path + " not found in " + basePath);
		}
		return result;
	};

	require = function (path) {
		var source = resolve(path), module = modules[source], dirName, moduleObj = {
			exports: {},
			id: source,
			filename: source,
			loaded: true
		};
		if (cachedModules[source]) {
			return cachedModules[source];
		}
		dirName = source.slice(-3) === '.js' ? source.slice(0, source.lastIndexOf('/')) : source;
		module.call(exports, moduleObj.require = createRequire(dirName), moduleObj, moduleObj.exports, dirName, path);
		cachedModules[source] = moduleObj.exports;
		return moduleObj.exports;
	};
	require.resolve = resolve;
	require.cache = cachedModules;

	return require;
};

setTimeout(function () {
	modulesNames = Object.keys(modules);
	createRequire(startPoint.slice(0, startPoint.lastIndexOf('/')))('./' +
		startPoint.slice(startPoint.lastIndexOf('/') + 1));
}, 0);

