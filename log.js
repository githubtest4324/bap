var LogMessage = require('./log_message');

module.exports = function(){
    'use strict';
    var logs = [];
    
    this.error = function(code, message, origin1, origin2){
        logs.push(new LogMessage('error', code, message, origin1, origin2));
    };
    this.warn = function(code, message, origin1, origin2){
        logs.push(new LogMessage('warn', code, message, origin1, origin2));
    };
    this.debug = function(code, message, origin1, origin2){
        logs.push(new LogMessage('debug', code, message, origin1, origin2));
    };
    this.info = function(code, message, origin1, origin2){
        logs.push(new LogMessage('info', code, message, origin1, origin2));
    };
    
    this.toStringArray = function(){
        var res = [];
        if (logs.length > 0) {
            logs.forEach(function (logMessage) {
                res.push(logMessage.toString());
            });
        }
        return res;
    };
    
    return this;
};