module.exports = function () {
	'use strict';
	this.$type = 'namespace';
	this.$isDefault = false;
	/**
	 * Fully qualified namespace name.
	 */
	this.$namespace = null;

	/**
	 * Only the name part of the namespace.
	 */
	this.$name = null;

	/**
	 * Parent namespace or root
	 */
	this.$parent = null;

	this.toString = function () {
	    if(this.$isDefault){
	        return "Namespace: default";
	    } else{
	        return "Namespace: {0}".format(this.$namespace);
	    }
	};
};