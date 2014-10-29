module.exports = function (bap) {
    'use strict';
    var su = require('./utils/string');

    var duplicatedModelNo = 0;
    var isPrimitive = function (type) {
        return [
                'int', 'number', 'double', 'float', 'bool', 'string', 'decimal', 'date', 'time', 'datetime'
        ].indexOf(type) !== -1;
    };

    var build = function () {
        bap.dsl.filter(function (node) {
            if (node.has('model') && node.get('model').type() === 'boolean') {
                extractModel(node);
            }
        });
    };

    // extracts model and returns its qualified name
    var extractModel = function (node, namePrefix) {
        var model = {};
        // namespace
        model.namespace = bap.getNamespace(node);

        // name
        if (node.has('name') && node.get('name').type() === 'string') {
            model.name = node.get('name').value;
        } else {
            model.name = namePrefix ? namePrefix + node.key : node.key;
        }
        if(bap.model[model.namespace + '.' + model.name]){
            model.name+=su.format("%03d", duplicatedModelNo++);
        }

        // qualified name
        model.qualifiedName = model.namespace + '.' + model.name;

        // type
        if (node.has('properties') && node.get('properties').type() === 'object') {
            model.type = extractProperties(node.get('properties'), model.name);
        } else if (node.has('type') && node.get('type').type() === 'string') {
            model.type = extractType(node.get('type').value);
        } else {
            bap.log.warn(4399, 'No suitable type or properties found to build a model', node.meta.origins.toString(), node.path);
        }
        bap.model[model.qualifiedName] = model;
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
        var type = {};
        properties.filterFirst(function (node) {
            if (node.type() === 'string') {
                // property
                type[node.key] = extractType(node.value);
            } else if (node.type() === 'object') {
                if(node.has('properties') && node.get('properties').type()==='object'){
                    // inline entity
                    var qualifiedName = extractModel(node, entityName);
                    type[node.key] = qualifiedName;
                } else if(node.has('type') && node.get('type').type()==='string'){
                    // expanded property
                    type[node.key]=extractType(node.get('type').value);
                } else{
                    bap.warn(6043, 'Unspecified property type.', node.meta.origins.toString());
                }
            }
        });
        return type;
    };

    build();
};