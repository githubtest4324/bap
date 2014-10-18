var BaseGen = require('../index').BaseGen;
var name = 'restJava';
module.exports = function () {
    'use strict';
    this.name = name;
    this.version = '0.0.1';
    this.bap;
    this.config;
    this.init = function (bap) {
        this.config = bap.config.get(name);
        this.bap = bap;
        console.log("restJava init");
    };
    this.model = function () {
        console.log("restJava model");
    };
    this.generate = function () {
        console.log("restJava generate");
    };
};
module.exports.prototype = new BaseGen();

