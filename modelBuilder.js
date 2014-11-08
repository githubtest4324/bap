/**
 * Builds and validates model. Returns true if model is correctly created.
 */
module.exports = function (bap) {
    'use strict';
    var su = require('./utils/string');
    var u = require('./utils/utils');

    var duplicatedModelNo = 0;
    var valid = true;

    var isPrimitive = function (type) {
        return u.constants.primitives.indexOf(type) !== -1;
    };

    var build = function () {
        // build model
        bap.dsl.filter(function (node) {
            if (node.has('model') && node.get('model').type() === 'boolean') {
                extractModel(node);
            }
        });

        // qualify names
        qualifyAllNames();

        return valid;
    };

    // extracts model and returns its qualified name
    var extractModel = function (node, namePrefix) {
        var model = {};
        node.meta.modelEntity = model;
        // namespace
        model.namespace = bap.getNamespace(node);

        // name
        if (node.has('name') && node.get('name').type() === 'string') {
            model.name = node.get('name').value;
        } else {
            model.name = namePrefix ? namePrefix + node.key : node.key;
        }
        if (bap.model.types[model.namespace + '.' + model.name]) {
            model.name += su.format("%03d", duplicatedModelNo++);
        }

        // dsl
        model.dsl = node;

        // qualified name
        model.qualifiedName = model.namespace + '.' + model.name;

        // type
        if (node.has('properties') && node.get('properties').type() === 'object') {
            // entity
            model.properties = extractProperties(node.get('properties'), model.name);
        } else if (node.has('type') && node.get('type').type() === 'string') {
            // type
            model.property = {
                dsl : node,
                type : extractType(node.get('type').value)
            };
        } else {
            bap.log.warn(4399, 'No suitable type or properties found to build a model', node.meta.origins.toString(), node.path);
        }
        bap.model.types[model.qualifiedName] = model;
        return model.qualifiedName;
    };

    var extractType = function (typeStr) {
        var match = /^\[(.+?)\]$/.exec(typeStr);
        if (match !== null) {
            // list
            return [
                match[1]
            ];
        } else {
            // primitive or entity
            return typeStr;
        }
    };

    var extractProperties = function (properties, entityName) {
        var res = {};
        properties.filterFirst(function (node) {
            if (node.type() === 'string') {
                // property
                res[node.key] = {
                    dsl : node,
                    type : extractType(node.value)
                };
                node.meta.modelProperty = res[node.key];
            } else if (node.has('list') && node.get('list').type() === 'object' && node.count === 1) {
                expandComplexProperty(res, node.key, node.get('list'), true, entityName);
            } else if (node.type() === 'object') {
                expandComplexProperty(res, node.key, node, false, entityName);
            }
        });
        return res;
    };

    var expandComplexProperty = function(res, propName, node, isList, entityName){
        var qualifiedName;
        if (node.has('properties') && node.get('properties').type() === 'object') {
            // inline entity
            qualifiedName = extractModel(node, entityName);
            res[propName] = {
                dsl : node,
                type : isList?[qualifiedName]:qualifiedName
            };
            node.meta.modelProperty = res[propName];
        } else if (node.has('type') && node.get('type').type() === 'string') {
            // expanded property
            res[propName] = {
                dsl : node,
                type : isList?[extractType(node.get('type').value)]:extractType(node.get('type').value)
            };
            node.meta.modelProperty = res[propName];
        } else if (node.get('type.list') && node.get('type.list').type() === 'object') {
            // list of inline entity
            qualifiedName = extractModel(node.get('type.list'), entityName);
            res[propName] = {
                dsl : node,
                type : [
                    qualifiedName
                ]
            };
            node.meta.modelProperty = res[propName];
        } else if (node.has('type') && node.get('type').type() === 'object') {
            // inline entity
            qualifiedName = extractModel(node.get('type'), entityName);
            res[propName] = {
                dsl : node,
                type : isList?[qualifiedName]:qualifiedName
            };
            node.meta.modelProperty = res[propName];
        } else {
            bap.log.warn(6043, 'Unspecified property type.', node.meta.origins.toString(), node.path);
        }
    };
    
    var qualifyAllNames = function () {
        for ( var qn in bap.model.types) {
            var entity = bap.model.types[qn];
            if (entity.properties) {
                for ( var propName in entity.properties) {
                    var prop = entity.properties[propName];
                    qualifyProperty(prop);
                }
            }
            if (entity.property) {
                qualifyProperty(entity.property);
            }
        }
    };

    var qualifyProperty = function (prop) {
        var matches, type;
        if (prop.type instanceof Array) {
            type = prop.type[0];
            matches = qualifyName(type);
            if (typeof matches === 'string') {
                prop.type[0] = matches;
            }
        } else {
            type = prop.type;
            matches = qualifyName(type);
            if (typeof matches === 'string') {
                prop.type = matches;
            }
        }
        if (matches instanceof Array) {
            if (matches.length === 0) {
                bap.log.error(9507, su.format('Cannot find type %s', type), prop.dsl.meta.origins.toString(), prop.dsl.path);
                valid = false;
            } else {
                bap.log.error(9507, su.format('Ambiguous type %s. Pick from %s', type, matches), prop.dsl.meta.origins.toString(), prop.dsl.path);
                valid = false;
            }
        }
    };

    /**
     * Gets the qualified name given the name of an entity. 
     * Returns the qualified name if one match is found.
     * Returns an array if no matches or multiple matches are found.
     */
    var qualifyName = function (name) {
        if (isPrimitive(name)) {
            return name;
        }
        var matches = [];
        for ( var qn in bap.model.types) {
            if (name === qn) {
                matches.push(qn);
            } else {
                var qnArr = qn.split('.');
                if (qnArr[qnArr.length - 1] === name) {
                    matches.push(qn);
                }
            }
        }
        if (matches.length === 1) {
            return matches[0];
        } else {
            return matches;
        }
    };

    build();
};