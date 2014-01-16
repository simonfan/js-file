'use strict';

var path = require('path');

var should = require('should');

var jsfile = require('.././src');

describe('jsfile basics', function () {

	it('initializes :{-', function () {
		var file = jsfile(path.join(__dirname, 'demo/comments'));

		file.should.be.type('object');
	});

	describe('file = jsfile(fpath {String})', function () {

		beforeEach(function () {
			this.commentsFile = jsfile(path.join(__dirname, 'demo/comments'));
		});

		it('reads', function () {
			this.commentsFile
				.readSync()
				.data().should.be.type('string');
		});
	});
});
