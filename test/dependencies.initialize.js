'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('deps = file.dependencies(options {Object})', function () {

	beforeEach(function () {

		this.cjsFile = jsfile(path.join(__dirname, 'demo/cjs/src/index'), {
			format: 'cjs'
		});
	});

	it('initializes', function () {
		var deps = this.cjsFile.dependencies();

		deps.should.be.type('object');
	});

	it('stores options', function () {
		var depOptions = {
				depth: true,
				base: '/lalala',
				origin: 'all',
			},
			deps = this.cjsFile.dependencies(depOptions);

		deps.options.should.eql(depOptions);
	});

	it('stores the raw file data', function () {
		var deps = this.cjsFile.dependencies();

		deps.raw.should.eql(this.cjsFile.raw());
	});
});
