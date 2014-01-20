'use strict';

// native:
var path = require('path');

// third-party:
var resolve = require('resolve'),
	detective = require('detective'),
	_ = require('lodash');

// submodules:
	// the base dependency object constructor
var base = require('../base');


// regular expresions
var regexp = {
	internalModule: /^(.|..)\//
};


// the CJS
var CJS = module.exports = base.extend({

	/**
	 * Parses out the ids of the modules on
	 * which this file depends on.
	 *
	 * @method ids
	 */
	ids: function ids() {

		var deps = _.uniq(detective(this.raw)),
			origin = this.options.origin;

		return (origin && origin !== 'all') ? _.filter(deps, function (dep) {
			return this.moduleOrigin(dep) === origin;
		}.bind(this)) : deps;
	},

	/**
	 * Takes a module id and returns the path to the file
	 * that defines that module.
	 *
	 * If the module is a core node module, returns false.
	 *
	 * @method resolve
	 * @param id {String}
	 */
	resolve: function (id) {
		return resolve.isCore(id) ? false : resolve.sync(id, {
			basedir: path.dirname(this.path)
		});
	},

	/**
	 * Takes a module id and returns its 'origin'
	 * 'internal','external','core';
	 *
	 * @method moduleOrigin
	 * @param id {String}
	 */
	moduleOrigin: function moduleOrigin(id) {
		if (resolve.isCore(id)) {
			return 'core';
		} else {
			return regexp.internalModule.test(id) ? 'internal' : 'external';
		}
	},
});
