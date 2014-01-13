'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash');

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

		it('depFnames = deps.filenames([modOrigin = all], [maxDepth = 1])', function () {
			var fnames = this.cjsDeps.filenames('external');

			fnames.length.should.eql(2);
		});

		it('allDepFnames = deps.filenames(true)', function () {
			var fnames = this.cjsDeps.filenames(true);
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

});
