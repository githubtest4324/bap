var Jef = require('json-easy-filter');

/**
 * Merges multiple json objects. 
 * Conflict resolution: 
 * -scalars override each other
 * -scalar and arrays override each other 
 * -objects and arrays override each other
 * -scalar and objects override each other 
 * -arrays are concatenated 
 * -objects are recursively merged 
 * -null is always overridden
 */
module.exports = function () {
    'use strict';

    var callback;
    var input = [];
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === 'function') {
            callback = arg;
        } else if (arg instanceof Jef) {
            input.push(arg);
        } else {
            input.push(new Jef(arg));
        }
    }

    var mergeTwo = function (dest, src) {
        //        var changes = [];
        src.filter(function (node) {
            if (node.isRoot) {
                return;
            }
            if (node.skip) {
                return;
            }
            var destNode = dest.get(node.path);
            var parentDest = dest.get(node.parent.path);
            if (!destNode) {
                // objects are recursively merged
                parentDest.value[node.key] = node.value;
                node.filter(function (child) {
                    child.skip = true;
                });
            } else {
                var tsrc = getType(node);
                var tdest = getType(destNode);
                if (tsrc === 'null') {
                    // null is always overridden
                    return;
                } else if (tsrc === 'array' && tdest === 'array') {
                    // arrays are concatenated 
                    parentDest.value[node.key] = parentDest.value[node.key].concat(node.value);
                    node.filter(function (child) {
                        child.skip = true;
                    });
                } else if (tsrc === 'object' && tdest === 'object') {
                    // objects are recursively merged
                    return;
                } else {
                    // scalars override each other
                    // scalar and arrays override each other 
                    // objects and arrays override each other
                    // scalar and objects override each other 
                    parentDest.value[node.key] = node.value;
                    node.filter(function (child) {
                        child.skip = true;
                    });
                }

            }

        });
    };

    /**
     * Returns 'scalar', 'array', 'object', 'null'
     */
    var getType = function (node) {
        switch (node.type()) {
        case 'number':
        case 'string':
        case 'boolean':
            return 'scalar';
        case 'null':
            return 'null';
        case 'array':
            return 'array';
        default:
            return 'object';
        }
    };

    var res = new Jef({});
    for (i = 0; i < input.length; i++) {
        mergeTwo(res, input[i]);
        res.refresh();
    }
    return res;
};
