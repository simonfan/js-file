'use strict';

var YAML = require('js-yaml'),
	_ = require('lodash');

exports.yaml = function yaml(name) {
	var block = this.block(name);

	return block ? YAML.load(block) : false;
};

exports.yamls = function yamls(name) {
	var blocks = this.blocks(name);

	return blocks ? _.map(blocks, YAML.load) : false;
};

// aliases
exports.yml = exports.yaml;
exports.ymls = exports.yamls;
