/**
 * Base class for all generators.
 */
var BaseGen = function () {
    'use strict';
    this.bap = undefined;
    this.name = undefined;
    this.version = undefined;
    this.init = function (bap) {
        this.bap = bap;
    };
    this.model = function () {
    };
    this.generate = function () {
    };
};
module.exports = {
    BaseGen : BaseGen,
    Bap : function (dslInputParam) {
        'use strict';

        var Log = require('./log');
        var fsPath = require('path');
        var fs = require('fs');
        var JefNode = require('json-easy-filter').JefNode;
        var su = require('./utils/string');
        var u = require('./utils/utils');
        var mergeDsl = require('./merge_dsl');
        var Meta = require('./metadata');
        var buildModel = require('./modelBuilder');
        var ModelBase = require('./model_base');

        var DslInput = function () {
            this.filePath = undefined;
            this.fileName = undefined;
            this.dsl = undefined;
            return this;
        };

        this.log = new Log();
        this.dsl = new JefNode({});
        this.generators = [];
        this.model = new ModelBase(this);
        /**
         * Holds input files as DslInput objects.
         */
        var dslInput = [];
        this.config = undefined;
        var that = this;

        /**
         * Parse input and run all configured generators.
         */
        this.generate = function () {
            // populates dsl with sections received in dslInput.
            mergeDsl(this.dsl, dslInput);
            extractConfig();
            if(!validateInput(this.dsl)){
                return;
            }
            if(!extractGenerators()){
                return;
            }
            buildModel(that);
            
            // Model
            this.generators.forEach(function (generator) {
                generator.model();
            });
            // Generate
            this.generators.forEach(function (generator) {
                generator.generate();
            });
        };

        /**
         * Parses dsl.generators and builds BaseGen objects.
         */
        var extractGenerators = function () {
            var valid = true;
            var gen = that.dsl.get('generators');
            if (!gen) {
                that.log.warn(3846, 'No generators defined.', that.dsl.meta.origins);
            } else if (!gen.hasType('object')) {
                that.log.error(6962, 'Generators config wrong format.', gen.meta.origins);
                valid = false;
            } else {
                gen.filterFirst(function (node) {
                    if (!node.has('type') || node.get('type').type()!=='string') {
                        that.log.error(8263, 'Generator config wrong format.', node.meta.origins);
                        valid = false;
                    } else {
                        var generator = resolveGenerator(node);
                        if (generator) {
                            generator.init(that, node.key);
                            that.generators.push(generator);
                        } else {
                            valid = false;
                        }
                    }
                });
            }
            return valid;
        };

        /**
         * Builds BaseGen object.
         */
        var resolveGenerator = function (generatorNode) {
            var generatorName = generatorNode.get('type').value;
            var locations = [
                    '', __dirname + '/generators/'
            ];
            var GeneratorClass;
            for (var i = 0; i < locations.length; i++) {
                try {
                    GeneratorClass = require(locations[i] + generatorName);
                    break;
                } catch (err) {
                    // ignore
                }
            }

            if (GeneratorClass) {
                try {
                    var generator = new GeneratorClass(that);
                    if (!generator instanceof BaseGen) {
                        that.log.error(2001, su.format('"%s" is not instance of Generator.', generatorName), generatorNode.meta.origins);
                        return null;
                    } else{
                        return generator;
                    }
                } catch (err) {
                    that.log.error(5478, su.format('Could not initialize "%s": %s', generatorName, err.toString()), generatorNode.meta.origins);
                    return null;
                }
            } else {
                that.log.error(7594, su.format('Unknown generator "%s".', generatorName), generatorNode.meta.origins);
                return null;
            }
        };

        var extractConfig = function () {
            if (that.dsl.has('dslConfig')) {
                that.config = that.dsl.get('dslConfig');
            } else if (that.dsl.has('config')) {
                that.config = that.dsl.get('config');
            } else {
                that.config = new JefNode({});
                that.config.meta = new Meta();
            }
        };
        this.printMeta = function () {
            var res = '';
            this.dsl.filter(function (node) {
                if (!node.isRoot) {
                    var tabs = node.level - 1;
                    res += su.tab(tabs) + node.key + '\n';
                    if (node.meta) {
                        res += metaToString(node.meta, tabs + 1);
                    }
                    if (!node.hasType('object', 'array')) {
                        res += su.tab(tabs + 1) + 'value: ' + node.value + "\n";
                    }
                }
            });
            return res;
        };
        var metaToString = function (meta, tabs) {
            var res = "";
            res += su.tab(tabs) + 'origin: ' + meta.origins.toString() + '\n';
            res += su.tab(tabs) + 'used: ' + meta.used + '\n';
            return res;
        };

        this.printGenerators = function () {
            var res = '';
            this.generators.forEach(function (generator) {
                res += generator.name + '\n';
                res += su.tab(1) + generator.version + '\n';

            });

            return res;
        };

        this.printModel = function () {
            return su.pretty(this.model.types, 4, function (key, value) {
                if (value instanceof JefNode) {
                    return value.meta.origins.toString() + "." + value.path;
                } else {
                    return value;
                }
            });
        };

        /**
         * Returns the namespace of specified dsl node.
         */
        this.getNamespace = function (node) {
            var path = [];
            while (!node.isRoot) {
                path.push(node);
                node = node.parent;
            }
            var namespace = "";
            // iterate from root to node
            for (var i = path.length - 1; i >= 0; i--) {
                node = path[i];
                var isns = isNamespace(node);
                if (isns) {
                    if (namespace) {
                        namespace += '.' + node.key;
                    } else {
                        namespace += node.key;
                    }
                } else {
                    break;
                }
            }
            return namespace;
        };

        var isNamespace = function (node) {
            var res = true;
            node.filterFirst(function (child) {
                // a namespace is formed only by objects
                if (child.hasType('string', 'number', 'boolean')) {
                    res = false;
                }
            });
            return res;
        };

        /**
         * Validates the root of each individual input file.
         */
        var validateInput = function () {
            var root = that.dsl.value;
            var res = true;

            // ignore empty dsl
            if (that.dsl.isEmpty()) {
                return true;
            }

            // 'type' not allowed as root element.
            if (root.type) {
                that.log.error(2943, '"type" is not allowed as top level element', that.dsl.get('type').meta.origins.toString());
                res = false;
            }

            // only objects allowed as direct children
            var onlyChildObjects = that.dsl.validate(function (node) {
                var valid = true;
                if (node.level === 1) {
                    if (node.type() !== 'object') {
                        valid = false;
                        that.log.error(5763, "Only complex objects allowed as root elements.", node.meta.origins.toString(), node.path);
                    }
                }
                return valid;
            });
            if (!onlyChildObjects) {
                res = false;
            }

            return res;
        };

        var parseInput = function () {
            if (!dslInputParam) {
                that.log.error(5416, su.format("No input received"));
                return;
            }
            if (u.type(dslInputParam) !== 'array') {
                dslInputParam = [
                    dslInputParam
                ];
            }

            dslInputParam.forEach(function (item) {
                var input = new DslInput();
                if (u.type(item) === 'string') {
                    // file path
                    var filePath = fsPath.normalize(item);
                    input.filePath = fsPath.dirname(filePath);
                    input.fileName = fsPath.basename(filePath);
                    try {
                        input.dsl = new JefNode(JSON.parse(fs.readFileSync(filePath, 'utf8')));
                        dslInput.push(input);
                    } catch (error) {
                        that.log.error(9445, su.format("Could not open file '%s'", filePath));
                    }
                } else if (u.type(item) === 'object') {
                    // dsl
                    if (validateInputContent(item)) {
                        input.fileName = item.name;
                        input.dsl = new JefNode(JSON.parse(JSON.stringify(item.dsl)));
                        removeComments(input.dsl);
                        dslInput.push(input);
                    }
                } else {
                    that.log.error(2429, su.format("Invalid input '%s'", item));
                }
            });
        };

        /**
         * everything starting with '//' will be removed.
         */
        var removeComments = function (input) {
            input.remove(function (node) {
                if (node.key && node.key.indexOf('//') >= 0) {
                    return node;
                }
            });
        };

        /**
         * allowed format: {name: '', dsl: {}}
         */
        var validateInputContent = function (input) {
            if (!input.name) {
                that.log.error(5792, 'Wrong input format. Missing name.', su.ellipsis(su.pretty(input, 0), 30));
                return false;
            }
            if (u.type(input.name) !== 'string') {
                that.log.error(3466, 'Wrong input name format. Must be text.', su.ellipsis(su.pretty(input, 0), 30));
                return false;
            }
            if (!input.dsl) {
                that.log.error(3012, 'Wrong input format. Missing dsl.', su.ellipsis(su.pretty(input, 0), 30));
                return false;
            }
            if (u.type(input.dsl) !== 'object') {
                that.log.error(2980, 'Wrong input format. Dsl must be an object.', su.ellipsis(su.pretty(input, 0), 30));
                return false;
            }

            return true;
        };

        parseInput();

        return this;
    }
};
