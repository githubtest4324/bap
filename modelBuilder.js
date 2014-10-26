module.exports = function (bap) {
    'use strict';

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
        debugger;
        // namespace
        model.namespace = bap.getNamespace(node);

        // name
        if (node.has('name') && node.get('name').type === 'string') {
            model.name = node.get('name');
        } else {
            model.name = "" + namePrefix + node.key;
        }

        // qualified name
        model.qualifiedName = model.namespace + '.' + model.name;

        // type
        if (node.has('properties') && node.get('properties').type() === 'object') {
            model.type = extractProperties(node.get('properties'));
        } else if (node.has('type') && node.get('type').type() === 'string') {
            model.type = extractType(node.get('type').value);
        } else {
            bap.log.warning(4399, 'Neityer suitable type or properties found to build a model', node.meta.origins.toString());
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

    var extractProperties = function (properties) {
        debugger;
        var type = {};
        properties.filterFirst(function (node) {
            if (node.type() === 'string') {
                type[node.key] = extractType(node.value);
            } else if (node.type() === 'object') {
                var qualifiedName = extractModel(node);
                type[node.key] = qualifiedName;
            }
        });
        return type;
    };

    build();
};