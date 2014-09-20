var LogMessage = require('./log_message');

module.exports = function(loggerParam){
    'use strict';
    var logs = [];
    var logger = loggerParam || console;
    
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
    
    this.print = function(){
        logs.forEach(function(logMessage){
            logger.log(logMessage.toString());
        });
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