var Entity = require('../types/Entity');
var EntityProperty = require('../types/EntityProperty');
var JsType = require('../../utils/JsType');
var BapError = require('../../BapError');

module.exports = {
	type : 'entity',
	compiler : function (compilerParam) {
		'use strict';
		this.type = 'entity';
		this.compiler = compilerParam;
		this.compile = function (srcNode, parent) {
			var name = srcNode.key;
			var value = srcNode.value;
			this._validate(srcNode, parent);

			var res = new Entity();
			parent[name] = res;
			res.$name = name;
			res.$parent = parent;

			// Add properties
			for ( var propSrcName in value.properties) {
				var propSrc = value.properties[propSrcName];
				var property = new EntityProperty();
				res[propSrcName] = property;
				property.$name = propSrcName;

				if (propSrc.typeOf() === JsType.STRING) {
					// Inline property
					property.$type = propSrc;
					property.$translate = propSrcName;
				} else {
					// Expanded property
					property.$type = propSrc.type;
					if (propSrc.hasProp('translate')) {
						property.$translate = propSrc.translate;
					}
					if (propSrc.hasProp('itemType')) {
						property.$itemType = propSrc.itemType;
					}
					if (propSrc.hasProp('translate')) {
						property.$translate = propSrc.translate;
					} else {
						property.$translate = propSrcName;
					}
				}
			}

		};

		this._validate = function (srcNode, parent) {
			var output = this.compiler.result.output;
			var valid = true;

			var name = srcNode.key;
			if(parent[name]){
				output.push(new BapError('E9738', srcNode.path, "Duplicated entity."));
				valid = false;
			}
			
			// Properties is mandatory
			if (!srcNode.has('properties')) {
				output.push(new BapError('E7784', srcNode.path, "Entity is missing 'properties'"));
				valid = false;
			} else if (srcNode.get('properties').getType() !== JsType.OBJECT) {
				output.push(new BapError('E4085', srcNode.path, "Invalid entity properties."));
				valid = false;
			} else {
				// Validate each property
				srcNode.get('properties').validate(function (node, local) {
					if (local.level === 1) {
						if (node.isLeaf) {
							if (node.getType() !== JsType.STRING) {
								output.push(new BapError('E3238', node.path, "Invalid field type."));
								valid = false;
							}
						} else {
							if (!node.has('type')) {
								output.push(new BapError('E9947', node.path, "Field does not have a type."));
								valid = false;
							}
						}
					}
				});

			}

			return valid;
		};
		
		this._resolveFieldTypes = function () {
			// todo: will be called in a later stage and will decide if field
			// types are correct (either a main type or another entity).
			// srcNode.get('properties').validate(function(node, local){
			// if(local.level===1){
			// if(node.isLeaf){
			// if(this._allowedFieldTypes().indexOf(node.value)>=0){
			// output.push(new BapError('E4389', node.path, "Only {0} allowed as
			// types.".format(this._allowedFieldTypes()));
			// valid = false;
			// }
			// }
			// if(!(node.getType()===JsType.STRING ||
			// node.getType()===JsType.OBJECT)){
			// output.push(new BapError('E7599', node.path, "Invalid type '{0}'. Only
			// object or string is allowed as field
			// definition.".format(srcNode.get('properties').getType())));
			// valid = false;
			// }
			// if(node.getType===JsType.OBJECT){
			//						
			// }
			// }
			// );
		};
	}

};
