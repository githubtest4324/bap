var Utils = function () {
    'use strict';
    var pub = {};

    /**
     * Returns one of 'string', 'array', 'object', 'function', 'number', 'boolean', 'null', 'undefined'.
     */
    pub.type =function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };
    
    return pub;
};

module.exports = new Utils();
