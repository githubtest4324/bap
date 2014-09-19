var Entity = require('../types/Entity');
var EntityProperty = require('../types/EntityProperty');
var JsType = require('../../utils/JsType');

module.exports = {
    type : 'entity',
    compiler : function (compilerParam) {
        'use strict';
        this.type = 'entity';
        this.compiler = compilerParam;
        this.compile = function (srcNode, parent) {
            this._compile(srcNode, parent);
        };
        this.compileInlineEntity = function(srcNode, parent, prefferedEntityName){
            var name = this._compile(srcNode, parent, prefferedEntityName);
            return name;
        };
        
        this._compile = function (srcNode, parent, prefferedEntityName) {
            srcNode.meta.used = true;
            srcNode.get('type').meta.used = true;
            var name = this._getEntityName(srcNode, prefferedEntityName);
            if (!this._validate(srcNode, parent, name)) {
                return name;
            }

            var res = new Entity();
            parent[name] = res;
            res.$name = name;
            res.$parent = parent;
            // Add properties
            srcNode.get('properties').meta.used = true;
            var that = this;
            srcNode.get('properties').filter(function (prop, local) {
                if (local.level === 1) {
                    prop.meta.used = true;
                    var property = new EntityProperty();
                    res[prop.key] = property;
                    property.$name = prop.key;

                    if (prop.type() === JsType.STRING) {
                        // inline property
                        property.$type = prop.value;
                        property.$translate = prop.key;
                    } else {
                        if (prop.get('type').value === that.compiler.primitives.entity) {
                            // inline entity
                            prop.get('type').meta.used = true;
                            var entityName = that.compiler.expandInlineEntity(res.getNamespace(), "{0}_{1}".format(res.$name, prop.key), prop);
                            property.$type = entityName;
                            property.$translate = prop.key;
                        } else {
                            // expanded property
                            property.$type = prop.value.type;
                            prop.get('type').meta.used = true;
                            if (prop.has('itemType') && prop.get('itemType').type() === JsType.STRING) {
                                prop.get('itemType').meta.used = true;
                                property.$itemType = prop.value.itemType;
                            }
                            if (prop.has('readOnly') && prop.get('readOnly').type() === JsType.BOOLEAN) {
                                prop.get('readOnly').meta.used = true;
                                property.$readOnly = prop.value.readOnly;
                            }
                            if (prop.has('translate')) {
                                prop.get('translate').meta.used = true;
                                property.$translate = prop.value.translate;
                            } else {
                                property.$translate = prop.key;
                            }
                        }
                    }
                }
            });
            return name;
        };

        this._getEntityName = function(srcNode, prefferedEntityName){
            if(srcNode.has('name')){
                srcNode.get('name').meta.used = true;
                return srcNode.get('name').value;
            } else if(prefferedEntityName){
                return prefferedEntityName;
            } else{
                return srcNode.key;
            }
        };
        
        this._validate = function (srcNode, parent, entityName) {
            var valid = true;

            if (parent[entityName]) {
                this.compiler.error('E9738', srcNode.path, "Duplicated entity '{0}'.".format(entityName));
                valid = false;
            }

            // Properties is mandatory
            if (!srcNode.has('properties')) {
                this.compiler.error('E7784', srcNode.path, "Entity is missing 'properties'");
                valid = false;
            } else if (srcNode.get('properties').type() !== JsType.OBJECT) {
                this.compiler.error('E4085', srcNode.path, "Invalid entity properties.");
                valid = false;
            } else {
                var that = this;
                // Validate each property
                srcNode.get('properties').validate(function (node, local) {
                    if (local.level === 1) {
                        if (node.isLeaf) {
                            if (node.type() !== JsType.STRING) {
                                that.compiler.error('E3238', node.path, "Invalid field type.");
                                valid = false;
                            }
                        } else {
                            if (!node.has('type')) {
                                that.compiler.error('E9947', node.path, "Field does not have a type.");
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
            // this.compiler.error('E4389', node.path, "Only {0} allowed as
            // types.".format(this._allowedFieldTypes()));
            // valid = false;
            // }
            // }
            // if(!(node.type()===JsType.STRING ||
            // node.type()===JsType.OBJECT)){
            // this.compiler.error('E7599', node.path, "Invalid type '{0}'. Only
            // object or string is allowed as field
            // definition.".format(srcNode.get('properties').type())));
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
