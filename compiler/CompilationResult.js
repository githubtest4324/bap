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
	this.output = [];

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
	this.errorsToString = function(){
		var res = '';
		if (this.output.length > 0) {
			this.output.forEach(function (val) {
				res+=val.toString();
			});
		}
		return res;
	};
	this.errorsToStringArray = function(){
		var res = [];
		if (this.output.length > 0) {
			this.output.forEach(function (val) {
				res.push(val.toString());
			});
		}
		return res;
	};
};
