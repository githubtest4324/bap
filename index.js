module.exports = function (loggerParam) {
    'use strict';

    var Log = require('./log');
    var fsPath = require('path');
    var fs = require('fs');
    var Jef = require('json-easy-filter');
    var su = require('./utils/string-utils');

    var DslInput = function () {
        var pub = {};
        pub.filePath = undefined;
        pub.fileName = undefined;
        pub.content = undefined;
        return pub;
    };

    
    var pub = {}, priv = {};
    priv.logger = loggerParam || console;
    priv.log = new Log(priv.logger);
    /**
     * Holds input files as DslInput objects.
     */
    priv.dslInput = [];


    pub.generate = function (dslInputParam, logger) {
        priv.logger = logger || console;

        priv.parseInput(dslInputParam);
    };

    priv.parseInput = function (dslInputParam) {
        if (dslInputParam.typeOf() !== 'array') {
            dslInputParam = [
                dslInputParam
            ];
        }

        dslInputParam.forEach(function (item) {
            var input = new DslInput();
            if (item.typeOf() === 'string') {
                // file path
                var filePath = fsPath.normalize(item);
                input.filePath = fsPath.dirname(filePath);
                input.fileName = fsPath.basename(filePath);
                try{
                    input.content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    priv.dslInput.push(input);
                } catch(error){
                    priv.log.error(9445, su.format("Could not open file '%s'", filePath));
                }
            } else if(item.typeOf()==='object'){
                // content
                if(priv.validateInputContent(item)){
                    input.fileName = item.name;
                    input.content = item.content;
                    priv.dslInput.push(input);
                }
            }
        });
    };
    
    /**
     * Allowed format: {name: '', dsl: {}}
     */
    priv.validateInputContent = function(input){
        return new Jef(input).validate(function(node){
            if(!node.has('name')){
                priv.log.error(5792, 'Wrong input format. Missing file name.');
                return false;
            }
            if(node.get('name').getType()!=='string'){
                priv.log.error(3466, 'Wrong input file name format.');
                return false;
            }
            if(!node.has('dsl')){
                priv.log.error(3012, 'Wrong input format. Missing dsl.');
                return false;
            }
            if(node.get('dsl').getType()!=='object'){
                priv.log.error(2980, 'Wrong input format. Dsl must be an object.');
                return false;
            }
            
        });
    };

    return pub;
};

