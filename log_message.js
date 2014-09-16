var su = require('./utils/string_utils');

module.exports = function LogMessage (typeParam, codeParam, messageParam, origin1Param, origin2Param) {
    'use strict';
    var pub = {}, priv = {};
    /**
     * one of 'error', 'warn', 'info', 'debug'
     */
    priv.type = typeParam;
    priv.message = messageParam || 'N/A';
    /**
     * Logging code. By convention it is a four digits random number.
     */
    priv.code = codeParam || 'N/A';
    /**
     * Message related origin.
     */
    priv.origin1 = origin1Param;
    /**
     * Message related origin.
     */
    priv.origin2 = origin2Param;

    priv.validate = function () {
        if (!(priv.type === 'error' || priv.type === 'warn' || priv.type === 'info' || priv.type === 'debug')) {
            priv.type = 'error';
        }
    };

    priv.validate();

    pub.toString = function () {
        return su.format('%s[%s] at %s: %s', su.camelCase(priv.type), priv.userCode(), priv.chainOrigin(), priv.message);
    };

    priv.chainOrigin = function () {
        var res;
        if (priv.origin1 && priv.origin2) {
            res = su.format("%s.%s", priv.origin1, priv.origin2);
        } else if (priv.origin1) {
            res = priv.origin1;
        } else if (priv.origin2) {
            res = priv.origin2;
        } else {
            res = '';
        }
        return res;
    };
    
    priv.userCode = function(){
        return su.format("%s%s", su.camelCase(priv.type), su.code);
    };

};