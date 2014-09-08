"use strict";

var Bap = require('bap');
var CompilationResult = require('../compiler/CompilationResult');
var fs = require('fs');

var Tests1 = function () {
	// utils.logFieldIdentifier()
	this.test1 = function (printResult) {
		var file1 = {
			type : 't1'
		};
		var file2 = {
			f2 : 't2'
		};
		var bap = new Bap([
				{
					fileName : 'f1',
					content : file1
				}, {
					fileName : '',
					content : file2
				}
		]);

		var res = bap.compile();
		if (printResult) {
			console.log(res.errorsToStringArray());
		}
		var testResult = res.errorsToStringArray().toString() === [
				'Error[E2943] at f1: "type" is not allowed as top level element',
				'Error[E5763] at f1.type: Only complex objects allowed as root elements.',
				'Error[E5763] at f2: Only complex objects allowed as root elements.'
		].toString();
		return testResult;
	};
	// comments
	this.test2 = function (printResult) {
		var file1 = {
			ns1 : {
				ns2 : {
					'//p1' : 'v1',
					'//ns3' : {
						p2 : 'v2',
						'//p3' : {
							p4 : 'v4'
						}
					}
				}
			}
		};
		var bap = new Bap([
			{
				fileName : 'f1',
				content : file1
			}
		]);

		var res = bap.compile();
		if (printResult) {
			console.log(res.toString());
			console.log(res.errorsToStringArray());
		}
		var correct = new CompilationResult();
		correct.compiled = {
			"ns1" : {
				"$type" : "namespace",
				"$isDefault" : false,
				"$namespace" : "ns1",
				"$name" : "ns1",
				"$parent" : "root",
				"ns2" : {
					"$type" : "namespace",
					"$isDefault" : false,
					"$namespace" : "ns1.ns2",
					"$name" : "ns2",
					"$parent" : "Namespace: ns1"
				}
			}
		};
		var expected = fs.readFileSync('tests1-test2-expected.json', 'utf8');
		var testResult = res.errors.length === 0 && res.toString() === expected;
		return testResult;
	};
	// merge multiple files
	this.test3 = function () {
		var file1 = {
			ns1 : {
				ns2 : {
					e1 : {
						type : 'entity',
						properties : {
							f1 : 'str'
						}
					}
				},
				e2 : {
					type : 'entity',
					properties : {
						f2 : 'str'
					}
				}
			},
			e3 : {
				type : 'entity',
				properties : {
					f3 : 'str'
				}
			}
		};
		var file2 = {
			ns1 : {
				ns2 : {
					e1 : {
						type : 'entity',
						properties : {
							f12 : 'str'
						}
					},
					e4 : {
						type : 'entity',
						properties : {
							f4 : 'str'
						}
					}
				},
				ns3 : {
					e5 : {
						type : 'entity',
						properties : {
							f5 : 'str'
						}
					},
				},
				e2 : {
					type : 'entity',
					properties : {
						f22 : 'str'
					}
				}
			},
			e3 : {
				type : 'entity',
				properties : {
					f32 : 'str'
				}
			},
			e6 : {
				type : 'entity',
				properties : {
					f6 : 'str'
				}
			},
		};
		var bap = new Bap([
				{
					fileName : 'f1',
					content : file1
				}, {
					fileName : 'f2',
					content : file2
				}
		]);

		var res = bap.compile();
		if (false) {
			console.log(res.toString());
			console.log(res.errorsToStringArray());
		}
		var correct = new CompilationResult();
		correct.compiled = {
			"ns1" : {
				"$type" : "namespace",
				"$isDefault" : false,
				"$namespace" : "ns1",
				"$name" : "ns1",
				"$parent" : "root",
				"ns2" : {
					"$type" : "namespace",
					"$isDefault" : false,
					"$namespace" : "ns1.ns2",
					"$name" : "ns2",
					"$parent" : "Namespace: ns1"
				}
			}
		};
		var expected = fs.readFileSync('tests1-test3-expected.json', 'utf8');
		var testResult = res.toString() === expected
				&& res.errorsToStringArray().toString() === [
						'Error[E9738] at f2.ns1.ns2.e1: Duplicated entity.',
						'Error[E9738] at f2.ns1.e2: Duplicated entity.',
						'Error[E9738] at f2.e3: Duplicated entity.'
				].toString();
		return testResult;
	};
};

module.exports = function () {
	return new Tests1();
};
