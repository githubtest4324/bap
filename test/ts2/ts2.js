var Bap = require('../../index');

// mergeDslInput() tests
var Ts2 = function () {
    'use strict';
    var pub = {};
    // invalid dsl
    pub.test1 = function () {
        var bap = new Bap({
            name : 'f1',
            dsl : {}
        });
        var res = bap.getLogs();
        if (false) {
            console.log(res.toString());
        }
        var testResult = res.toString() === [
            "Error[E2429]: Invalid input '332'"
        ].toString();
        return testResult;
    };
    return pub;
};

module.exports = new Ts2();
