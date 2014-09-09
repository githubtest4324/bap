var BapCompilationResult = require('./compiler/CompilationResult');
// var BapError = require('./BapError');
var Compiler = require('./compiler/Compiler');

require('./compiler/compilers/EntityCompiler');

// Utils
var jsType = require('./utils/JsType');
var stringUtils = require('./utils/StringUtils');

// Install prototype methods
jsType.installPrototypeHas();
jsType.installPrototypeTypeOf();
stringUtils.installPrototypeFormat();

module.exports = function (sources, logger) {
	'use strict';

	// ///////////////////////////////
	// Private properties
	// ///////////////////////////////
	this._logger = logger || console;
	this._sources = sources;

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

	// ///////////////////////////////
	// Private members
	// ///////////////////////////////

	// ///////////////////////////////
	// Constructor
	// ///////////////////////////////

};
