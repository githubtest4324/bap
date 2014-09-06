var Namespace = require('../types/Namespace');
var BapError = require('../../BapError');
var JsType = require('../../utils/JsType.js');
var EntityCompiler = require('./EntityCompiler.js');

module.exports = {
	type : 'namespace',
	compiler : function (compilerParam) {
		'use strict';
		this.type = 'namespace';
		this.compiler = compilerParam;

		this.compile = function (srcNode, parent) {
			var name = srcNode.key;
			var value = srcNode.value;
			if (!this._validate(srcNode, parent)) {
				return;
			}

			var res;
			if(parent[name]){
				res = parent[name];
			} else{
				// Build namespace element
				res = new Namespace();
				parent[name] = res;
				res.$name = name;
				res.$parent = parent;
				if (parent.hasProp('$type') && parent.$type === this.type) {
					// Has namespace parent
					res.$namespace = "{0}.{1}".format(parent.$namespace, name);
				} else {
					// Has root parent
					res.$namespace = name;
				}
			}

			// Compile children
			for ( var childName in value) {
				var child = value[childName];
				if (!value[childName].hasProp('type')) {
					// Namespace
					this.compile(srcNode.get(childName), res);
				} else {
					// Other element
					var compiler = this.compiler.compilers[child.type];
					compiler.compile(srcNode.get(childName), res);
				}
			}
		};

		this._validate = function (srcNode) {
			var res = true;

			if (!this._allowedTypes(srcNode)) {
				res = false;
			}

			return res;
		};

		/**
		 * Returns true if this namespace contains only properties with
		 * 'entity', 'page', 'webService' or no types (other namespaces).
		 */
		this._allowedTypes = function (srcNode) {
			var output = this.compiler.result.output;
			var res = srcNode.validate(function (node, local) {
				var valid = true;
				if (local.level === 1) {
					if (node.getType() !== JsType.OBJECT) {
						valid = false;
						output.push(new BapError('E8695', node.path, "Only complex objects allowed as namespace elements."));
					} else if (!(!node.has('type') || node.value.type === EntityCompiler.type)) {
						valid = false;
						output.push(new BapError('E3187', node.path, "Invalid type."));
					}
				}
				return valid;
			});

			return res;
		};

	}

};
