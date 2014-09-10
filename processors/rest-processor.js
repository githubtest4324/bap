var Rest = require('./rest');

module.exports = {
    type : 'rest',
    processor : function (compilerParam) {
        'use strict';
        this.type = 'webService';
        this.compiler = compilerParam;
        this.compile = function (srcNode, parent) {
            srcNode.meta.used = true;
            srcNode.get('type').meta.used = true;
            if (!this._validate(srcNode, parent)) {
                return;
            }

            var res = new Rest();
            parent[srcNode.key] = res;
            res.$name = srcNode.key;
            res.$parent = parent;
            srcNode.get('url').meta.used = true;
            res.$url = srcNode.get('url').value;
            this._compileIO(res, res.$input, srcNode.get('input'));
            this._compileIO(res, res.$output, srcNode.get('output'));

        };

        /**
         * Compiles rest.input or rest.output.
         */
        this._compileIO = function (parent, restProp, srcProp) {
            srcProp.meta.used = true;
            if (srcProp.getType() === 'string') {
                restProp.$type = srcProp.value;
            } else {
                srcProp.get('type').meta.used = true;
                if (srcProp.get('type').value === this.compiler.primitives.list) {
                    restProp.$type = srcProp.get('type').value;
                    srcProp.get('itemType').meta.used = true;
                    restProp.$itemType = srcProp.get('itemType').value;
                } else if (srcProp.get('type').value === this.compiler.primitives.entity) {
                    // inline entity
                    debugger;
                    var entityName = this.compiler.expandInlineEntity(parent.getNamespace(), "{0}_{1}".format(parent.$name, srcProp.key), srcProp);
                    restProp.$type = entityName;
                } else {
                    restProp.$type = srcProp.get('type').value;
                }

            }
        };

        this._validate = function (srcNode, parent) {
            var restName = srcNode.key;
            var valid = true;

            if (parent[restName]) {
                this.compiler.error('E8784', srcNode.path, "Duplicated rest service.");
                valid = false;
            }
            if (!srcNode.has('url')) {
                this.compiler.error('E7210', srcNode.path, "Url is missing.");
                valid = false;
            }
            if (!srcNode.has('input')) {
                this.compiler.error('E4223', srcNode.path, "Input is missing.");
                valid = false;
            } else {
                if (!this._validateIO(srcNode.get('input'), 'input')) {
                    valid = false;
                }
            }
            if (!srcNode.has('output')) {
                this.compiler.error('E0304', srcNode.path, "Output is missing.");
                valid = false;
            } else {
                if (!this._validateIO(srcNode.get('output'))) {
                    valid = false;
                }
            }

            return valid;
        };

        /**
         * Validates rest.input or rest.output.
         */
        this._validateIO = function (node) {
            var valid = true;

            if (node.getType() !== 'string' && node.getType() !== 'object') {
                this.compiler.error('E7182', node.path, "Only strings or complex object allowed.");
                valid = false;
            } else if (node.getType() === 'object') {
                if (!node.has('type')) {
                    this.compiler.error('E9906', node.path, "'type' is missing.");
                    valid = false;
                } else if (node.get('type').getType() !== 'string') {
                    this.compiler.error('E9877', node.path, "'type' must be a string.");
                    valid = false;
                }
            }

            return valid;
        };

    }
};
