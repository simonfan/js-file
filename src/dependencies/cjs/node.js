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

	ids: function ids(origin) {

		var deps = _.uniq(detective(this.src));

		return (origin && origin !== 'all') ? _.filter(deps, function (dep) {
			return this.moduleOrigin(dep) === origin;
		}.bind(this)) : deps;
	},

	resolve: function (id) {
		return resolve.isCore(id) ? false : resolve.sync(id, {
			basedir: path.dirname(this.path)
		});
	},

	moduleOrigin: function moduleOrigin(id) {
		if (resolve.isCore(id)) {
			return 'core';
		} else {
			return regexp.internalModule.test(id) ? 'internal' : 'external';
		}
	},
});
