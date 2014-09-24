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

    var mergeTwo = function (dstRoot, srcRoot) {
        srcRoot.filter(function (node) {
            if (!node.isRoot && !node.skip) {
                var destNode = dstRoot.get(node.path);
                var parentDest = dstRoot.get(node.parent.path);
                if (!destNode) {
                    // no conflict - objects are recursively merged
                    parentDest.value[node.key] = node.value;
                    node.filter(function (child) {
                        child.skip = true;
                    });
                } else {
                    // conflict
                    var tsrc = getType(node);
                    var tdest = getType(destNode);
                    if (tsrc === 'null') {
                        // null is always overridden
                    } else if (tsrc === 'array' && tdest === 'array') {
                        // arrays are concatenated 
                        parentDest.value[node.key] = parentDest.value[node.key].concat(node.value);
                        node.filter(function (child) {
                            child.skip = true;
                        });
                    } else if (tsrc === 'object' && tdest === 'object') {
                        // objects are recursively merged
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
                if (callback) {
                    callback({
                        srcNode : node,
                        dstNode : parentDest.get(node.key),
                        conflict : false
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

    var res;
    if (input.length === 0) {
        res = {};
    } else if (input.length === 1) {
        res = input[0];
    } else {
        res = input[0];
        for (i = 1; i < input.length; i++) {
            mergeTwo(res, input[i]);
            res.refresh();
        }
    }

    return res;
};
