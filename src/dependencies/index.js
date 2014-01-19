'use strict';

var _ = require('lodash');

var cjsNode = require('./cjs/node'),
	amdRequireJs = require('./amd/requirejs');

/**
 * Stores dependency object builders.
 *
 * @class builders
 * @static
 * @private
 */
var builders = {
	'cjs-node': cjsNode,
	cjs: cjsNode,

	'amd-requirejs': amdRequireJs,
	amd: amdRequireJs
};


/**
 * This is an 'interface' method that builds a 'dependencies' object.
 *
 * @method dependencies
 * @param options
 *     options to be passed to the dependencies object constructor
 */
exports.dependencies = function dependencies(options) {

	options = options || {};
	var format = options.format || 'cjs';

	return builders[format](this, options);
};
