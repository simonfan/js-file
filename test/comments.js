'use strict';

var path = require('path');

var should = require('should');

var jsfile = require('.././src');

var _ = require('lodash');

describe('comments = file.comments([options])', function () {

	beforeEach(function () {
		this.commentsFile = jsfile(path.join(__dirname, 'demo/comments'));
	});

	describe('comments.block/blocks', function () {
		it('comments.block(name {String})', function () {
			var re = this.commentsFile.comments().blockRegExp('test-block');

			re.test(this.commentsFile.raw).should.be.true;
		});

		it('comments.blocks(name {String})', function () {
			var blocks = this.commentsFile.comments().blocks('to-do');

			blocks.length.should.eql(2);
		});

		it('if no block is matched, returns false', function () {
			var block = this.commentsFile.comments().block('non-existent-block'),
				yamlBlock = this.commentsFile.comments().yml('non-existent-yaml');

			should(block).not.be.ok;
			should(yamlBlock).not.be.ok;
		});
	})

	describe('comments.yml/ymls', function () {

		it('comments.yml(name {String})', function () {
			var yml = this.commentsFile.comments().yaml('test-block');

			yml.value.should.equal('banana');
		});

		it('comments.ymls(name {String})', function () {
			var ymls = this.commentsFile.comments().ymls('to-do');

			ymls.length.should.equal(2);

			_.first(ymls).name.should.equal('write lalalala')
		});
	});

});
