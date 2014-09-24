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

    return this;
};

module.exports = new Ts3();
