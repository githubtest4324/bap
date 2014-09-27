var merge = require('../../utils/merge');

// initialization tests
var Ts3 = function () {
    'use strict';
    // objects are recursively merged
    this.test1 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1',
                b2 : {
                    c1 : 'c1',
                    c2 : 'c2'
                }
            },
            a2 : 'a2',
            a3 : 'a3'
        };
        var d2 = {
            a1 : {
                b2 : {
                    c3 : {
                        d4 : 'd4'
                    }
                },
                b3 : {
                    c1 : 'c1'
                }
            },
            a4 : 'a4'
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "b1" : "b1",
                "b2" : {
                    "c1" : "c1",
                    "c2" : "c2",
                    "c3" : {
                        "d4" : "d4"
                    }
                },
                "b3" : {
                    "c1" : "c1"
                }
            },
            "a2" : "a2",
            "a3" : "a3",
            "a4" : "a4"
        });
        return testResult;
    };

    // arrays are concatenated
    this.test2 = function () {
        var d1 = {
            a1 : [
                    'b1', 'b2'
            ]
        };
        var d2 = {
            a1 : [
                    'b3', 'b4'
            ],
            a2 : [
                    'b1', 'b2'
            ]
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : [
                    "b1", "b2", "b3", "b4"
            ],
            "a2" : [
                    "b1", "b2"
            ]
        });
        return testResult;
    };
    // null is always overridden
    this.test3 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1'
            },
            a2 : 'a2',
            a3 : 3,
            a4 : true,
            a5 : null,
            a6 : [],
            a7 : null,
            a8 : null,
            a9 : null,
            a10 : null,
            a11 : null,
            a12 : null,
            a13 : null,
        };
        var d2 = {
            a1 : null,
            a2 : null,
            a3 : null,
            a4 : null,
            a5 : null,
            a6 : null,
            a7 : {
                b1 : 'b1'
            },
            a8 : 'a2',
            a9 : 3,
            a10 : true,
            a11 : [],
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "b1" : "b1"
            },
            "a2" : "a2",
            "a3" : 3,
            "a4" : true,
            "a5" : null,
            "a6" : [],
            "a7" : {
                "b1" : "b1"
            },
            "a8" : "a2",
            "a9" : 3,
            "a10" : true,
            "a11" : [],
            "a12" : null,
            "a13" : null
        });
        return testResult;
    };
    // null is always overridden
    this.test31 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1'
            },
            a12 : null,
            a13 : null,
        };
        var d2 = {
            a1 : null,
            a14 : null,
            a15 : null
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "b1" : "b1"
            },
            "a12" : null,
            "a13" : null,
            "a14" : null,
            "a15" : null
        });
        return testResult;
    };
    // scalars override each other
    this.test4 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1',
                c1 : {
                    d1 : 3,
                    e1 : {
                        f1 : true
                    }
                }
            },
            a2 : 'a2',
            a3 : 3,
            a4 : true
        };
        var d2 = {
            a1 : {
                b1 : 'b2',
                c1 : {
                    d1 : 4,
                    e1 : {
                        f1 : false
                    }
                }
            },
            a2 : 'a3',
            a3 : 4,
            a4 : false
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "b1" : "b2",
                "c1" : {
                    "d1" : 4,
                    "e1" : {
                        "f1" : false
                    }
                }
            },
            "a2" : "a3",
            "a3" : 4,
            "a4" : false
        });
        return testResult;
    };

    // scalar and arrays override each other
    this.test5 = function () {
        var d1 = {
            a1 : 3,
            a2 : []
        };
        var d2 = {
            a1 : [],
            a2 : 'a2'
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : [],
            "a2" : "a2"
        });
        return testResult;
    };

    // objects and arrays override each other
    this.test6 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1'
            },
            a2 : [
                    1, 2
            ]
        };
        var d2 = {
            a1 : [
                    3, 4
            ],
            a2 : {
                c1 : 'c1'
            }
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : [
                    3, 4
            ],
            "a2" : {
                "c1" : "c1"
            }
        });
        return testResult;
    };

    // scalar and objects override each other
    this.test7 = function () {
        var d1 = {
            a1 : {
                b1 : 'b1'
            },
            a2 : 'a2'
        };
        var d2 = {
            a1 : 'a1',
            a2 : {
                c1 : 'c1'
            }
        };
        var res = merge(d1, d2);

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : "a1",
            "a2" : {
                "c1" : "c1"
            }
        });
        return testResult;
    };

    // callback
    this.test8 = function () {
        var d1 = {
            a1 : 10,
            b1 : {
                c1 : 100
            },
            c1 : 30
        };
        var d2 = {
            a1 : 20,
            b1 : {
                c1 : 30,
                c2 : 15
            },
            c1 : 60,
            d1 : 30
        };
        var res = merge(d1, d2, function (context) {
            if (context.conflict && context.src.type() === 'number' && context.dst.type() === 'number') {
                context.update(context.dst.value + context.src.value);
            } else {
                context.useDefault();
            }
        });

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : 30,
            "b1" : {
                "c1" : 130,
                "c2" : 15
            },
            "c1" : 90,
            "d1" : 30
        });
        return testResult;
    };
    // callback - conflict
    this.test8 = function () {
        var d1 = {
            a1 : 1,
            a2 : 1,
            a3 : {
                a4 : 'a'
            },
            a5 : {
                a6 : 'a',
                a8 : 2
            },
        };
        var d2 = {
            a1 : {
                a2 : 1
            },
            a2 : 2,
            a3 : 4,
            a5 : {
                a6 : 'b',
                a7 : 'c'
            }
        };
        var res = merge(d1, d2, function (context) {
            if (context.conflict && context.src.hasType('number', 'string', 'boolean')) {
                context.update('conflict');
            } else {
                context.useDefault();
            }
        });

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "a2" : 1
            },
            "a2" : "conflict",
            "a3" : "conflict",
            "a5" : {
                "a6" : "conflict",
                "a8" : 2,
                "a7" : "c"
            }
        });
        return testResult;
    };

    // callback - primitives
    this.test9 = function () {
        var d1 = {
            a1 : 1,
            a2 : 1,
            a3 : {
                a4 : 'a'
            },
            a5 : {
                a6 : 'a',
                a8 : 2,
                a10 : 5
            },
        };
        var d2 = {
            a1 : {
                a2 : 1
            },
            a2 : 2,
            a3 : 4,
            a5 : {
                a6 : 'b',
                a7 : 'c',
                a9 : 5,
                a10 : 8
            }
        };

        var res = merge(d1, d2, function (context) {
            if (context.conflict && context.src.type() === 'number' && context.dst.type() === 'number') {
                context.update(context.dst.value + context.src.value);
            } else if (!context.conflict && context.src.type() === 'number') {
                context.update(0);
            } else {
                context.useDefault();
            }
        });

        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "a2" : 0
            },
            "a2" : 3,
            "a3" : 4,
            "a5" : {
                "a6" : "b",
                "a8" : 2,
                "a10" : 13,
                "a7" : "c",
                "a9" : 0
            }
        });
        return testResult;
    };

    // callback - primitives conflicts
    this.test10 = function () {
        var d1 = {
            a1 : {
                a2 : {
                    a3 : 3
                },
                a3 : 4,
                a5 : {
                    a6 : 6
                }
            },
            a2 : 3,
            a3 : {},
            a4 : {},
            a5 : null,
            a6 : true,
            a7 : 'a',
            a8 : 6
        };
        var d2 = {
            a1 : {
                a2 : {
                    a3 : 3
                },
                a3 : 4,
                a5 : {
                    a6 : 6
                }
            },
            a2 : {},
            a3 : 3,
            a4 : {},
            a5 : 'a',
            a6 : null,
            a7 : 5,
            a8 : 'b'
        };

        var res = merge(d1, d2, function (context) {
            if (context.conflict && context.src.type() !== 'object' && context.dst.type() !== 'object') {
                context.update('conflict');
            } else {
                context.useDefault();
            }
        });
        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : {
                "a2" : {
                    "a3" : "conflict"
                },
                "a3" : "conflict",
                "a5" : {
                    "a6" : "conflict"
                }
            },
            "a2" : {},
            "a3" : 3,
            "a4" : {},
            "a5" : "conflict",
            "a6" : "conflict",
            "a7" : "conflict",
            "a8" : "conflict"
        });
        return testResult;
    };
    // callback - arrays
    this.test11 = function () {
        var d1 = {
            a1 : [
                    3, 4
            ],
            a2 : {
                a3 : 5,
                a4 : [
                        1, 3
                ],
                a5 : [
                        4, 3
                ],
                a6 : {
                    a7 : 1,
                    a8 : 3,
                    a9 : 5
                }
            },
            a8 : 5,
            a9 : [
                    1, 2
            ]
        };
        var d2 = {
            a1 : 2,
            a2 : {
                a3 : 4,
                a4 : 8,
                a6 : {
                    a7 : [
                        2
                    ],
                    a8 : [],
                    a9 : {}
                }
            },
            a9 : 'a'
        };

        var res = merge(d1, d2, function (context) {
            if (context.conflict && context.src.hasType('number', 'array') && context.dst.hasType('number', 'array')) {
                var arr1 = context.src.type() === 'array' ? context.src.value : [
                    context.src.value
                ];
                var arr2 = context.dst.type() === 'array' ? context.dst.value : [
                    context.dst.value
                ];
                var sum = 0;
                var val;
                for (var i = 0; i < arr1.length; i++) {
                    val = arr1[i];
                    if (typeof val === 'number') {
                        sum += val;
                    }
                }
                for (i = 0; i < arr2.length; i++) {
                    val = arr2[i];
                    if (typeof val === 'number') {
                        sum += val;
                    }
                }
                context.update(sum);
            } else {
                context.useDefault();
            }
        });
        if (false) {
            console.log(JSON.stringify(res.value, null, 4));
        }
        var testResult = JSON.stringify(res.value) === JSON.stringify({
            "a1" : 9,
            "a2" : {
                "a3" : 9,
                "a4" : 12,
                "a5" : [
                        4, 3
                ],
                "a6" : {
                    "a7" : 3,
                    "a8" : 3,
                    "a9" : {}
                }
            },
            "a8" : 5,
            "a9" : "a"
        });
        return testResult;
    };

    return this;
};

module.exports = new Ts3();
