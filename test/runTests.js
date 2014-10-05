"use strict";

var ts1 = require('./ts1/ts1');
var ts2 = require('./ts2/ts2');
var ts3 = require('./ts3-merge/ts3');

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

    console.log('============= TS2 =============');
    res = ts2.test1();
    console.log('test1: ' + passed(res));
    res = ts2.test2();
    console.log('test2: ' + passed(res));

    console.log('============= TS3 =============');
    res = ts3.test1();
    console.log('test1: ' + passed(res));
    res = ts3.test2();
    console.log('test2: ' + passed(res));
    res = ts3.test3();
    console.log('test3: ' + passed(res));
    res = ts3.test31();
    console.log('test31: ' + passed(res));
    res = ts3.test4();
    console.log('test4: ' + passed(res));
    res = ts3.test5();
    console.log('test5: ' + passed(res));
    res = ts3.test6();
    console.log('test6: ' + passed(res));
    res = ts3.test7();
    console.log('test7: ' + passed(res));
    res = ts3.test8();
    console.log('test8: ' + passed(res));
    res = ts3.test9();
    console.log('test9: ' + passed(res));
    res = ts3.test10();
    console.log('test10: ' + passed(res));
    res = ts3.test11();
    console.log('test11: ' + passed(res));
    res = ts3.test12();
    console.log('test12: ' + passed(res));
}


runTests();



