'use strict';

/**
 * Useful regular expressions
 * @property regexp
 */
exports.regexp = {
	relativePath: /^(.|..)\//,
	absolutePath: /^\//,
	jsExt: /\.js$/,
};

/**
 * @method pathType
 * @param path {String}
 * @return relative|absolute {String}
 */
exports.pathType = function pathType(p) {

};