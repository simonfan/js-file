'use strict';

/**
 * Holds functionality related to parsing commentss.
 *
 * @module comments
 */

var _ = require('lodash'),
	subject = require('subject');


/**
 * The constructor of the comments object.
 *
 * @class comments
 */
var commentsObject = subject(function commentsObject(raw, options) {

	/**
	 * Raw string contents of the .js file.
	 *
	 * @property raw
	 * @type String
	 */
	this.raw = raw;

	this.options = options || {};

	/**
	 * The string that comes immediately before the block name.
	 *
	 * @property prefix
	 * @type String
	 */
	this.prefix = this.options.prefix || this.prefix;

	/**
	 * The string that defines the border of the block
	 *
	 * @property blockBorder
	 * @type String
	 */
	this.blockBorder = this.options.blockBorder || this.blockBorder;
});

commentsObject.proto({
	/**
	 * Prefix to be used before any comment-block name definition.
	 * @property prefix
	 * @type String
	 */
	prefix: '>>',
});

// commentsObject.proto(require('./line'));
commentsObject.proto(require('./block'));
commentsObject.proto(require('./yaml'));




// exports
/**
 * This is just an interfacing method.
 * @method comments
 */
exports.comments = function comments(options) {
	// guarantee there is data to be parsed
	if (!this.raw) {
		this.readSync();
	}

	return commentsObject(this.raw, options);
};
