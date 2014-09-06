var internalJsType = {
	STRING : 'string',
	ARRAY : 'array',
	OBJECT : 'object',
	FUNCTION : 'function',
	UNDEFINED : 'undefined',
	NUMBER : 'number',
	NULL : 'null',
	/**
	 * Returns the javascript type of an object.
	 * 
	 * @param obj
	 * @returns {string}
	 */
	get : function (obj) {
		'use strict';
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	},

	installPrototypeHas : function () {
		'use strict';
		Object.defineProperty(Object.prototype, 'hasProp', {
			enumerable : false,
			value : function (property) {
				return (this.hasOwnProperty(property));
			}
		});
	},
	installPrototypeTypeOf : function () {
		'use strict';
		Object.defineProperty(Object.prototype, 'typeOf', {
			enumerable : false,
			value : function () {
				return internalJsType.get(this);
			}
		});
	}

};

module.exports = internalJsType;
