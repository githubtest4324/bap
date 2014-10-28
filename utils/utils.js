var Utils = function () {
    'use strict';
    var sprintf = require('sprintf-js').sprintf;

    /**
     * Returns one of 'string', 'array', 'object', 'function', 'number',
     * 'boolean', 'null', 'undefined'.
     */
    this.type = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    /**
     * Generates four random digits.
     */
    this.random = function () {
        return sprintf('%04d', Math.floor(Math.random() * 9999));
    }
};

module.exports = new Utils();
