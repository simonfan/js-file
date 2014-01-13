//     CjsDemo
//     (c) simonfan
//     CjsDemo is licensed under the MIT terms.

/**
 * CJS module.
 *
 * @module CjsDemo
 */

'use strict';

console.log('cjs-demo running');

// core:
var path = require('path');

// external:
var Lodash = require('lodash');

var Subject = require('subject');

// internal:
var submodules = require('./submodules');


exports.cjsdemo = function cjsdemo() {
	return 'awesome!';
};
