var nodeUtils = require('utils');
var StringUtils = function () {
    'use strict';
    var pub = {};
    pub.camelCase = function (input) {
        return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    };
    
    pub.format = function(){
        var args = Array.prototype.slice.call(arguments, 0);
        return nodeUtils.format.apply(null, args);
    };
    

    return pub;
};

module.exports = new StringUtils();
