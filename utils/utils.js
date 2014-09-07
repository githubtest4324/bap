module.exports = {
	logFieldIdentifier: function(path, srcFileName){
		'use strict';
		var fileIdentifier;
		if(path && srcFileName){
			fileIdentifier = "{0}.{1}".format(srcFileName, path);
		} else if(path){
			fileIdentifier = path;
		} else if(srcFileName){
			fileIdentifier = srcFileName;
		} else {
			fileIdentifier = '';
		}
		return fileIdentifier;
	}
};