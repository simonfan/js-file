'use strict';

var YAML = require('js-yaml'),
	_ = require('lodash');

/**
 * Fetches a single block of yaml-formatted data.
 *
 * @method yaml
 * @param name {String}
 * @param [multiple] {Boolean}
 */
exports.yaml = function yaml(name, multiple) {
	if (multiple) {
		return this.yamls(name);
	}

	var block = this.block(name);

	return block ? YAML.load(block) : void(0);
};

/**
 * Fetches multiple blocks of yaml-formatted data.
 *
 * @method yamls
 * @param name {String}
 */
exports.yamls = function yamls(name) {
	var blocks = this.blocks(name);

	return _.map(blocks, YAML.load);
};

// aliases
exports.yml = exports.yaml;
exports.ymls = exports.yamls;
