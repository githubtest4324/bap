var LogMessage = require('./log_message');

module.exports = function(loggerParam){
    'use strict';
    var pub = {}, priv = {};
    priv.logs = [];
    priv.logger = loggerParam || console;
    
    pub.error = function(code, message, origin1, origin2){
        priv.logs.push(new LogMessage('error', code, message, origin1, origin2));
    };
    pub.warn = function(code, message, origin1, origin2){
        priv.logs.push(new LogMessage('warn', code, message, origin1, origin2));
    };
    pub.debug = function(code, message, origin1, origin2){
        priv.logs.push(new LogMessage('debug', code, message, origin1, origin2));
    };
    pub.info = function(code, message, origin1, origin2){
        priv.logs.push(new LogMessage('info', code, message, origin1, origin2));
    };
    
    pub.pring = function(){
        priv.logs.forEach(function(logMessage){
            priv.logger.log(logMessage.toString());
        });
    };
    
    pub.toStringArray = function(){
        var res = [];
        if (priv.logs.length > 0) {
            priv.logs.forEach(function (logMessage) {
                res.push(logMessage.toString());
            });
        }
        return res;
    };
    
    return pub;
};