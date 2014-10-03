var JefNode = require('json-easy-filter').JefNode;

/**
 * Merges multiple json objects. 
 * Conflict resolution: 
 * -primitives override each other
 * -primitive and arrays override each other 
 * -objects and arrays override each other
 * -primitive and objects override each other 
 * -arrays are concatenated 
 * -objects are recursively merged 
 * -null is always overridden
 * -null never overrides
 */
module.exports = function () {
    'use strict';

    var mergeTwo = function (dstRoot, srcRoot) {
        srcRoot.filter(function (node) {
            if (!node.isRoot) {
                var context = new Context(dstRoot, node);
                if (callback) {
                    callback(context);
                } else {
                    context.useDefault();
                }
            }
        });
    };

    var Context = function (dstRootParam, srcParam) {
        var skipdefault = 'skip_42839';
        this.src = srcParam;
        this.dstRoot = dstRootParam;
        this.dst = this.dstRoot.get(this.src.path);
        this.conflict = this.dst && !this.src[skipdefault] ? true : false;
        /**
         * Used defaultMerge() to skip nodes
         */
        var skipDefault = function (node) {
            node.filter(function (child) {
                child[skipdefault] = true;
            });
        };
        /**
         * Returns 'primitive', 'array', 'object', 'null'
         */
        this.getMergeType = function (node) {
            switch (node.type()) {
            case 'number':
            case 'string':
            case 'boolean':
                return 'primitive';
            case 'null':
                return 'null';
            case 'array':
                return 'array';
            default:
                return 'object';
            }
        };

        /**
         * Updates destination.
         */
        this.update = function (value) {
            var parentDest = this.dstRoot.get(this.src.parent.path);
            parentDest.value[this.src.key] = JSON.parse(JSON.stringify(value));
            parentDest.refresh();
        };

        /**
         * Things to remember in custom merging:
         * Always use update() and delete(). Don't change directly node.value because this will not actually change the value in the json object.
         * Use context.dst only when context.conflict is true.
         * Dst will be changed. If this is not to happen, clone it first using maybe JSON.parse(json.stringify(dst))
         */
        this.useDefault = function () {
            if (this.src[skipdefault]) {
                return;
            }
            if (!this.conflict) {
                // no conflict - objects are recursively merged
                this.update(this.src.value);
                skipDefault(this.src);
            } else {
                // conflict
                var tsrc = this.getMergeType(this.src);
                var tdest = this.getMergeType(this.dst);
                if (tsrc === 'null') {
                    // null never overrides
                } else if (tsrc === 'array' && tdest === 'array') {
                    // arrays are concatenated 
                    this.update(this.dst.value.concat(this.src.value));
                    skipDefault(this.src);
                } else if (tsrc === 'object' && tdest === 'object') {
                    // objects are recursively merged
                } else {
                    // primitives override each other
                    // primitive and arrays override each other 
                    // objects and arrays override each other
                    // primitive and objects override each other
                    // null is always overridden
                    this.update(this.src.value);
                    skipDefault(this.src);
                }
            }
        };
    };

    // Constructor
    var callback;
    var input = [];
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === 'function') {
            callback = arg;
        } else if (arg instanceof JefNode) {
            input.push(arg);
        } else {
            input.push(new JefNode(arg));
        }
    }
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
