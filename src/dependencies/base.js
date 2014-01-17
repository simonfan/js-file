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

		args.interface(['string|undefined', 'number|boolean|undefined', 'string|undefined'], ['origin', 'maxDepth', 'base'])
			.interface(['string|undefined', 'string|undefined'], ['origin', 'base'])
			.interface(['number|boolean', 'string|undefined'], ['maxDepth', 'base'])
			.defaults({
				origin: 'all',
				maxDepth: 1,
				base: false			// no base by default
			});


		args = args.evaluate();

		var ids = this.ids(args.origin),
			immediate = ids.map(function (id) {
				var fpath = this.resolve(id);

				return fpath && args.base ? path.relative(args.base, fpath) : fpath;
			}.bind(this));

		// remove false values from immediate
		// NODE CORE modules are filtered here, this.resolve.
		// core modules are resolved to false paths.
		immediate = _.compact(immediate);

		if (args.maxDepth > 1 || args.maxDepth === true) {

			var next = _.clone(immediate),
				maxDepth = typeof args.maxDepth === 'number' ? args.maxDepth - 1 : args.maxDepth;

			// go deeper
			_.each(immediate, function (fname) {

				// if basepath was defined...
				fname = args.base ? path.join(args.base, fname) : fname;

				var file = jsfile(fname),
					deps = file.dependencies('cjs-node');

				next = _.union(next, deps.filenames(args.origin, maxDepth));
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
});
