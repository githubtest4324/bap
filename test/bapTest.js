
var Bap = require('../index');
require('../compiler/compilers/NamespaceCompiler');
require('../compiler/compilers/EntityCompiler');
require('../BapError');

var bap1 = require('./bap1');
var bap2 = require('./bap2');
var compiler = new Bap([{fileName: "bap1", content: bap1}, {fileName: "bap2", content: bap2}]);
var result = compiler.compile();

console.log(result.toString());

if (result.output.length > 0) {
	result.output.forEach(function (val) {
		'use strict';
		console.log(val.toString());
	});
}
