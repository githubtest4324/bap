module.exports = function BapWarning (code, messageParam, pathParam) {
	'use strict';
	this.type = 'warning';
	this.message = messageParam || '';
	this.path = pathParam || [];
	this.code = code || ''
	this.toString = function () {
		return 'Warning[{0}] at {1}: {2}'.format(this.code, this.path, this.message);
	};
};