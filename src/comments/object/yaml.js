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
	return multiple ?
		this.yamls(name) :
		this.parseYamlBlock(this.block(name));
};

/**
 * Fetches multiple blocks of yaml-formatted data.
 *
 * @method yamls
 * @param name {String}
 */
exports.yamls = function yamls(name) {
	var blocks = this.blocks(name);

	return _.map(blocks, this.parseYamlBlock.bind(this));
};


exports.parseYamlBlock = function parseYamlBlock(block) {

	if (!block) { return void(0); }

	// try parse yaml
	try {

		return YAML.load(block);

	} catch (e) {

		if (this.filepath) {
			// if filepath was defined, throw custom error
			var msg = 'Error parsing YAML at file ' + this.filepath;
			throw new Error(msg + '\n"' + e.message + '"');

		} else {
			// otherwise just throw the yaml parser error
			throw e;
		}
	}
}

// aliases
exports.yml = exports.yaml;
exports.ymls = exports.yamls;
