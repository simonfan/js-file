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
var dependencies = module.exports = subject(function dependencies(fileobj, options) {

	this.file = fileobj;
	this.path = this.file.path;
	this.src = this.file.data() || fs.readFileSync(this.path, { encoding: 'utf8' });

	// save options directly to the dependencies object.
	this.options = _.extend({}, this.options, options);
});


// set proto properties
dependencies.proto({
	// ids: function to get the 'dependencies'

	options: {
		origin: 'all',
		maxDepth: 1,
		base: void(0)
	},

	/**
	 * This method parses arguments for both 'files' and 'filenames'
	 * methods.
	 *
	 * @method __fileInterface
	 */
	__fileInterface: function __fileInterface(args) {
		return parser(args)
			.interface(['object'], function (options) { return options; })
			.interface(['string|undefined', 'number|boolean|undefined', 'string|undefined'], ['origin', 'maxDepth', 'base'])
			.interface(['string|undefined', 'string|undefined'], ['origin', 'base'])
			.interface(['number|boolean', 'string|undefined'], ['maxDepth', 'base'])
			.defaults(this.options)
			.evaluate();
	},

	filenames: function filenames() {

		// [1] parse arguments
		var args = this.__fileInterface(arguments);

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

		// [1] parse arguments
		var args = this.__fileInterface(arguments);

		// [2] retrieve the keys that will identify file objects
		var fileIds = this.filenames(args);

		// [3] retrieve the file paths
		var filePaths = !args.base ? fileIds : _.map(fileIds, function (id) {
			return path.join(args.base, id);
		});

		// [4] create a response object
		var res = {};

		_.each(fileIds, function (id, index) {
			// use file.constructor.
			res[id] = this.file.constructor(filePaths[index]);
		}.bind(this));

		return res;
	}
});
