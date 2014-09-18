var Metadata = require('./metadata');

/**
 * Merges inputDsl into mainDsl.
 * @param dslParam Destination dsl.
 * @param inputParam Source dsl. Has DslInput type.
 */
module.exports = function(dslParam, inputParam){
    'use strict';
    var pub = {}, priv = {};
    priv.input = dslParam;
    priv.dsl = inputParam;
    pub.merge = function(){
        priv
    };
};

