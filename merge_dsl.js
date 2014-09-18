var Metadata = require('./metadata');

/**
 * Merges inputDsl into mainDsl.
 * @param mainDslParam Destination del.
 * @param inputDslParam Source dsl. Has DslInput type.
 */
module.exports = function(mainDslParam, inputDslParam){
    'use strict';
    var pub = {}, priv = {};
    priv.mainDsl = mainDslParam;
    priv.inputDsl = inputDslParam;
    pub.merge = function(){
        TODO aici am ramas
    };
};

