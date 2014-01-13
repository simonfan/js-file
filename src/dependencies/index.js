'use strict';

var _ = require('lodash');

var cjsNode = require('./cjs/node'),
	amdRequireJs = require('./amd/requirejs');

var formats = {
	'cjs-node': cjsNode,
	cjs: cjsNode,

	'amd-requirejs': amdRequireJs,
	amd: amdRequireJs
};


// just an interface
// the real thing is at require('./base'), require('./cjs') and require('./amd').
exports.dependencies = function dependencies(format) {
	format = format || 'cjs';

	var args = Array.prototype.slice.call(arguments);
	args.shift();

	return _.partial(formats[format], this.path, this.src)
			.apply(this, args);
};
