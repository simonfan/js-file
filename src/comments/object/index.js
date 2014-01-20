/**
 * The comments object builder.
 * Could be separated into a standalone module in the future..
 *
 * @module js-file
 * @submodule comments-object
 */

'use strict';

var _ = require('lodash'),
	subject = require('subject');


/**
 * The constructor of the comments object.
 *
 * @class comments
 */
var comments = module.exports = subject(function comments(raw, options) {

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

comments.proto({
	/**
	 * Prefix to be used before any comment-block name definition.
	 * @property prefix
	 * @type String
	 */
	prefix: '>>',
});

// comments.proto(require('./line'));
comments.proto(require('./block'));
comments.proto(require('./yaml'));
