'use strict';

// core:
var path = require('path');

// external:
var _ = require('lodash'),
	resolve = require('resolve');

// internal:
var base = require('../base');

// lib
var rjsparse = require('./lib/r.js/parse');

// the AMD
var AMD = base.extend(function AMD(filename, filedata, config) {
	base.prototype.initialize.apply(this, arguments);

	this.config(config);
});



// RegExps
var re = {
	relativePath: /^(.|..)\//,
	absolutePath: /^\//,
	jsExt: /\.js$/,
}



AMD.proto({

	moduleFormat: 'amd-requirejs',

	/**
	 * Parses out configurations.
		Any options the usual r.js would take.

		options: {
			// base url where to look for module files
			// and relative to which the module paths will be defined
			// (must coincide with that defined in mainConfigFile)
			basePath: './raw',

			mainConfigFile: 'amdconfig.js',

			paths: {

			},
		}
	 * Sets configuration for reading amd-requirejs
	 *
	 * @method config
	 * @param config {Object}
	 */
	config: function config(config) {
		config = config || {};

		// [1] get main config data.
		if (config.mainConfigFile) {
			var mainConfig = this.parseRequireJsConfig(config.mainConfigFile)
			config = _.extend({}, mainConfig, config);
		}

		// [2] basePath
		/**
		 * Path to which relative paths will be solved against.
		 *
		 * @property basePath
		 * @type String
		 * @default dirname of the file object.
		 */
		this.basePath = config.basePath || path.dirname(this.path);

		// [3] paths
		this.paths = config.paths || {};
	},

	/**
	 * Takes a path to a file in which requirejs
	 * configurations are defined
	 * and returns the parsed configurations object.
	 *
	 * @method parseRequireJsConfig
	 * @param fpath
	 */
	parseRequireJsConfig: function parseRequireJsConfig(fpath) {
		var raw = fs.readFileSync(fpath, { encoding: 'utf8' });

		config = rjsparse.findConfig(raw).config;

		return config;
	},

	/**
	 * Takes a module id,
	 * tries to find the module file path
	 * [1] against absolutePath
	 * [2] against relativePath
	 * [3] against a paths object
	 * [4] using node require.resolve strategy.
	 *
	 * @method resolve
	 * @param id
	 */
	resolve: function resolve(id) {

		var res;

		if (re.absolutePath.test(id)) {
			// check if is absolute path
			// if so, solve it against basePath

			// absolute paths are rare.. don't know what to do yet..
			res = id;

		} else if (re.relativePath.test(id)) {
			// check if is relative path
			// join the base path.
			res = path.join(this.basePath, id);

		} else if (this.paths[id]) {
			// check if was defined in config.paths
			res = path.join(this.basePath, this.paths[id]);

		} else {
			// not defined anywhere, try using node resolve
			return resolve.sync(id, { basedir: this.basePath });
		}

		// add trailing js
		return re.jsExt.test(res) ? res : res + '.js';
	},

	/**
	 * Returns the ids of the modules the module
	 * on this file depends on.
	 * Optionally filter the modules by origin
	 *
	 * @method ids
	 * @param origin {String} default: 'all'
	 * @return Array
	 */
	ids: function ids() {
		return rjsparse.findDependencies(this.path, this.raw);
	},
});

module.exports = AMD;
