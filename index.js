module.exports = function (dslInputParam) {
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

    this.log = new Log();
    this.dsl = new JefNode({});
    /**
     * Holds input files as DslInput objects.
     */
    var dslInput = [];
    this.config = undefined;
    var that = this;

    this.generate = function () {
        // populates dsl with sections received in dslInput.
        mergeDsl(this.dsl, dslInput);
        extractConfig();
        validateInput(this.dsl);
    };
    
    var extractConfig = function(){
        if(that.dsl.has('dslConfig')){
            that.config = that.dsl.get('dslConfig');
        } else if(that.dsl.has('config')){
            that.config = that.dsl.get('config');
        } else{
            that.config = new JefNode({});
        }
    };
    this.printMeta = function () {
        var res = '';
        this.dsl.filter(function (node) {
            if (!node.isRoot) {
                var tabs = node.level - 1;
                res += su.tab(tabs) + node.key + '\n';
                if (node.meta) {
                    res += metaToString(node.meta, tabs + 1);
                }
                if (!node.hasType('object', 'array')) {
                    res += su.tab(tabs + 1) + 'value: ' + node.value + "\n";
                }
            }
        });
        return res;
    };
    var metaToString = function (meta, tabs) {
        var res = "";
        res += su.tab(tabs) + 'origin: ' + meta.origins.toString() + '\n';
        res += su.tab(tabs) + 'used: ' + meta.used + '\n';
        return res;
    };

    /**
     * Validates the root of each individual input file.
     */
    var validateInput = function () {
        var root = that.dsl.value;
        var res = true;

        // ignore empty dsl
        if (that.dsl.isEmpty()) {
            return true;
        }

        // 'type' not allowed as root element.
        if (root.type) {
            that.log.error(2943, '"type" is not allowed as top level element', that.dsl.get('type').meta.origins.toString());
            res = false;
        }

        // only objects allowed as direct children
        var onlyChildObjects = that.dsl.validate(function (node) {
            var valid = true;
            if (node.level === 1) {
                if (node.type() !== 'object') {
                    valid = false;
                    that.log.error(5763, "Only complex objects allowed as root elements.", node.meta.origins.toString(), node.path);
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
        if (!dslInputParam) {
            that.log.error(5416, su.format("No input received"));
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
                    that.log.error(9445, su.format("Could not open file '%s'", filePath));
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
                that.log.error(2429, su.format("Invalid input '%s'", item));
            }
        });
    };

    /**
     * everything starting with '//' will be removed.
     */
    var removeComments = function (input) {
        input.remove(function (node) {
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
            that.log.error(5792, 'Wrong input format. Missing name.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (u.type(input.name) !== 'string') {
            that.log.error(3466, 'Wrong input name format. Must be text.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (!input.dsl) {
            that.log.error(3012, 'Wrong input format. Missing dsl.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }
        if (u.type(input.dsl) !== 'object') {
            that.log.error(2980, 'Wrong input format. Dsl must be an object.', su.ellipsis(su.pretty(input, 0), 30));
            return false;
        }

        return true;
    };

    parseInput();

    return this;
};
