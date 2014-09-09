"use strict";

var Bap = require('bap');
var CompilationResult = require('../compiler/CompilationResult');
var fs = require('fs');

var Tests1 = function () {
    // utils.logFieldIdentifier()
    this.test1 = function (printResult) {
        var file1 = {
            type : 't1'
        };
        var file2 = {
            f2 : 't2'
        };
        var bap = new Bap([
                {
                    fileName : 'f1',
                    content : file1
                }, {
                    fileName : '',
                    content : file2
                }
        ]);

        var res = bap.compile();
        if (printResult) {
            console.log(res.errorsToStringArray());
        }
        var testResult = res.errorsToStringArray().toString() === [
                'Error[E2943] at f1: "type" is not allowed as top level element',
                'Error[E5763] at f1.type: Only complex objects allowed as root elements.',
                'Error[E5763] at f2: Only complex objects allowed as root elements.'
        ].toString();
        return testResult;
    };
    // comments
    this.test2 = function (printResult) {
        var file1 = {
            ns1 : {
                ns2 : {
                    '//p1' : 'v1',
                    '//ns3' : {
                        p2 : 'v2',
                        '//p3' : {
                            p4 : 'v4'
                        }
                    }
                }
            }
        };
        var bap = new Bap([
            {
                fileName : 'f1',
                content : file1
            }
        ]);

        var res = bap.compile();
        if (printResult) {
            console.log(res.toString());
            console.log(res.errorsToStringArray());
        }
        var correct = new CompilationResult();
        correct.compiled = {
            "ns1" : {
                "$type" : "namespace",
                "$isDefault" : false,
                "$namespace" : "ns1",
                "$name" : "ns1",
                "$parent" : "root",
                "ns2" : {
                    "$type" : "namespace",
                    "$isDefault" : false,
                    "$namespace" : "ns1.ns2",
                    "$name" : "ns2",
                    "$parent" : "Namespace: ns1"
                }
            }
        };
        var expected = fs.readFileSync('tests1-test2-expected.json', 'utf8');
        var testResult = res.errors.length === 0 && res.toString() === expected;
        return testResult;
    };
    // merge multiple files
    this.test3 = function () {
        var file1 = require('./tests1-test3-input-f1');
        var file2 = require('./tests1-test3-input-f2');
        var bap = new Bap([
                {
                    fileName : 'f1',
                    content : file1
                }, {
                    fileName : 'f2',
                    content : file2
                }
        ]);

        var res = bap.compile();
        if (false) {
            console.log(res.toString());
            console.log(res.errorsToStringArray());
        }
        var expected = fs.readFileSync('tests1-test3-expected.json', 'utf8');
        var testResult = res.toString() === expected &&
                res.errorsToStringArray().toString() === [
                        'Error[E9738] at f2.ns1.ns2.e1: Duplicated entity.',
                        'Error[E9738] at f2.ns1.e2: Duplicated entity.',
                        'Error[E9738] at f2.e3: Duplicated entity.',
                        'Warning[W2430] at f2.ns1.ns2.e1.properties: Unused node',
                        'Warning[W2430] at f2.ns1.e2.properties: Unused node',
                        'Warning[W2430] at f2.e3.properties: Unused node'
                ].toString();
        return testResult;
    };

    // compile entities inline
    this.test4 = function () {
        var bap = new Bap([
            {
                fileName : 'f1',
                content : require('./tests1-test4-input')
            }
        ]);

        var res = bap.compile();
        if (false) {
            console.log(res.toString());
            console.log(res.errorsToStringArray());
        }
        var expected = fs.readFileSync('tests1-test4-expected.json', 'utf8');
        var testResult = res.toString() === expected &&
                res.errorsToStringArray().toString() === [
                        'Error[E9738] at f1.ns1.e1.properties.f5.properties.f55: Duplicated entity.',
                        'Warning[W2430] at f1.ns1.e1.properties.f5.properties.f55.properties: Unused node'
                ].toString();
        return testResult;
    };

};

module.exports = function () {
    return new Tests1();
};
