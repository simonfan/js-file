/**
 * Holds functionality related to parsing comments.
 * This file is just an interface to the real object builder.
 *
 * @module js-file
 * @submodule comments
 */

'use strict';

var commentsObject = require('./object');

/**
 * This is just an interfacing method.
 * @method comments
 */
exports.comments = function comments(options) {
	// guarantee there is data to be parsed
	if (!this.raw()) {
		this.readSync();
	}

	return commentsObject(this.raw(), options);
};
