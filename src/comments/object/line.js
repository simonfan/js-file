'use strict';

var _ = require('lodash');

// >>line: value

// >>time: 30
// >>author: simonfan
// >>module-name:

	// regexp partials
var start = '\\/\\*.*?',
	body = '.*?',
	end = '\\\n';

exports.lineRegExp = function lineRe(name) {
	return new RegExp(start + this.prefix + name);
};
