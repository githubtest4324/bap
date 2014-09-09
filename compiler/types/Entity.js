module.exports = function () {
	'use strict';
	this.$type = 'entity';
	this.$name = undefined;
	this.$parent = undefined;

	this.getNamespace = function () {
		return this.$parent.$namespace;
	};
};