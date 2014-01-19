'use strict';

var _ = require('lodash');

/**
 * >>test-block
 * name: test
 * value: banana
 * color: yellow
 * list:
 *     - first
 *     - second
 */

exports.blockBorder = ' \\* ?';

	// regexp partials
var n = '(\n|\r|\n\r)',
	start = '\\/\\*(.|\n|\r|\n\r)*?',
	body = '(.|\n|\r|\n\r)*?',
	end = '\\*\\/';

function head(prefix, name) {
	return start + prefix + name + '.*?(\n|\r|\n\r)';
}


/**
 * Builds a regular expression that matches a comment block
 * with a given name.
 *
 * @method blockRegExp
 * @param name
 * @return RegExp
 */
exports.blockRegExp = function blockRegExp(name) {
	return new RegExp(head(this.prefix, name) + body + end, 'g');
};

/**
 * Tries to match the block.
 *
 * @method blockMatch
 * @param name {String}
 * @return array|null {result from str.match}
 */
exports.blockMatch = function blockMatch(name) {
	var re = this.blockRegExp(name);

	return this.raw.match(re);
};

/**
 * Removes the block data wrapper.
 *
 * @method _blockTrim
 * @private
 * @param name {String}
 * @param s {String}
 */
exports._blockTrim = function _blockTrim(name, s) {
	return s.replace(new RegExp('^' + head(this.prefix, name)), '')		// trim start
			.replace(new RegExp('(\n|\r|\n\r).*?' + end + '$'), '')		// trim end
			.replace(new RegExp('^' + this.blockBorder, 'mg'), '');		// trim border
};

/**
 * Matches the block, removes wrapper and returns the string.
 *
 * @method block
 * @param name
 * @return undefined|string
 */
exports.block = function block(name, multiple) {

	if (multiple) {
		return this.blocks(name);
	}

	var	matches = this.blockMatch(name);

	return matches && matches.length > 0 ? this._blockTrim(name, matches[0]) : void(0);
};

/**
 * Does the same as .block, just for multiple blocks.
 *
 * @method blocks
 * @param name {String}
 * @returns strings
 */
exports.blocks = function blocks(name) {
	var matches = this.blockMatch(name);

	return matches && matches.length > 0 ?
		_.map(matches, _.partial(this._blockTrim, name).bind(this)) : [];
};
