var BaseGen = require('../index').BaseGen;
var name = 'restJava';
module.exports = function () {
    'use strict';
    this.name = name;
    this.version = '0.0.1';
    this.init = function (bap) {
        this._super(bap);
        this.config = bap.config.get(name);
    };
    this.model = function () {
    };
    this.generate = function () {

    };
};
module.exports.prototype = new BaseGen();

