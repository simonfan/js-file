'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('filenames = file.dependencies(options).filenames()', function () {

	beforeEach(function () {
		this.cjsFile = jsfile(path.join(__dirname, 'demo/cjs/src/index'), {
			format: 'cjs'
		});
	});

	it('retrieve all filenames', function () {
		var fnames = this.cjsFile.dependencies({
			depth: true,
		//	origin: 'all',
		//	base: void(0)
		}).filenames();

		fnames.length.should.eql(7);
	});

	it('retrieve external filenames', function () {
		var deps = this.cjsFile.dependencies({
				origin: 'external',
			//	base: void(0),
			//	depth: 1
			}),
			fnames = deps.filenames();

		fnames.length.should.eql(2);
	});


	it('retrieve relative filenames', function () {
		// using basepath
		var basepath = path.join(__dirname, 'demo/cjs'),
			deps = this.cjsFile.dependencies({
				base: basepath,
			//	origin: 'all',
			//	depth: 1
			}),
			fnames = deps.filenames();

		fnames.length.should.eql(3);

		// base path should not be in the fnames
		_.each(fnames, function (fname) {
			var match = fname.match(basepath);

			should(match).be.not.ok;
		});
	});
});
