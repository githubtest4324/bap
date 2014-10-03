/**
 * Holds meta data associated with each dsl node.
 */
module.exports = function(){
	'use strict';
	/**
	 * Unused nodes are reported as warnings.
	 */
	this.used = false;
	/**
	 * Origin files name of this node. Used mostly for logging.
	 */
	this.origins = [];
	
};