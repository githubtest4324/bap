var Bap = require('../../index').Bap;
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
        var testResult = res1.toString() === [
            'Warn[W3846] at : No generators defined.'
        ].toString() && res2 === res2Expected;
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
    // model generation
    this.test3 = function () {
        var bap = new Bap(require('./test3-input'));
        bap.generate();
        var res1 = bap.log.toStringArray();
        var res2 = bap.printModel();
        if (false) {
            console.log(res1);
            console.log(res2);
        }
        var res2Expected = fs.readFileSync(__dirname + '/test3-expected.txt', 'utf8');
        var testResult1 = res1.toString() === [
                'Warn[W3846] at : No generators defined.', 'Warn[W4399] at f1.ns1.E2: No suitable type or properties found to build a model'
        ].toString();

        var testResult2 = res2 === res2Expected;
        return testResult1 && testResult2;
    };

    // model generation
    this.test4 = function () {
        var bap = new Bap([
            {
                name : 'f1',
                dsl : {
                    ns1 : {
                        E1 : {
                            model : true,
                            type : 'entity',
                            properties : {
                                p2 : 'E1',
                                p3 : 'ns1.E1'

                            }
                        }
                    },
                    ns2 : {
                        E1 : {
                            model : true,
                            type : 'entity',
                            properties : {
                                p2 : 'E1',
                                p3 : 'ns2.E1'

                            }
                        }
                    }

                }
            }
        ]);
        bap.generate();
        var res1 = bap.log.toStringArray();
        if (false) {
            console.log(res1);
        }
        return res1.toString() === [
                'Warn[W3846] at : No generators defined.',
                'Error[E9507] at f1.ns1.E1.properties.p2: Ambiguous type E1. Pick from ns1.E1,ns2.E1',
                'Error[E9507] at f1.ns2.E1.properties.p2: Ambiguous type E1. Pick from ns1.E1,ns2.E1'
        ].toString();
    };

    return this;
};

module.exports = new Ts2();
