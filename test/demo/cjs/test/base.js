'use strict';

var should = require('should');

var CjsDemo = require('.././src');

describe('CjsDemo base', function () {
	beforeEach(function (done) {
		done();
	});

	it('is fine (:', function () {
		var fruit = { name: 'banana' }
		fruit.should.have.property('name', 'banana');
	});
});
