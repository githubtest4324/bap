var Bap = require('../../index');

var Test = function () {
    'use strict';
    var pub = {};
    pub.test1 = function () {
        var bap = new Bap(332);
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

module.exports = new Test();
