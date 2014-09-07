var utils = require('./utils/utils');

module.exports = function BapError (code, srcFileNameParam, pathParam, messageParam) {
	'use strict';
	this.type = 'error';
	this.message = messageParam || '';
	this.path = pathParam || '';
	this.code = code || '';
	this.srcFileName = srcFileNameParam;
	this.toString = function () {
		var fileIdentifier = utils.logFieldIdentifier(this.path, this.srcFileName);
		return 'Error[{0}] at {1}: {2}'.format(this.code, fileIdentifier, this.message);
	};
};