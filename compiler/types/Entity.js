module.exports = function () {
	'use strict';
	this.$type = 'entity';
	this.$name = undefined;
	this.$parent = undefined;

	this.getNamespace = function () {
		return this.$parent.$namespace;
	};

	this.toString = function(){
        return "Entity: {0}".format(this.$name);
    };
};