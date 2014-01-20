'use strict';

var path = require('path');

var should = require('should'),
	_ = require('lodash'),
	commondir = require('commondir');

var jsfile = require('.././src');

describe('deps = file.dependencies(options).ids()', function () {

	beforeEach(function () {
		this.amdFile = jsfile(path.join(__dirname, 'demo/amd/src/index.js'), {
			format: 'amd'
		});
	});

	it('amd', function () {
		var dependencies = this.amdFile.dependencies({
			base: path.join(__dirname, 'amd'),
			paths: {
				lodash: '../bower_components/lodash/lodash',
				subject: 'lasdlasld'
			}
		});

		dependencies.should.be.type('object');

		dependencies.ids().length.should.eql(2);
	});
});
