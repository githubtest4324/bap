var nodeUtils = require('util');
var StringUtils = function () {
    'use strict';
    var pub = {};
    pub.pascalCase = function (s) {
        return s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
        });
    };

    pub.upperCase = function (s) {
        return s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
        });
    };

    pub.format = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return nodeUtils.format.apply(null, args);
    };

    return pub;
};

module.exports = new StringUtils();
