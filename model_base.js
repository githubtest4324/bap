
module.exports = function(bap){
    'use strict';
    var u = require('./utils/utils');
    this.types = {};

    this.isPrimitive = function (type) {
        return u.constants.primitives.indexOf(type) !== -1;
    };
    
    this.isList = function(prop){
        if(!validateProperty(prop)){
            return undefined;
        }
        if(prop.type instanceof Array){
            return prop.type[0];
        } else{
            return null;
        }
    };
    
    /**
     * If 'prop' is list, returns list's type otherwise returns prop's type. 
     */
    this.baseType = function(prop){
        if(!validateProperty(prop)){
            return undefined;
        }
        var listType = this.isList(prop);
        return listType?listType:prop.type;
    };
    
    /**
     * The parent entity of 'prop'.
     */
    this.propEntity = function(prop){
        if(!validateProperty(prop)){
            return undefined;
        }
        var dsl = prop.dsl;
        while(!dsl.isRoot){
            if(dsl.meta.modelEntity){
                return dsl.meta.modelEntity;
            }
            dsl = dsl.parent;
        }
        bap.log.error(8797, "Invalid dsl. Missing parent entity.", prop.dsl.meta.origins.toString(), prop.dsl.path);
        return undefined;
    };

    this.propName = function(prop){
        if(!validateProperty(prop)){
            return undefined;
        }
        return prop.dsl.key;
    };
    
    var validateProperty = function(prop){
        if(prop.dsl && prop.dsl.meta && prop.dsl.meta.modelProperty){
            return true;
        } else{
            var origin1, origin2;
            if(prop.dsl){
                origin1 = prop.dsl.meta.origins.toString();
                origin2 = prop.dsl.path;
            }
            bap.log.error(5593, "Received object is not a model property.", origin1, origin2);
            return false;
        }
    };
};