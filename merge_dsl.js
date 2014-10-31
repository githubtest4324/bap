var Meta = require('./metadata');
var merge = require('./utils/merge');

/**
 * Merges input into main dsl.
 * 
 * @param dsl
 *            Main dsl.
 * @param inputDsl
 *            Source dsl. An array of DslInput type.
 */
module.exports = function (dsl, inputDsl) {
    'use strict';
    var mergeInput = [];

    // add destination
    mergeInput.push(dsl);
    
    // add sources
    inputDsl.forEach(function (input) {
        var source = input.dsl;
        mergeInput.push(source);
        source.origin = input.fileName;
    });
    
    // add callback
    mergeInput.push(function(context){
        context.useDefault();
        var dst = dsl.get(context.src.path);
        if(!dst.meta){
            dst.meta = new Meta();
        }
        dst.meta.origins.push(context.src.root.origin);
    });

    merge.apply(this, mergeInput);
    dsl.meta = new Meta();
};
