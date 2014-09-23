var nodeUtils = require('util');
var StringUtils = function () {
    'use strict';
    this.pascalCase = function (s) {
        return s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
        });
    };

    this.upperCase = function (s) {
        return s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
        });
    };

    this.format = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return nodeUtils.format.apply(null, args);
    };

    this.ellipsis = function (string, max) {
        max = max || 10;
        if (string.length > max) {
            return string.substring(0, max) + '...';
        } else {
            return string;
        }
    };

    this.pretty = function (json, indentation) {
        indentation = indentation === undefined ? 4 : indentation;
        return JSON.stringify(json, null, indentation);
    };

    return this;
};

module.exports = new StringUtils();
