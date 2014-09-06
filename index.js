var BapCompilationResult = require('./compiler/CompilationResult');
var BapError = require('./BapError');
var Compiler = require('./compiler/Compiler');

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
	 * Transforms source into compiled form.
	 * 
	 * @returns {CompilationResult}
	 */
	this.compile = function () {
		var result = new BapCompilationResult();
		
		var that = this;
		this._sources.forEach(function(sourceStr){
			if (sourceStr === null) {
				result.output.push(new BapError('E6548', '', "Source json is not specified."));
			} else{
				var source = sourceStr;
				var compiler = new Compiler(source, result, that._logger);
				compiler.compile();
			}
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
