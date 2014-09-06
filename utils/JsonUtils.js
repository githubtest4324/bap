module.exports = {
	/**
	 * Receives a path array and converts it to string.
	 */
	pathToString : function (path) {
		'use strict';
		var delimiter = '.';
		var res = '';
		for (var i = 0; i < path.length; i++) {
			if (i !== 0) {
				res += delimiter;
			}
			res += path[i];
		}
		return res;
	}
};