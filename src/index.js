//     jsfile
//     (c) simonfan
//     jsfile is licensed under the MIT terms.

/**
 * CJS module.
 *
 * @module jsfile
 */

'use strict';

var file = require('file-object'),
	_ = require('lodash'),
	resolve = require('resolve');

var jsfile = module.exports = file.extend(function jsfile(fpath, options) {
	file.prototype.initialize.apply(this, arguments);

	// normalize options
	options = options || {};

	/**
	 * The module format of the file.
	 *
	 * @property format
	 */
	this.format = options.format || 'cjs';
});

jsfile.proto({
	extension: '.js',
});

// comments
jsfile.proto(require('./comments'));

// dependency parsers
jsfile.proto(require('./dependencies'));
