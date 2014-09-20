var Metadata = require('./metadata');

/**
 * Merges input into main dsl.
 * 
 * @param dslParam
 *            Main dsl.
 * @param inputParam
 *            Source dsl. Has DslInput type.
 */
module.exports = function (dsl, input) {
    'use strict';
    var changes = [];
    var Change = function (pathParam, valueParam) {
        this.path = pathParam;
        this.value = valueParam;

        return this;
    };

    this.merge = function () {
        input.dsl.filter(function (node) {
            if (node.isRoot) {
                return;
            }

            if (node.skip) {
                return;
            }
            if (!dsl.get(node.path)) {
                var change = new Change(node.path, node.value);
                changes.push(change);
                node.skip = true;
                node.filter(function (child) {
                    child.skip = true;
                });
            }
        });

        debugger;
        changes.forEach(function (item) {
            var src = input.dsl.get(item.path);
            var dest = dsl.get(src.parent.path);
            dest.value[src.key] = src.value;
        });

    };

    return this;
};
