'use strict';

var path = require('path');

var should = require('should');

var jsfile = require('.././src');

var _ = require('lodash');

describe('block = comments.block(name {String})', function () {

	beforeEach(function () {
		this.file = jsfile(path.join(__dirname, 'demo/comments'));
	});

	it('block (single)', function () {
		var block = this.file.comments().block('test-block'),
			noBlock = this.file.comments().block('fake-block');

		block.should.be.type('string');

		should(noBlock).be.not.ok;
	});

	it('blocks (multiple)', function () {
		var blocks = this.file.comments().blocks('to-do'),
			noBlocks = this.file.comments().blocks('fake-blocks');

		blocks.length.should.eql(2);

		noBlocks.length.should.eql(0);
	});
});
