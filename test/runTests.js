"use strict";

var tests1 = require('./tests1')();

function passed(value){
	return value?'Passed':'!!!!FAILED!!!!';
}

function runTests() {
	var res = null;
	console.log('Tests1 - filter');
	res = tests1.test1();
	console.log('tests1/test1_filter: ' + passed(res));
}


runTests();



