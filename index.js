var Bap = new function () {
    'use strict';

    var jsType = require('./utils/JsType');
    var stringUtils = require('./utils/StringUtils');
    var Log = require('./BapLog');
    var fsPath = require('path');
    var fs = require('fs');
    var Jef = require('json-easy-filter');
    // Install prototype methods
    jsType.installPrototypeHas();
    jsType.installPrototypeTypeOf();
    stringUtils.installPrototypeFormat();

    var DslInput = function () {
        var pub = {};
        pub.filePath = undefined;
        pub.fileName = undefined;
        pub.content = undefined;
        return pub;
    };

    
    var pub = {}, priv = {};
    priv.logger = console;
    /**
     * List of DslInput objects.
     */
    priv.dslInput = [];

    priv.log = [];

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
                priv.log.push(new Log('E', '5792', 'Wrong input format. Missing file name.'));
                return false;
            }
            if(node.get('name').getType()!=='string'){
                priv.log.push(new Log('E', '3466', 'Wrong input format. File name must be textual.'));
                return false;
            }
            if(!node.has('dsl')){
                priv.log.push(new Log('E', '3012', 'Wrong input format. Missing dsl.'));
                return false;
            }
            if(node.get('dsl').getType()!=='object'){
                priv.log.push(new Log('E', '2980', 'Wrong input format. Dsl must be an object.'));
                return false;
            }
            
        });
    };

    // ///////////////////////////////
    // Private properties
    // ///////////////////////////////

    /**
     * @returns {CompilationResult}
     */
    this.compile = function () {
        var result = new BapCompilationResult();
        var that = this;
        this._sources.forEach(function (source) {
            var compiler = new Compiler(source.fileName, source.content, result, that._logger);
            compiler.compile();
        });
        return result;
    };

    return pub;
};

module.exports = Bap;
