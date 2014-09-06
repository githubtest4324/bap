var BapError = require('../BapError');
var BapWarning = require('../BapWarning');
var Namespace = require('./types/Namespace');
var NamespaceCompiler = require('./compilers/NamespaceCompiler');
var EntityCompiler = require('./compilers/EntityCompiler');
var JsType = require('../utils/JsType');
var Jef = require('json-easy-filter');

module.exports = function Compiler (sourceFileNameParam, sourceParam, resultParam, loggerParam) {
	'use strict';
	this.compilers = {};
	this.logger = loggerParam;
	this.source = sourceParam;
	this.result = resultParam;
	this.jefSrc = new Jef(this.source);
	this.sourceFileName = sourceFileNameParam;

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
		var defaultNamespace;
		if(this.result.compiled.defaultNamespace){
			defaultNamespace = this.result.compiled.defaultNamespace;
		} else{
			defaultNamespace = new Namespace();
			defaultNamespace.$isDefault = true;
			defaultNamespace.$namespace = '';
			defaultNamespace.$name = '';
			defaultNamespace.$parent = this.result.compiled;
		}

		// Build default list of compilers
		this.compilers[NamespaceCompiler.type] = new NamespaceCompiler.compiler(this);
		this.compilers[EntityCompiler.type] = new EntityCompiler.compiler(this);

		if (!this._validate()) {
			return;
		}

		var usesDefaultNamespace = false;
		for ( var name in this.source) {
			if (!this.source[name].hasProp('type')) {
				// Namespace
				var namespaceCompiler = this.compilers[NamespaceCompiler.type];
				namespaceCompiler.compile(this.jefSrc.get(name), this.result.compiled);
			} else {
				// Other element
				var factory = this.compilers[this.source[name].type];
				if (factory) {
					factory.compile(this.jefSrc.get(name), defaultNamespace);
					usesDefaultNamespace = true;
				} else {
					this.error('E8472',name, 'Unknown type "{0}"'.format(this.source[name].type));
				}
			}
		}

		if (usesDefaultNamespace) {
			this.result.compiled.defaultNamespace = defaultNamespace;
		}
	};

	/**
	 * Used by compilers to emit warnings.
	 */
	this.warn = function(code, path, message){
		this.result.output.push(new BapWarning(code, this.sourceFileName, path, message));
	};
	
	/**
	 * Used by compilers to emit errors.
	 */
	this.error = function(code, path, message){
		this.result.output.push(new BapError(code, this.sourceFileName, path, message));
	};
	
	this._validate = function () {
		var res = true;
		var root = this.source;

		if (!root) {
			this.error('E4632', '', 'No content was received to be compiled');
			res = false;
		}

		// Must be an object
		if (root.typeOf() !== JsType.OBJECT) {
			this.error('E5398', '', 'Received source content must be a complex json object. The one received is of type "{0}"'.format(root.typeOf()));
			res = false;
		}

		// 'type' not allowed as root element.
		if (root.hasProp('type')) {
			this.error('E2943', '', '"type" is not allowed as top level element');
			res = false;
		}
		var that = this;
		// Root must contain only properties with 'entity', 'page', 'webService'
		// or no types
		var validTypes = this.jefSrc.validate(function (node) {
			var valid = true;
			if (node.level === 1) {
				if (node.getType() !== JsType.OBJECT) {
					valid = false;
					that.error('E3285', node.path, "Only objects allowed as top level elements.".format(node.value.type));
				} else if (!(!node.value.type || node.value.type === EntityCompiler.type)) {
					valid = false;
					that.error('E5295', node.path, "Type '{0}' not allowed for a top level element.".format(node.value.type));
				}
			}
			return valid;
		});
		if (!validTypes) {
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

};