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

		describe('file.comment', function () {

			it('can create regexp for block comments', function () {
				var re = this.commentsFile.comments().blockRegExp('test-block');

				re.test(this.commentsFile.raw).should.be.true;
			})

			it('can parse comment blocks', function () {
				var a = this.commentsFile.comments().block('test-block');

				a.split('\n').length
					.should.equal(6)
			})

			it('can parse yaml formatted blocks', function () {
				var yml = this.commentsFile.comments().yaml('test-block');

				yml.value.should.equal('banana');
			})

		});
	});
});
