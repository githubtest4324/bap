module.exports = function BapError (code, pathParam, messageParam) {
	'use strict';
	this.type = 'error';
	this.message = messageParam || '';
	this.path = pathParam || [];
	this.code = code || '';
	this.toString = function () {
		return 'Error[{0}] at {1}: {2}'.format(this.code, this.path, this.message);
	};
};