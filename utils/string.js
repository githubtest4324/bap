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

    pub.ellipsis = function (string, max) {
        max = max || 10;
        if (string.length > max) {
            return string.substring(0, max) + '...';
        } else {
            return string;
        }
    };

    pub.pretty = function (json, indentation) {
        indentation = indentation || 0;
        return JSON.stringify(json, null, indentation);
    };

    return pub;
};

module.exports = new StringUtils();
