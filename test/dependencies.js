'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('jsfile basics', function () {

	it('initializes :{-', function () {
		var file = jsfile(path.join(__dirname, 'demo/comments'));

		file.should.be.type('object');
	});

	describe('deps = file.dependencies(\'cjs\')', function () {

		beforeEach(function () {
			this.cjsFile = jsfile(path.join(__dirname, 'demo/cjs/src/index'));

			this.cjsDeps = this.cjsFile.dependencies('cjs');
		});

		it('depIds = deps.ids()', function () {
			var ids = this.cjsDeps.ids();

			ids.length.should.eql(4);

			var shouldHave = ['lodash', 'subject', './submodules', 'path'];

			_.each(shouldHave, function (id) {
				_.contains(ids, id).should.be.true;
			});
		});

		it('externalDepIds = deps.ids(\'external\')', function () {
			var externalDepIds = this.cjsDeps.ids('external');

			externalDepIds.length.should.eql(2);

			var shouldHave = ['lodash', 'subject'];

			_.each(shouldHave, function (id) {
				_.contains(externalDepIds, id).should.be.true;
			});
		});

		it('internalDepIds = deps.ids(\'internal\')', function () {
			var internalDepIds = this.cjsDeps.ids('internal');

			internalDepIds.length.should.eql(1);

			var shouldHave = ['./submodules'];

			_.each(shouldHave, function (id) {
				_.contains(internalDepIds, id).should.be.true;
			});
		});

		describe('depFnames = deps.filenames([modOrigin = all], [maxDepth = 1], [basePath = false])', function () {

			it('depFnames = deps.filenames(origin) -> basepath = false, maxDepth = 1', function () {
				var externalFnames = this.cjsDeps.filenames('external');

				externalFnames.length.should.eql(2);
			});

			it('allDepFnames = deps.filenames(maxDepth) -> origin = \'all\', basepath = false', function () {
				var fnames = this.cjsDeps.filenames(true);

				fnames.length.should.eql(7);
			});


			it('depFnames = deps.filenames(origin, basepath) -> maxDepth = 1', function () {
				// using basepath
				var basepath = path.join(__dirname, 'demo/cjs'),
					externalRelativeFnames = this.cjsDeps.filenames('external', basepath);

				externalRelativeFnames.length.should.eql(2);

				// base path should not be in the externalRelativeFnames
				_.each(externalRelativeFnames, function (fname) {
					var match = fname.match(basepath);

					should(match).be.not.ok;
				});
			});

			it('depFnames = deps.filenames(maxDepth, basepath) -> origin = \'all\'', function () {
				var basepath = path.join(__dirname, 'demo/cjs'),
					externalRelativeFnames = this.cjsDeps.filenames(1, basepath);

				externalRelativeFnames.length.should.eql(3);

				// base path should not be in the externalRelativeFnames
				_.each(externalRelativeFnames, function (fname) {
					var match = fname.match(basepath);

					should(match).be.not.ok;
				});
			});
		});
	});

	describe('deps = file.dependencies(\'amd\')', function () {

		beforeEach(function () {
			this.amdFile = jsfile(path.join(__dirname, 'demo/amd/src/index.js'));

			this.amdDeps = this.amdFile.dependencies('cjs');
		});

		it('amd', function () {
			var dependencies = this.amdFile.dependencies('amd', {
				basePath: path.join(__dirname, 'amd'),
				paths: {
					lodash: '../bower_components/lodash/lodash',
					subject: 'lasdlasld'
				}
			});

			dependencies.should.be.type('object');

			dependencies.ids().length.should.eql(2);
		});
	});

	describe('deps = file.dependencies({format}, {options})', function () {
		beforeEach(function () {

			var p = path.join(__dirname, 'demo/cjs/src/index');

			this.cjsFile = jsfile(p);

			this.internalDepsUpTo2nd = this.cjsFile.dependencies('cjs', {
				origin: 'internal',
				maxDepth: 2,
				base: path.join(__dirname, 'demo/cjs'),
			});
		});

		it('allDepFnames = deps.filenames(), using the options defined at initialization', function () {
			var filenames = this.internalDepsUpTo2nd.filenames();

			filenames.length.should.be.eql(3);
		});

	});

});
