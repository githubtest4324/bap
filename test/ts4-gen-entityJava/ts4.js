var Bap = require('../../index').Bap;
var fs = require('fs');
var path = require('path');
var su = require('../../utils/string');
var dircompare = require('dir-compare');

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
        var res2 = dircompare.compareSync(expectedDir, genDir, {
            compareContent : true
        });
        if (true) {
//            console.log(res1);
//            console.log(res2.same);
        }
        var testResult = res1.toString() === [
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E1.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E1p2.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E3.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E4.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E1type.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E5.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E1list.java',
                'Info[I3836]: Generated /home/liviu/git/bap/test/ts4-gen-entityJava/gen/src/java/ns1/E6.java'
        ].toString() &&
                res2.same === true;
        return testResult;
    }
};

module.exports = new Ts4();
