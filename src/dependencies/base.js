'use strict';

var path = require('path'),
	fs = require('fs');

var subject = require('subject'),
	resolve = require('resolve'),
	_ = require('lodash'),
	parser = require('argument-parser');

// CAREFUL! circular dependency here..
var jsfile = require('../index');

/**
 * This defines base functionalities for the dependencies object
 */
var dependencies = module.exports = subject(function dependencies(filename, filedata) {

	filedata = filedata || fs.readFileSync(filename, { encoding: 'utf8' });

	this.path = filename;
	this.src = filedata;
});


// set proto properties
dependencies.proto({
	// ids: function to get the 'dependencies'

	filenames: function filenames() {

		var args = parser(arguments);

		args.interface(['string', 'number|boolean|undefined'], ['origin', 'maxDepth'])
			.interface(['number|boolean'], ['maxDepth'])
			.defaults({
				origin: 'all',
				maxDepth: 1
			});

		args = args.evaluate();

		var ids = this.ids(args.origin),
			immediate = ids.map(this.resolve.bind(this));

		// remove false values from immediate
		// NODE CORE modules are filtered here, this.resolve.
		// core modules are resolved to false paths.
		immediate = _.compact(immediate);

		if (args.maxDepth > 1 || args.maxDepth === true) {

			var next = _.clone(immediate);

			// reduce maxDepth
			args.maxDepth = typeof args.maxDepth === 'number' ? args.maxDepth -- : args.maxDepth;

			// go deeper
			_.each(immediate, function (fname) {
				var file = jsfile(fname),
					deps = file.dependencies('cjs-node');

				next = _.union(next, deps.filenames(args.origin, args.maxDepth));
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
