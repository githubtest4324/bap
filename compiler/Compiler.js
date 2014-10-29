var BapError = require('../BapError');
var BapWarning = require('../BapWarning');
var Namespace = require('./types/Namespace');
var NamespaceCompiler = require('./compilers/NamespaceCompiler');
var EntityCompiler = require('./compilers/EntityCompiler');
var RestProcessor = require('../processors/rest-processor');
var JsType = require('../utils/JsType');
var Jef = require('json-easy-filter');
var SrcMetadata = require('../src-metadata');

module.exports = function Compiler (sourceFileNameParam, sourceParam, resultParam, loggerParam) {
    'use strict';
    this.compilers = {};
    this.logger = loggerParam;
    this.source = sourceParam;
    this.result = resultParam;
    this._jefSrc = undefined;
    this.sourceFileName = sourceFileNameParam;
    /**
     * List of supported primitive types.
     */
    this.primitives = {
        str : 'str',
        list: 'list',
        entity : 'entity'
    };

    /**
     * @param source
     *            Source file.
     * @param result
     *            Object to write compiled code into.
     * @param path
     *            Currently processed path
     * @param compilers
     *            List of type compilers
     */
    this.compile = function () {

        // default namespace
        var defaultNamespace;
        if (this.result.compiled.defaultNamespace) {
            defaultNamespace = this.result.compiled.defaultNamespace;
        } else {
            defaultNamespace = new Namespace();
            defaultNamespace.$isDefault = true;
            defaultNamespace.$namespace = '';
            defaultNamespace.$name = '';
            defaultNamespace.$parent = this.result.compiled;
        }

        this._removeComments();

        // adnotate jef object
        this._jefSrc = new Jef(this.source);
        this._jefSrc.filter(function (node) {
            node.meta = new SrcMetadata();
        });
        this._jefSrc.meta.used = true;

        // build default list of compilers
        this.compilers[NamespaceCompiler.type] = new NamespaceCompiler.compiler(this);
        this.compilers[EntityCompiler.type] = new EntityCompiler.compiler(this);
        this.compilers[RestProcessor.type] = new RestProcessor.processor(this);

        if (!this._validate()) {
            return;
        }

        // compile
        var usesDefaultNamespace = false;
        for ( var name in this.source) {
            if (!this.source[name].hasProp('type')) {
                // namespace
                var namespaceCompiler = this.compilers[NamespaceCompiler.type];
                namespaceCompiler.compile(this._jefSrc.get(name), this.result.compiled);
            } else {
                // any other element
                var factory = this.compilers[this.source[name].type];
                if (factory) {
                    factory.compile(this._jefSrc.get(name), defaultNamespace);
                    usesDefaultNamespace = true;
                }
            }
        }

        if (usesDefaultNamespace) {
            this.result.compiled.defaultNamespace = defaultNamespace;
        }

        this._reportUnused();
    };

    /**
     * Used by compilers to emit warnings.
     */
    this.warn = function (code, path, message) {
        this.result.errors.push(new BapWarning(code, this.sourceFileName, path, message));
    };

    /**
     * Used by compilers to emit errors.
     */
    this.error = function (code, path, message) {
        this.result.errors.push(new BapError(code, this.sourceFileName, path, message));
    };

    this.expandInlineEntity = function (nameSpaceStr, prefferedEntityName, entityNode) {
//        var entityName = "{0}_{1}".format(namePrefix, this._randomInlineName());

        var namespace = this.getCompiledElement(nameSpaceStr);
        var entityProcessor = this.compilers[this.primitives.entity];
        var entityName = entityProcessor.compileInlineEntity(entityNode, namespace, prefferedEntityName);
        
        return entityName;
    };
    
    this._randomInlineName = function () {
        return Math.floor(Math.random() * 16777215).toString(16);
    };

    this._validate = function () {
        var res = true;
        var root = this.source;

        if (!root) {
            this.error('E4632', '', 'No content was received to be compiled');
            res = false;
        }

        // must be an object
        if (root.typeOf() !== JsType.OBJECT) {
            this.error('E5398', '', 'Received source content must be a complex json object. The one received is of type "{0}"'.format(root.typeOf()));
            res = false;
        }

        // 'type' not allowed as root element.
        if (root.hasProp('type')) {
            this.error('E2943', '', '"type" is not allowed as top level element');
            res = false;
        }

        // only objects allowed as direct children
        var that = this;
        var onlyChildObjects = this._jefSrc.validate(function (node) {
            var valid = true;
            if (node.level === 1) {
                if (node.type() !== JsType.OBJECT) {
                    valid = false;
                    debugger;
                    that.error('E5763', node.path, "Only complex objects allowed as root elements.");
                }
            }
            return valid;
        });
        if (!onlyChildObjects) {
            res = false;
        }

        return res;
    };

    this.getCompiledElement = function (path) {
        return this._getElement(this.result.compiled, path);
    };

    this.getSourceElement = function (path) {
        return this._getElement(this.source, path);
    };
    this._getElement = function (tree, path) {
        if (!path) {
            return tree;
        }

        var names = path.split('.');
        var currentObj = tree;
        names.forEach(function (element) {
            if (currentObj === null) {
                currentObj = tree[element];
            } else {
                currentObj = currentObj[element];
            }
        });
        return currentObj;
    };

    this._reportUnused = function () {
        var that = this;
        this._jefSrc.filter(function (node) {
            if (!node.meta.used) {
                if (node.parent && node.parent.meta.used === true) {
                    that.warn('W2430', node.path, 'Unused node');
                }
            }
        });
    };

    this._removeComments = function () {
        var comments = [];
        new Jef(this.source).filter(function (node) {
            if (node.key && node.key.indexOf('//') >= 0) {
                comments.push(node);
            }
        });
        comments.forEach(function (node) {
            if (node.parent) {
                delete node.parent.value[node.key];
            }
        });
    };
};
