'use strict';

var _ = require('lodash'),
	mapo = require('mapo');

/**
 * >>test-block
 * name: test
 * value: banana
 * color: yellow
 * list:
 *     - first
 *     - second
 */

exports.blockBorder = ' \\* ';

	// regexp partials
var n = '(\n|\r|\n\r)',
	start = '\\/\\*(.|\n|\r|\n\r)*?',
	body = '(.|\n|\r|\n\r)*?',
	end = '\\*\\/';

function head(prefix, name) {
	return start + prefix + name + '.*?(\n|\r|\n\r)';
}


exports.blockRegExp = function blockRegExp(name) {
	return new RegExp(head(this.prefix, name) + body + end, 'g');
};

exports.blockMatch = function blockMatch(name) {
	var re = this.blockRegExp(name);

	return this.raw.match(re);
};

exports._blockTrim = function _blockTrim(name, s) {
	return s.replace(new RegExp('^' + head(this.prefix, name)), '')		// trim start
			.replace(new RegExp('(\n|\r|\n\r).*?' + end + '$'), '')		// trim end
			.replace(new RegExp('^' + this.blockBorder, 'mg'), '');		// trim border
};

exports.block = function block(name) {
	var	matches = this.blockMatch(name);

	return matches.length > 0 ? this._blockTrim(name, matches[0]) : false;
};
