"use strict";

var ts1 = require('./ts1/ts1');

function passed(value){
	return value?'Passed':'!!!!FAILED!!!!';
}

function runTests() {
	var res = null;
	console.log('============= TS1 =============');
    res = ts1.test1();
    console.log('test1: ' + passed(res));
    res = ts1.test2();
    console.log('test2: ' + passed(res));
    res = ts1.test3();
    console.log('test3: ' + passed(res));
    res = ts1.test4();
    console.log('test4: ' + passed(res));
    res = ts1.test5();
    console.log('test5: ' + passed(res));
}


runTests();



