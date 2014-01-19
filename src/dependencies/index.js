'use strict';

var _ = require('lodash');

var cjsNode = require('./cjs/node'),
	amdRequireJs = require('./amd/requirejs');

// just an interface
// the real thing is at require('./base'), require('./cjs') and require('./amd').
exports.dependencies = function dependencies(format) {
	format = format || 'cjs';

	// retrieve the building function
	// and partial set the path and src arguments.
	var builder = _.partial(this.dependencies.builders[format], this);

	// remove the format from the args.
	var args = Array.prototype.slice.call(arguments);
	args.shift();

	return builder.apply(this, args);
};

/**
 * Stores dependency object builders.
 */
exports.dependencies.builders = {
	'cjs-node': cjsNode,
	cjs: cjsNode,

	'amd-requirejs': amdRequireJs,
	amd: amdRequireJs
};

/**
 * Sets a builder.
 */
exports.dependencies.format = function format(name, builder) {
	this.builders[name] = builder;

	return this;
};
