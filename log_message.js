var su = require('./utils/string');

/**
 * Generic log message.
 * @param type One of 'error', 'warn', 'info', 'debug'
 * @param code Log message unique identificator. By convention it is a four digits random number.
 * @param origin1 Helps user understand where problem has occurred.
 * @param origin2 Helps user understand where problem has occurred. Will be concatenated with origin1 if present.
 */
module.exports = function(type, code, message, origin1, origin2) {
    'use strict';

    var validate = function () {
        if (!(type === 'error' || type === 'warn' || type === 'info' || type === 'debug')) {
            type = 'error';
        }
    };


    this.toString = function () {
        var origin = chainOrigin();
        if(origin){
            return su.format('%s[%s] at %s: %s', su.pascalCase(type), userCode(), origin, message);
        } else{
            return su.format('%s[%s]: %s', su.pascalCase(type), userCode(), message);
        }
    };

    var chainOrigin = function () {
        var res;
        if (origin1 && origin2) {
            res = su.format("%s.%s", origin1, origin2);
        } else if (origin1) {
            res = origin1;
        } else if (origin2) {
            res = origin2;
        } else {
            res = '';
        }
        return res;
    };
    
    var userCode = function(){
        var typeStr = type? type.charAt(0).toUpperCase(): '';
        return su.format("%s%s", typeStr, code);
    };
  
    // Constructor
    message = message || 'N/A';
    code = code || 'N/A';
    validate();
  
    return this;

};