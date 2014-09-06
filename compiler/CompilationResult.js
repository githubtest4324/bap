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
};
