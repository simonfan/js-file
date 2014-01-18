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
var dependencies = module.exports = subject(function dependencies(filename, filedata, options) {

	filedata = filedata || fs.readFileSync(filename, { encoding: 'utf8' });

	this.path = filename;
	this.src = filedata;

	// save options directly to the dependencies object.
	this.options = _.extend(this.options, options);
});


// set proto properties
dependencies.proto({
	// ids: function to get the 'dependencies'

	options: {
		origin: 'all',
		maxDepth: 1,
		base: void(0)
	},

	filenames: function filenames() {

		// [1] parse arguments.
		var args = parser(arguments)
			.interface(['object'], function (options) { return options; })
			.interface(['string|undefined', 'number|boolean|undefined', 'string|undefined'], ['origin', 'maxDepth', 'base'])
			.interface(['string|undefined', 'string|undefined'], ['origin', 'base'])
			.interface(['number|boolean', 'string|undefined'], ['maxDepth', 'base'])
			.defaults(this.options);

		args = args.evaluate();

		// [2] retrieve immediate dependency files.
		var ids = this.ids(args.origin),
			// fnames has only ABSOLUTE paths.
			fnames = ids.map(this.resolve.bind(this));

		// remove false values from fnames
		//     NODE CORE modules are filtered here, this.resolve.
		//     core modules are resolved to false paths.
		fnames = _.compact(fnames);


		// [3] create an answer object
		//     that has only paths relative to the base.
		var res = !args.base ? fnames : _.map(fnames, function (fname) {
			return path.relative(args.base, fname);
		});

		// [4] if required, go recursive.
		if (args.maxDepth > 1 || args.maxDepth === true) {

			// calculate maxDepth
			args.maxDepth = typeof args.maxDepth === 'number' ?
				args.maxDepth - 1 : // number
				args.maxDepth;		// boolean

			// go deeper
			_.each(fnames, function (fname) {

				var file = jsfile(fname),
					deps = file.dependencies(this.moduleFormat);

				res = _.union(res, deps.filenames(args));
			}.bind(this));
		}

		return res;
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
