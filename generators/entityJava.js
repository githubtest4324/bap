var BaseGen = require('../index').BaseGen;
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var filendir = require('filendir');
var sprintf = require('sprintf-js').sprintf;

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
                genent(entity);
            }
        }
    };

    var genent = function (entity) {
        var javaEntityModel = templateModel();
        console.log(JSON.stringify(javaEntityModel, null, 4));
        //        var ent = template(javaEntityModel);
        //        var pth = path.normalize(path.join(that.bap.config.value.rootFolder, that.config.value.sourceDir, entity.qualifiedName.replace('.', '/') + ".java"));
        //        if (pth.indexOf('/') !== 0) {
        //            pth = path.join(process.cwd(), pth);
        //        }
        //        filendir.ws(pth, ent);
        //        that.bap.log.info(3836, 'Generated ' + pth, entity.dsl.meta.origins.toString());
    };

    /**
     * Creates the model used later by java entity template to generate the file.
     * Format: TODO
     */
    var templateModel = function () {
        var entities = findEntities();
        var res = [];
        for(var qn in entities){
            var ent = entities[qn];
            res.push(entityTemplateModel(ent));
        }
        return res;
    };
    
    var entityTemplateModel = function(ent){
        var res = {
                qualifiedName: ent.qualifiedName,
                imports: [],
                fields: []
        
        };

        var propName, prop;
        // imports
        var hasList = false;
        for(propName in ent.properties){
            prop = ent.properties[propName];
            var baseType = that.bap.model.baseType(prop);
            if(that.bap.model.isList(prop)){
                hasList = true;
            }
            if(!that.bap.model.isPrimitive(baseType)){
                res.imports.push(baseType);
            }
        }
        if(hasList){
            res.imports.push('java.utils.List');
        }
        
        // fields
        for(propName in ent.properties){
            prop = ent.properties[propName];
            res.fields.push({
                name: propName,
                type: javaType(prop)
            });
        }
        return res;
    };

    var javaType = function(prop){
        var primitiveMap = {
                str: 'String',
                int: 'int',
                num: 'BigDecimal',
                double: 'double',
                float: 'float',
                bool: 'boolean',
                decimal: 'BigDecimal',
                date: 'Date',
                time: 'Date',
                datetime: 'Date'
        };
        var baseType = that.bap.model.baseType(prop);
        var javaBaseType;
        if(that.bap.model.isPrimitive(baseType)){
            javaBaseType = primitiveMap[baseType];
        } else{
            javaBaseType = baseType;
        }
        
        if(that.bap.model.isList(prop)){
            return sprintf("List<%s>", javaBaseType);
        } else{
            return javaBaseType;
        }
    };
    
    var findEntities = function () {
        var res = {};
        that.bap.dsl.filter(function (node) {
            var ent = node.meta.modelEntity;
            if (ent && node.has('type') && node.get('type').value === 'entity') {
                addEntity(res, ent);
            }
        });
        return res;
    };
    var addEntity = function (res, ent) {
        if (res[ent.qualifiedName]) {
            return;
        }
        res[ent.qualifiedName] = ent;
        //        console.log(ent.qualifiedName);
        for ( var propName in ent.properties) {
            var prop = ent.properties[propName];
            var baseType = that.bap.model.baseType(prop);
            if (!that.bap.model.isPrimitive(baseType)) {
                var propEnt = that.bap.model.types[baseType];
                addEntity(res, propEnt);
            }
        }
    };
};
module.exports.prototype = new BaseGen();
