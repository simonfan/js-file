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
			this.file = jsfile(path.join(__dirname, 'demo/comments'));
		});

		it('reads', function () {
			this.file
				.readSync()
				.data().should.be.type('string');
		});

		describe('file.comment', function () {

			it('can create regexp for block comments', function () {
				var re = this.file.comments().blockRegExp('test-block');

				re.test(this.file.raw).should.be.true;
			})

			it('can parse comment blocks', function () {
				var a = this.file.comments().block('test-block');

				a.split('\n').length
					.should.equal(6)
			})

			it('can parse yaml formatted blocks', function () {
				var yml = this.file.comments().yaml('test-block');

				console.log(yml)

				yml.value.should.equal('banana');
			})

		});
	});
});
