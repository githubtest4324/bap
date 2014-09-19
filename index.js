module.exports = function (dslInputParam, loggerParam) {
    'use strict';

    var Log = require('./log');
    var fsPath = require('path');
    var fs = require('fs');
    var Jef = require('json-easy-filter');
    var su = require('./utils/string');
    var u = require('./utils/utils');
    var Merge = require('./merge_dsl');

    var DslInput = function () {
        this.filePath = undefined;
        this.fileName = undefined;
        this.dsl = undefined;
        return this;
    };

    var priv = {};
    var logger = loggerParam || console;
    var log = new Log(priv.logger);
    /**
     * Holds input files as DslInput objects.
     */
    var dslInput = [];
    var config = undefined;
    var dsl = {};
    
    
    this.generate = function (logger) {
        logger = logger || console;
        mergeDslInput();
        
        console.log(su.pretty(dsl));
    };
    this.getLogs = function () {
        return log.toStringArray();
    };
    this.printLogs = function () {
        log.print();
    };

    /**
     * Populates dsl with sections received in dslInput.
     */
    var mergeDslInput = function(){
        dslInput.forEach(function(input){
            if(validateInput(input)){
                var merge = new Merge(dsl, input);
                merge.merge();
                dsl = new Jef(dsl.value); // Refresh metadata
            }
        });
    };
    
    /**
     * Validates the root of each individual input file.
     */
    var validateInput = function (input) {
        var root = input.dsl.value;
        var res = true;

        // ignore empty dsl
        if(input.dsl.isEmpty()){
            return true;
        }
        
        // 'type' not allowed as root element.
        if (root.type) {
            log.error(2943, '"type" is not allowed as top level element', input.fileName);
            res = false;
        }

        // only objects allowed as direct children
        var that = this;
        var onlyChildObjects = input.dsl.validate(function (node) {
            var valid = true;
            if (node.level === 1) {
                if (node.type() !== 'object') {
                    valid = false;
                    that.error(5763, "Only complex objects allowed as root elements.", input.fileName, node.path);
                }
            }
            return valid;
        });
        if (!onlyChildObjects) {
            res = false;
        }

        return res;
    };

    
    var parseInput = function (dslInputParam) {
        if(!dslInputParam){
            log.error(5416, su.format("No input received"));
            return;
        }
        if (u.type(dslInputParam) !== 'array') {
            dslInputParam = [
                dslInputParam
            ];
        }

        dslInputParam.forEach(function (item) {
            var input = new DslInput();
            if (u.type(item) === 'string') {
                // file path
                var filePath = fsPath.normalize(item);
                input.filePath = fsPath.dirname(filePath);
                input.fileName = fsPath.basename(filePath);
                try {
                    input.dsl = new Jef(JSON.parse(fs.readFileSync(filePath, 'utf8')));
                    dslInput.push(input);
                } catch (error) {
                    log.error(9445, su.format("Could not open file '%s'", filePath));
                }
            } else if (u.type(item) === 'object') {
                // dsl
                if (validateInputContent(item)) {
                    input.fileName = item.name;
                    input.dsl = new Jef(JSON.parse(JSON.stringify(item.dsl)));
                    removeComments(input.dsl);
                    dslInput.push(input);
                }
            } else {
                log.error(2429, su.format("Invalid input '%s'", item));
            }
        });
    };
    
    /**
     * Everything starting with '//' will be removed.
     */
    var removeComments = function (dsl) {
        dsl.remove(function (node) {
            if (node.key && node.key.indexOf('//') >= 0) {
                return node;
            }
        });
    };

    /**
     * Allowed format: {name: '', dsl: {}}
     */
    var validateInputContent = function (input) {
        if (!input.name) {
            log.error(5792, 'Wrong input format. Missing name.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (u.type(input.name) !== 'string') {
            log.error(3466, 'Wrong input name format. Must be text.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (!input.dsl) {
            log.error(3012, 'Wrong input format. Missing dsl.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (u.type(input.dsl) !== 'object') {
            log.error(2980, 'Wrong input format. Dsl must be an object.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        
        return true;
    };

    // Constructor
    parseInput(dslInputParam);

    return this;
};
