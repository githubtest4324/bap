module.exports = function (dslInputParam, loggerParam) {
    'use strict';

    var Log = require('./log');
    var fsPath = require('path');
    var fs = require('fs');
    var Jef = require('json-easy-filter');
    var su = require('./utils/string');
    var u = require('./utils/utils');

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

    pub.generate = function (logger) {
        priv.logger = logger || console;
    };
    pub.getLogs = function () {
        return priv.log.toStringArray();
    };
    pub.printLogs = function () {
        priv.log.print();
    };

    priv.parseInput = function (dslInputParam) {
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
                    input.content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    priv.dslInput.push(input);
                } catch (error) {
                    priv.log.error(9445, su.format("Could not open file '%s'", filePath));
                }
            } else if (u.type(item) === 'object') {
                // content
                if (priv.validateInputContent(item)) {
                    input.fileName = item.name;
                    input.content = item.content;
                    priv.dslInput.push(input);
                }
            } else {
                priv.log.error(2429, su.format("Invalid input '%s'", item));
            }
        });
    };

    /**
     * Allowed format: {name: '', dsl: {}}
     */
    priv.validateInputContent = function (input) {
        if (!input.name) {
            priv.log.error(5792, 'Wrong input format. Missing name.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (u.type(input.name) !== 'string') {
            priv.log.error(3466, 'Wrong input name format. Must be text.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (!input.dsl) {
            priv.log.error(3012, 'Wrong input format. Missing dsl.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        if (u.type(input.dsl) !== 'object') {
            priv.log.error(2980, 'Wrong input format. Dsl must be an object.', su.ellipsis(su.pretty(input), 30));
            return false;
        }
        return new Jef(input).validate(function (node) {
            if (node.level === 0) {
            }
        });
    };

    // Constructor
    priv.parseInput(dslInputParam);

    return pub;
};
