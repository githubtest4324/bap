var utils = require('./utils/utils');

module.exports = function BapLog (typeParam, codeParam, messageParam, dslInputParam, pathParam) {
	'use strict';
	var pub = {}, priv = {};
	/**
     * one of 'error', 'warn', 'info', 'debug'
     */
	priv.type = typeParam;
	priv.message = messageParam || 'N/A';
	/**
	 * Logging code. By convention it is a four digits random number.
	 */
	priv.code = codeParam || 'N/A';
	/**
	 * Name of dsl input generating this log.
	 */
	priv.dslInput = dslInputParam || 'N/A';
	/**
	 * Path within dsl input.
	 */
	priv.path = pathParam || 'N/A';
	
	priv.validate = function(){
	    if(!(priv.type==='error' || priv.type==='warn' || priv.type==='info' ||priv.type==='debug')){
	        priv.type = 'error';
	    }
	};
	
	priv.validate();
	
	pub.toString = function () {
		var dslInputId = utils.logFieldIdentifier(priv.path, priv.dslInput);
		return 'Error[{0}{1}] at {2}: {3}'.format(priv.type, priv.code, dslInputId, this.message);
	};
};