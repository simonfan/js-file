'use strict';

var path = require('path'),
	fs = require('fs');

var subject = require('subject'),
	resolve = require('resolve'),
	_ = require('lodash');

// CAREFUL! circular dependency here..
var jsfile = require('../index');

/**
 * This defines base functionalities for the dependencies object
 */
var dependencies = module.exports = subject(function dependencies(filename, filedata) {

	filedata = filedata || fs.readFileSync(filename, { encoding: 'utf-8' });

	this.path = filename;
	this.src = filedata;
});


// set proto properties
dependencies.proto({
	// ids: function to get the 'dependencies'

	filenames: function filenames(origin, maxDepth) {
		maxDepth = typeof origin === 'number' || typeof origin === 'boolean' ? origin : maxDepth ? maxDepth : 1;
		origin = typeof origin === 'string' ? origin : 'all';

		var ids = this.ids(origin),
			immediate = ids.map(this.resolve.bind(this));

		// remove false values from immediate
		// NODE CORE modules are filtered here, this.resolve.
		// core modules are resolved to false paths.
		immediate = _.compact(immediate);

		if (maxDepth > 1 || maxDepth === true) {

			var next = _.clone(immediate);

			// reduce maxDepth
			maxDepth = typeof maxDepth === 'number' ? maxDepth -- : maxDepth;

			// go deeper
			_.each(immediate, function (fname) {
				var file = jsfile(fname),
					deps = file.dependencies('cjs-node');

				next = _.union(next, deps.filenames(origin, maxDepth));
			});

			return next;

		} else {
			return immediate;
		}
	},

	files: function files() {
		var filenames = this.filenames.apply(this, arguments);

		var res = {};

		_.each(filenames, function (filename) {
			// build file and set on res
			res[filename] = jsfile(filename);

		}.bind(this));

		return res;
	},

	tree: function tree(options) {
		options = options || {};

		var immediate = this.ids();
	}
});
