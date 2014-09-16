"use strict";

var ts1 = require('./ts1/test');

function passed(value){
	return value?'Passed':'!!!!FAILED!!!!';
}

function runTests() {
	var res = null;
	console.log('============= TS1 =============');
	res = ts1.test1();
	console.log('test1: ' + passed(res));
}


runTests();



