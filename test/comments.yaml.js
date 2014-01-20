'use strict';

var path = require('path');

var should = require('should');

var jsfile = require('.././src');

var _ = require('lodash');

describe('data = file.comments([options]).yaml(name)', function () {

	beforeEach(function () {
		this.file = jsfile(path.join(__dirname, 'demo/comments'));
	});

	it('comments.yml(name {String})', function () {
		var yml = this.file.comments().yaml('test-block');

		yml.value.should.equal('banana');
	});

	it('comments.ymls(name {String})', function () {
		var ymls = this.file.comments().ymls('to-do');

		ymls.length.should.equal(2);

		_.first(ymls).name.should.equal('write lalalala')
	});

});
