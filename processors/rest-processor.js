var WebService = require('./rest');


module.exports = {
        type : 'webService',
        processor : function (compilerParam) {
            'use strict';
            this.type = 'webService';
            this.compiler = compilerParam;
            this.compile = function (srcNode, parent) {
                srcNode.meta.used = true;
                srcNode.get('type').meta.used = true;
                if (!this._validate(srcNode, parent)) {
                    return;
                }
            };
            
            this._validate = function (srcNode, parent) {
                var valid = true;

                return valid;
            };
        }
    };
