'use strict';

var YAML = require('js-yaml');

exports.yaml = function yaml(name) {
	var block = this.block(name);

	return block ? YAML.load(block) : false;
};

// alias
exports.yml = exports.yaml;
