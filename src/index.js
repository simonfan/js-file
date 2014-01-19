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

var jsfile = module.exports = file.extend(function jsfile() {
	file.prototype.initialize.apply(this, arguments);
});

jsfile.proto({
	extension: '.js',
});

// comments
jsfile.proto(require('./comments'));

// dependency parsers
jsfile.proto(require('./dependencies'));
