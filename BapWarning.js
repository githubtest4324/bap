var utils = require('./utils/utils');

module.exports = function BapWarning (code, srcFileNameParam, messageParam, pathParam) {
	'use strict';
	this.type = 'warning';
	this.message = messageParam || '';
	this.path = pathParam || '';
	this.code = code || '';
	this.srcFileName = srcFileNameParam;
	this.toString = function () {
		var fileIdentifier = utils.logFieldIdentifier(this.path, this.srcFileName);
		return 'Warning[{0}] at {1}: {2}'.format(this.code, fileIdentifier, this.message);
	};
};