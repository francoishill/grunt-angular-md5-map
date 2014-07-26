/*
 * angularMd5Map
 * https://github.com/Francois/grunt-process-includes
 *
 * Copyright (c) 2014 Francois Hill
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
	var fs = require('fs');
	var crypto = require('crypto');

	function getFileMd5(filePath) {
		if (fs === null) fs = require('fs');
		if (crypto === null) crypto = require('crypto');
		var fileContent = String(fs.readFileSync(filePath));
		return crypto.createHash('md5').update(fileContent).digest("hex");
	}

	grunt.registerMultiTask('angularMd5Map', 'The best Grunt plugin ever.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({});

		if (!options.moduleName)
			throw grunt.util.error('Please specify options.moduleName');
		if (!options.moduleVariableName)
			throw grunt.util.error('Please specify options.moduleVariableName');
		if (!options.providerName)
			throw grunt.util.error('Please specify options.providerName');
		if (!options.providerMethodNameToGetUrl)
			throw grunt.util.error('Please specify options.providerMethodNameToGetUrl');
		if (!options.instanceOfProviderMethodNameToGetUrl)
			throw grunt.util.error('Please specify options.instanceOfProviderMethodNameToGetUrl');

		this.files.forEach(function (f) {
			var allFilePaths = [];
			f.src.filter(function (srcFilePath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(srcFilePath)) {
					throw grunt.utils.error('Source file "' + srcFilePath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(srcFilePath) {
				allFilePaths.push(srcFilePath);
			});

			var possibleRemovedBaseDir = options.removedBaseDir || '';

			var mappingArrayJs = "";
			mappingArrayJs += "{";
			var cnt = 0;
			for (var i = 0; i < allFilePaths.length; i++) {
				var originalFilePath = allFilePaths[i];
				var filePathToUse = originalFilePath;

				if (possibleRemovedBaseDir.length > 0
					&& filePathToUse.length >= possibleRemovedBaseDir.length
					&& filePathToUse.substr(0, possibleRemovedBaseDir.length).toLowerCase() === possibleRemovedBaseDir.toLowerCase())
					filePathToUse = filePathToUse.substr(possibleRemovedBaseDir.length);

				if (cnt > 0)
					mappingArrayJs += ",";
				mappingArrayJs += "'" + filePathToUse + "': '" + getFileMd5(originalFilePath) + "'";

				cnt++;
			}
			mappingArrayJs += "}";

			var baseDirWithSlashes = possibleRemovedBaseDir;
			if (baseDirWithSlashes.length > 0 && baseDirWithSlashes[baseDirWithSlashes.length - 1] !== '/')
				baseDirWithSlashes += '/';
			if (baseDirWithSlashes.length === 0 || baseDirWithSlashes[0] !== '/')
				baseDirWithSlashes = '/' + baseDirWithSlashes;

			var md5ProviderFileContent = 'var ' + options.moduleVariableName +
			'= angular.module("' + options.moduleName + '", []);\
			'+ options.moduleVariableName + '.provider("' + options.providerName + '", function() {\
				var allMd5Mappings = ' + mappingArrayJs + ';\
				var getUrlWithMd5 = function(relativePath) {\
					if (!relativePath || relativePath.length === 0)\
						return "";\
					var tmpRelUrl = relativePath.trim();\
					while (tmpRelUrl[0] === "/")\
						tmpRelUrl = tmpRelUrl.substr(1);\
					var md5Val = allMd5Mappings[tmpRelUrl] || allMd5Mappings["/" + tmpRelUrl];\
					return "' + baseDirWithSlashes + '" + tmpRelUrl + "?" + md5Val;\
				};\
				this.' + options.providerMethodNameToGetUrl + ' = getUrlWithMd5;\
	\
				var ObjectForControllers = function() {\
					this.' + options.instanceOfProviderMethodNameToGetUrl + ' = function(relativePath) {\
						return getUrlWithMd5(relativePath);\
					};\
				};\
				this.$get = function (){\
					return ObjectForControllers;\
				};\
			}\
			);';

			grunt.file.write(f.dest, md5ProviderFileContent);
		});
	});

};
