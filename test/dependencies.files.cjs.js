'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('files = file.dependencies(options).files()', function () {

	beforeEach(function () {
		this.cjsFile = jsfile(path.join(__dirname, 'demo/cjs/src/index'), {
			format: 'cjs'
		});
	});
});
