var BaseGen = require('../index').BaseGen;
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var filendir = require('filendir');

var name = 'entityJava';
module.exports = function () {
    'use strict';
    this.name = name;
    this.version = '0.0.1';
    var template = ejs.compile(fs.readFileSync(__dirname + '/entity.bliss', 'utf8'), {
        open : '|',
        close : '|'
    });
    var that = this;
    this.init = function (bap) {
        this.config = bap.config.get(name);
        this.bap = bap;
    };
    this.model = function () {
    };
    this.generate = function () {
        for ( var qn in this.bap.model.types) {
            var entity = this.bap.model.types[qn];
            if (entity.dsl.value.type === 'entity') {
//                genent(entity);
            }
        }
    };

    var genent = function (entity) {
        var javaEntityModel = templateModel();
        var ent = template(javaEntityModel);
        var pth = path.normalize(path.join(that.bap.config.value.rootFolder, that.config.value.sourceDir, entity.qualifiedName.replace('.', '/') + ".java"));
        if (pth.indexOf('/') !== 0) {
            pth = path.join(process.cwd(), pth);
        }
        filendir.ws(pth, ent);
        that.bap.log.info(3836, 'Generated ' + pth, entity.dsl.meta.origins.toString());
    };
    
    /**
     * Creates the model used later by java entity template to generate the file.
     * Format: TODO
     */
    var templateModel = function(){
        
    };
};
module.exports.prototype = new BaseGen();
