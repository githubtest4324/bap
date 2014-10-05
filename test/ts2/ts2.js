var Bap = require('../../index');
var fs = require('fs');

// mergeDslInput() tests
var Ts2 = function () {
    'use strict';
    // merge - success
    this.test1 = function () {
        var bap = new Bap([
                {
                    name : 'f1',
                    dsl : {
                        ns1 : {
                            a1 : 'a1',
                            ns5 : {
                                a5 : 'a4'
                            }
                        },
                        ns2 : {
                            a2 : 'a2',
                            ns4 : {
                                a4 : 'a4'
                            }
                        }
                    }
                }, {
                    name : 'f2',
                    dsl : {
                        ns1 : {
                            a2 : 'a2',
                            ns5 : {
                                a6 : 'a6'
                            },
                            ns6 : {
                                a7 : 'a7'
                            }
                        },
                        ns3 : {
                            a3 : 'a3'
                        }
                    }
                }
        ]);
        bap.generate();
        var res1 = bap.log.toStringArray();
        var res2 = bap.printMeta();
        if (false) {
            console.log(res1);
            console.log(res2);
        }
        var res2Expected = fs.readFileSync(__dirname + '/test1-expected.txt', 'utf8');
        var testResult = res1.toString() === [].toString() && res2 === res2Expected;
        return testResult;
    };
    // dsl validation - error
    this.test2 = function () {
        var bap = new Bap([
                {
                    name : 'f1',
                    dsl : {
                        type : 't1'
                    }
                }, {
                    name : 'f2',
                    dsl : {
                        type : 't2'
                    }
                }
        ]);
        bap.generate();
        var res1 = bap.log.toStringArray();
        if (false) {
            console.log(res1);
        }
        var testResult = res1.toString() === [
                'Error[E2943] at f1,f2: "type" is not allowed as top level element',
                'Error[E5763] at f1,f2.type: Only complex objects allowed as root elements.'
        ].toString();
        return testResult;
    };

    return this;
};

module.exports = new Ts2();
