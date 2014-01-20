'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('dependencyIds = deps.ids()', function () {

	beforeEach(function () {
		this.cjsFile = jsfile(path.join(__dirname, 'demo/cjs/src/index'), {
			format: 'cjs'
		});
	});

	it('retrieve dependency ids from all origins', function () {

		var deps = this.cjsFile.dependencies({
			origin: 'all'
		});

		var ids = deps.ids();

		ids.length.should.eql(4);

		var shouldHave = ['lodash', 'subject', './submodules', 'path'];

		_.each(shouldHave, function (id) {
			_.contains(ids, id).should.be.true;
		});
	});

	it('retrieve dependency ids from only external modules', function () {
		var deps = this.cjsFile.dependencies({
			origin: 'external'
		});

		var ids = deps.ids();

		ids.length.should.eql(2);

		var shouldHave = ['lodash', 'subject'];

		_.each(shouldHave, function (id) {
			_.contains(ids, id).should.be.true;
		});
	});

	it('retrieve dependency ids from internal modules only', function () {
		var deps = this.cjsFile.dependencies({
				origin: 'internal',
			}),
			ids = deps.ids();

		ids.length.should.eql(1);

		var shouldHave = ['./submodules'];

		_.each(shouldHave, function (id) {
			_.contains(ids, id).should.be.true;
		});
	});

});
