module.exports = function BapError (code, srcFileNameParam, pathParam, messageParam) {
	'use strict';
	this.type = 'error';
	this.message = messageParam || '';
	this.path = pathParam || '';
	this.code = code || '';
	this.srcFileName = srcFileNameParam;
	this.toString = function () {
		var fileIdentifier;
		if(this.path && this.srcFileName){
			fileIdentifier = "{0}.{1}".format(this.srcFileName, this.path);
		} else if(this.path){
			fileIdentifier = this.path;
		} else if(this.srcFileName){
			fileIdentifier = this.srcFileName;
		} else {
			fileIdentifier = '';
		}
		return 'Error[{0}] at {1}: {2}'.format(this.code, fileIdentifier, this.message);
	};
};