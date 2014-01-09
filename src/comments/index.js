'use strict';

/**
 * Holds functionality related to parsing commentss.
 *
 * @module comments
 */

var _ = require('lodash'),
	subject = require('subject');

var comments = module.exports = subject(function comments(raw, options) {

	options = options || {};

	this.raw = raw;

	this.options = options;

	this.prefix = options.prefix || this.prefix;

	this.blockBorder = options.blockBorder || this.blockBorder;
});

comments.proto({
	prefix: '>>',
});

// comments.proto(require('./line'));
comments.proto(require('./block'));
comments.proto(require('./yaml'));
