'use strict';

var path = require('path'),
	fs = require('fs');

var subject = require('subject'),
	_ = require('lodash'),
	parser = require('argument-parser');

// CAREFUL! circular dependency here..
var jsfile = require('../index');

/**
 * Base constructor of the dependencies object.
 * This constructor is incomplete by itself,
 * requiring the format-extensions.
 *
 * @class dependencies
 * @constructor
 * @param fileobj {Object}
 *     The file object to which this dependencies
 *     object pertains.
 * @param options {Object}
 */
var dependencies = module.exports = subject(function dependencies(fileobj, options) {

	/**
	 * Stores reference to the file object this
	 * dependencies object refers to.
	 * @property file
	 */
	this.file = fileobj;

	/**
	 * Path to the file.
	 * @property path
	 */
	this.path = this.file.path;

	/**
	 * The raw string data of the file.
	 * @property src
	 */
	this.src = this.file.data() || fs.readFileSync(this.path, { encoding: 'utf8' });

	// save options directly to the dependencies object.
	this.options = _.extend({}, this.options, options);
});


// set proto properties
dependencies.proto({
	/**
	 * Returns the ids of modules on which the current file depends,
	 * optionally filtered by module origin.
	 *
	 * This method is implemented on format files, as the
	 * dependency parsing differs according to formats.
	 *
	 * @method ids
	 * @param [origin] {String}
	 */
	// ids: function ids(origin) {}

	/**
	 * Takes a module id and returns the full filename
	 * to the file that stores the module depended upon.
	 *
	 * Implemented at format level.
	 *
	 * @method resolve
	 * @param id {String}
	 * @return filename {String}
	 */
	// resolve: function resolve(id) {}

	/**
	 * The default set of options for the dependency object.
	 *
	 * @property options
	 */
	options: {
		origin: 'all',
		depth: 1,
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
			.interface(['string|undefined', 'number|boolean|undefined', 'string|undefined'], ['origin', 'depth', 'base'])
			.interface(['string|undefined', 'string|undefined'], ['origin', 'base'])
			.interface(['number|boolean', 'string|undefined'], ['depth', 'base'])
			.defaults(this.options)
			.evaluate();
	},

	/**
	 * Takes a series of options
	 *
	 * @method filenames
	 * @param [origin] {String}
	 *     the origin of the modules to be listed:
	 *     - internal, external, [all]
	 * @param [depth] {Number|Boolean}
	 *     the max depth of dependencies to go through
	 *     if boolean && true, goes to the very end of the tree.
	 * @param [base] {String}
	 *     the base path to which filenames should be relative
	 *     defaults to no base path
	 * @return {Array}
	 *     array of dependency filenames
	 */
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
		if (args.depth > 1 || args.depth === true) {

			// calculate depth
			args.depth = typeof args.depth === 'number' ?
				args.depth - 1 : // number
				args.depth;		// boolean

			// go deeper
			_.each(fnames, function (fname) {

				var file = jsfile(fname),
					deps = file.dependencies(this.moduleFormat);

				res = _.union(res, deps.filenames(args));
			}.bind(this));
		}

		return res;
	},

	/**
	 * Implements the same interface as '.filenames',
	 * but instead of returning filenames,
	 * returns file objects.
	 *
	 * @method files
	 * @return file objects {Object}
	 */
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
