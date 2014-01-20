'use strict';

var path = require('path');

var subject = require('subject'),
	_ = require('lodash'),
	mapo = require('mapo');

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
	 * @property raw
	 */
	var raw = this.file.raw();
	if (!raw) {
		this.file.readSync();
		raw = this.file.raw();
	}
	this.raw = raw;

	// save options directly to the dependencies object.
	this.options = _.extend({}, this.options, options);
});


// set proto properties
dependencies.proto({
	/**
	 * The default set of options for the dependency object.
	 *
	 * @property options
	 *     @property origin ['all']
	 *         Filter dependencies according to their origins (internal, external, all)
	 *     @property depth [1]
	 *         The max depth to go in the search for dependencies.
	 *     @property base [undefined]
	 *         The base path from which filenames should be resolved.
	 */
	options: {
		origin: 'all',
		depth: 1,
		base: void(0)
	},

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
	 * Takes a series of options
	 *
	 * @method filenames
	 * @return {Array}
	 *     array of dependency filenames
	 */
	filenames: function filenames() {

		// [1] retrieve immediate dependency files.
		var ids = this.ids(this.options.origin),
			// fnames has only ABSOLUTE paths.
			fnames = ids.map(this.resolve.bind(this));

		// remove false values from fnames
		//     NODE CORE modules are filtered here, this.resolve.
		//     core modules are resolved to false paths.
		fnames = _.compact(fnames);


		// [2] create an answer object
		//     that has only paths relative to the base.
		var res = !this.options.base ? fnames : _.map(fnames, function (fname) {
			return path.relative(this.options.base, fname);
		}.bind(this));

		// [3] if required, go recursive.
		if (this.options.depth > 1 || this.options.depth === true) {

			// calculate depth
			var depth = typeof this.options.depth === 'number' ?
				this.options.depth - 1 : 	// number
				this.options.depth;			// boolean


			// create a new depOptions
			var depOptions = _.extend({}, this.options, {
				depth: depth
			});

			// go deeper
			_.each(fnames, function (fname) {
					// create the file object
				var file = this.file.constructor(fname),
					// create the dependencies object
					deps = file.dependencies(depOptions);

				res = _.union(res, deps.filenames());
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

		// [1] retrieve the keys that will identify file objects
		var fileIds = this.filenames();

		// [2] retrieve the file paths
		var filePaths = !this.options.base ? fileIds : _.map(fileIds, function (id) {
			return path.join(this.options.base, id);
		}.bind(this));

		// [3] create a response object
		var res = {};

		_.each(fileIds, function (id, index) {
			// use file.constructor.
			res[id] = this.file.constructor(filePaths[index]);
		}.bind(this));

		return res;
	},

	/**
	 * @method map
	 * @param what {String} ['filenames','files','ids']
	 * @param func
	 */
	map: function map(what, func) {
		return _.map(this[what](), func);
	},

	/**
	 * Invokes a method over the file object of each dependency.
	 *
	 * @method invoke
	 * @param method {String}
	 */
	invoke: function invoke(method) {
		var files = this.files(),
			args = Array.prototype.slice.call(arguments);

		args.shift();

		return mapo(files, function (f) {
			return f[method].apply(f, args);
		});
	},
});
