module.exports = function (dslInputParam, loggerParam) {
    'use strict';

    var Log = require('./log');
    var fsPath = require('path');
    var fs = require('fs');
    var JefNode = require('json-easy-filter').JefNode;
    var su = require('./utils/string');
    var u = require('./utils/utils');
    var mergeDsl = require('./merge_dsl');

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
    var dsl = new JefNode({});
    
    
    this.generate = function (logger) {
        logger = logger || console;
        // populates dsl with sections received in dslInput.
        mergeDsl(dsl, dslInput);
        validateInput(dsl);
        console.log(su.pretty(dsl.value));
        log.print();
    };
    this.getLogs = function () {
        return log.toStringArray();
    };
    this.printLogs = function () {
        log.print();
    };
    var metaToString = function(meta, tabs){
        var res = "";
        res+=su.tab(tabs)+'origin: '+meta.origins.toString()+'\n';
        res+=su.tab(tabs)+'used: '+meta.used+'\n';
        return res;
    };
    this.toString = function () {
        var res = '';
        dsl.filter(function(node){
            if(!node.isRoot){
                debugger;
                var tabs = node.level -1;
                res+=su.tab(tabs)+node.key+'\n';
                if(node.meta){
                    res+=metaToString(node.meta, tabs+1);
                }
                if(!node.hasType('object', 'array')){
                    res+=su.tab(tabs+1)+'value: '+node.value+"\n";
                }
            }
        });
        return res;
    };
    
    /**
     * Validates the root of each individual input file.
     */
    var validateInput = function () {
        var root = dsl.value;
        var res = true;

        // ignore empty dsl
        if(dsl.isEmpty()){
            return true;
        }
        
        // 'type' not allowed as root element.
        if (root.type) {
            log.error(2943, '"type" is not allowed as top level element', input.fileName);
            res = false;
        }

        // only objects allowed as direct children
        var that = this;
        var onlyChildObjects = dsl.validate(function (node) {
            var valid = true;
            if (node.level === 1) {
                if (node.type() !== 'object') {
                    valid = false;
                    log.error(5763, "Only complex objects allowed as root elements.", input.fileName, node.path);
                }
            }
            return valid;
        });
        if (!onlyChildObjects) {
            res = false;
        }

        return res;
    };

    
    var parseInput = function () {
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
                    input.dsl = new JefNode(JSON.parse(fs.readFileSync(filePath, 'utf8')));
                    dslInput.push(input);
                } catch (error) {
                    log.error(9445, su.format("Could not open file '%s'", filePath));
                }
            } else if (u.type(item) === 'object') {
                // dsl
                if (validateInputContent(item)) {
                    input.fileName = item.name;
                    input.dsl = new JefNode(JSON.parse(JSON.stringify(item.dsl)));
                    removeComments(input.dsl);
                    dslInput.push(input);
                }
            } else {
                log.error(2429, su.format("Invalid input '%s'", item));
            }
        });
    };
    
    /**
     * everything starting with '//' will be removed.
     */
    var removeComments = function (dsl) {
        dsl.remove(function (node) {
            if (node.key && node.key.indexOf('//') >= 0) {
                return node;
            }
        });
    };

    /**
     * allowed format: {name: '', dsl: {}}
     */
    var validateInputContent = function (input) {
        if (!input.name) {
            log.error(5792, 'Wrong input format. Missing name.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (u.type(input.name) !== 'string') {
            log.error(3466, 'Wrong input name format. Must be text.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (!input.dsl) {
            log.error(3012, 'Wrong input format. Missing dsl.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (u.type(input.dsl) !== 'object') {
            log.error(2980, 'Wrong input format. Dsl must be an object.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        
        return true;
    };

    parseInput();

    return this;
};
