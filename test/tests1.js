"use strict";

var Bap = require('bap');

var Tests1 = function() {
	this.test1 = function(printResult) {
		var file1 = {
			type : 't1'
		};
		var file2 = {
			f2 : 't2'
		};
		var bap = new Bap([ {
			fileName : 'f1',
			content : file1
		}, {
			fileName : '',
			content : file2
		} ]);

		var res = bap.compile();
		if (printResult) {
			console.log(res.errorsToStringArray());
		}
		var testResult = res.errorsToStringArray().toString() === [ 'Error[E2943] at f1: "type" is not allowed as top level element',
		                                      'Error[E3285] at f1.type: Only objects allowed as top level elements.',
		                                      'Error[E3285] at f2: Only objects allowed as top level elements.' ].toString();
		return testResult;
	};
};

module.exports = function() {
	return new Tests1();
};
