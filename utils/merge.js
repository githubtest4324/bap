var Jef = require('json-easy-filter');

module.exports = function () {
    'use strict';

    var Change = function (pathParam, valueParam) {
        this.path = pathParam;
        this.value = valueParam;

        return this;
    };

    var callback;
    var input = [];
    for(var i = 0; i<arguments.length; i++){
        var arg = arguments[i];
        if(typeof arg==='function'){
            callback = arg;
        } else if(arg instanceof Jef){
            input.push(arg);
        } else {
            input.push(new Jef(arg));
        }
    }
    
    var mergeTwo = function (dest, src) {
        debugger;
        var changes = [];
        src.filter(function (node) {
            if (node.isRoot) {
                return;
            }
            if (node.skip) {
                return;
            }
            if (!dest.get(node.path)) {
                var change = new Change(node.path, node.value);
                changes.push(change);
                node.filter(function (child) {
                    child.skip = true;
                });
            }
        });
        changes.forEach(function (item) {
            var srcNode = src.get(item.path);
            var destNode = dest.get(srcNode.parent.path);
            destNode.value[srcNode.key] = srcNode.value;
        });
    };
    
    var res = new Jef({});
    for(i = 0; i<input.length; i++){
        mergeTwo(res, input[i]);
        res.refresh();
    }
    return res;
};
