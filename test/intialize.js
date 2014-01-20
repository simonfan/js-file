'use strict';

var path = require('path');

var should = require('should');

var jsfile = require('.././src');

describe('jsfile initialization', function () {

	it('initializes :{-', function () {
		var file = jsfile(path.join(__dirname, 'demo/comments'));

		file.should.be.type('object');
	});


	it('stores format option', function () {
		var file = jsfile(path.join(__dirname, 'demo/comments'), {
			format: 'cjs-node'
		});


		file.format.should.equal('cjs-node');
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
