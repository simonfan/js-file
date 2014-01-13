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

var comments = require('./comments');

var jsfile = module.exports = file.extend(function jsfile() {
	file.prototype.initialize.apply(this, arguments);
});

jsfile.proto({
	extension: '.js',

	// partialize comments invocation
	comments: function (options) {
		// guarantee there is data to be parsed
		if (!this.raw) {
			this.readSync();
		}

		return comments(this.raw, options);
	},
});

// dependency parsers
jsfile.proto(require('./dependencies'));
