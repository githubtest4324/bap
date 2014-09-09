"use strict";

var tests1 = require('./tests1')();

function passed(value){
	return value?'Passed':'!!!!FAILED!!!!';
}

function runTests() {
	var res = null;
	console.log('Tests1 - filter');
	res = tests1.test1();
	console.log('tests1/test1: ' + passed(res));
	res = tests1.test2();
	console.log('tests1/test2: ' + passed(res));
    res = tests1.test3();
    console.log('tests1/test3: ' + passed(res));
    res = tests1.test4();
    console.log('tests1/test3: ' + passed(res));
}


runTests();



