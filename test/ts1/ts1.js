var Bap = require('../../index');
var tu = require('../utils');

// initialization tests
var Ts1 = function () {
    'use strict';
    // invalid input - numeric
    this.test1 = function () {
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

    // invalid input - file does not exist
    this.test2 = function () {
        var bap = new Bap('wrong file');
        var res = bap.getLogs();
        if (false) {
            console.log(res.toString());
        }
        var testResult = res.toString() === [
            "Error[E9445]: Could not open file 'wrong file'"
        ].toString();
        return testResult;
    };

    // invalid input - file does not exist
    this.test3 = function () {
        var bap = new Bap([
                'wrong file', true
        ]);
        var res = bap.getLogs();
        if (false) {
            tu.printArray(res);
        }
        var testResult = res.toString() === [
                "Error[E9445]: Could not open file 'wrong file'", "Error[E2429]: Invalid input 'true'"
        ].toString();
        return testResult;
    };

    // invalid input - objects
    this.test4 = function () {
        var input = [
                {}, {
                    x : 'y'
                }, {
                    name : 22
                }, {
                    name : {}
                }, {
                    name : 'n1'
                }, {
                    name : 'n2',
                    dsl : ''
                }, {
                    name : 'n3',
                    dsl : {}
                }
        ];
        var bap = new Bap(input);
        var res = bap.getLogs();
        if (false) {
            console.log(res);
        }
        var testResult = res.toString() === [
                'Error[E5792] at {}: Wrong input format. Missing name.',
                'Error[E5792] at {"x":"y"}: Wrong input format. Missing name.',
                'Error[E3466] at {"name":22}: Wrong input name format. Must be text.',
                'Error[E3466] at {"name":{}}: Wrong input name format. Must be text.',
                'Error[E3012] at {"name":"n1"}: Wrong input format. Missing dsl.',
                'Error[E3012] at {"name":"n2","dsl":""}: Wrong input format. Missing dsl.'
        ].toString();
        return testResult;
    };

    // no input
    this.test5 = function () {
        var bap = new Bap();
        var res = bap.getLogs();
        if (false) {
            tu.printArray(res);
        }
        var testResult = res.toString() === [
            "Error[E5416]: No input received"
        ].toString();
        return testResult;
    };
    return this;
};

module.exports = new Ts1();
