var Generator = require('../index').Generator;
var name = 'restJava';
var generator = function(){
    'use strict';
    return Generator.extend({
        name: name,
        version : '0.0.1',
        dependencies : [],
        init : function (bap) {
            this._super(bap);
            this.config = bap.config.get(name);
        },
        model : function () {
        },
        generate : function () {

        }
    });
};

module.exports = generator();
