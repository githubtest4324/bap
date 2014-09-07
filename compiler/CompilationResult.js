module.exports = function CompilationResult () {
	'use strict';
	/**
	 * Compiled Bap object.
	 */
	this.compiled = {
		toString : function () {
			return 'root';
		}
	};
	/**
	 * List of BapWarning or BapError objects.
	 * 
	 * @type {Array}
	 */
	this.errors = [];

	this.toString = function () {
		return JSON.stringify(this.compiled, function (key, value) {
			if (key === '$parent') {
				if (value) {
					if (value.hasProp('toString')) {
						return value.toString();
					} else {
						return 'Circular reference';
					}
				} else {
					return value;
				}
			} else {
				return value;
			}
		}, 4);
	};
	this.errorsToStringArray = function(){
		var res = [];
		if (this.errors.length > 0) {
			this.errors.forEach(function (val) {
				res.push(val.toString());
			});
		}
		return res;
	};
};
