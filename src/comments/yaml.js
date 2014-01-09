'use strict';

var YAML = require('js-yaml');

exports.yaml = function (name) {
	return YAML.load(this.block(name));
};
