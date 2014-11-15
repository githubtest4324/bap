var Bap = require('../../index').Bap;
var fs = require('fs');
var path = require('path');
var su = require('../../utils/string');
var ndd = require('node-dir-diff');

// mergeDslInput() tests
var Ts4 = function () {
    'use strict';
    this.test1 = function () {
        var expectedDir = path.join(__dirname, 'expected/src/java/');
        var genDir = path.join(__dirname, 'gen/src/java/');
        var bap = new Bap([
            {
                name : 'f1',
                dsl : {
                    config : {
                        generators : [
                            'entityJava'
                        ],
                        entityJava : {
                            sourceDir : genDir
                        }
                    },
                    ns1 : {
                        E1 : {
                            model : true,
                            type : 'entity',
                            properties : {
                                p1 : 'str',
                                p2 : {
                                    properties : {
                                        p2_1 : 'str'
                                    }
                                },
                                p3 : '[int]',
                                p4 : {
                                    type : 'str'
                                },
                                p5 : {
                                    type : '[int]'
                                },
                                p6 : {
                                    name : 'E3',
                                    properties : {
                                        p3 : 'str'
                                    }
                                },
                                p7 : {
                                    type : {
                                        name : 'E4',
                                        properties : {
                                            p7_E4 : 'str'
                                        }
                                    }
                                },
                                p8 : {
                                    type : {
                                        properties : {
                                            p8_p1 : 'str'
                                        }
                                    }
                                },
                                p9 : {
                                    type : {
                                        list : {
                                            name : 'E5',
                                            properties : {
                                                p1 : 'str'
                                            }
                                        }
                                    }

                                },
                                p10 : {
                                    type : {
                                        list : {
                                            properties : {
                                                p1 : 'str'
                                            }
                                        }
                                    }

                                },
                                p11 : {
                                    list : {
                                        name : 'E6',
                                        properties : {
                                            p1 : 'str'
                                        }
                                    }
                                },
                            }
                        },
                        Rest1 : {
                            type : 'rest',
                            input : {
                                model : true,
                                name : 'Rest1Request',
                                type : '[E1]',
                            },
                            output : {
                                model : true,
                                type : 'str'
                            }
                        },
                        Rest2 : {
                            type : 'rest',
                            input : {
                                model : true,
                                properties : {
                                    p4 : '[E1]',
                                    p5 : 'str'
                                }
                            },
                            output : {
                                model : true,
                                type : '[str]'
                            }
                        },
                        Page1 : {
                            type : 'page',
                            model : {
                                model : true,
                                properties : {
                                    p5 : 'str',
                                    p6 : {
                                        properties : {
                                            p7 : 'E1',
                                            p8 : 'str'
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        ]);
        bap.generate();
        var res1 = bap.log.toStringArray();
        var res2 = 0;
        var dd = new ndd.Dir_Diff([
                expectedDir, genDir
        ], 'size');
        aici: sa folosesc https://www.npmjs.org/package/node-dir
        dd.compare(function (err, result) {
            res2 += result.deviation;
        });
        if (true) {
            console.log(res1);
            console.log(res2);
        }
        var testResult = res1.toString() === [
            'Warn[W3846] at : No generators defined.'
        ].toString() && res2 === 0;
        return testResult;
    }
};

module.exports = new Ts4();
