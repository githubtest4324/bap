module.exports = function(){
	'use strict';
	/**
	 * Any of obj, str, date, bool, num, list, entity
	 */
	this.$type = undefined;
	/**
	 * Used in case this.type is 'list'.
	 * Any of obj, str, date, bool, num, list. May also be an entity.
	 */
	this.$itemType = undefined;

	/**
	 * Name of this property.
	 * @type {string}
	 */
	this.$name = undefined;

	/**
	 * Translation string. If null it is considered to be name of the property.
	 * @type {string}
	 */
	this.$translate = undefined;

	/**
	 * Whether this property will be persisted in database or not.
	 * If true it will not persist. By default is false.
	 * @type {null}
	 */
	this.$computed = false;

};
