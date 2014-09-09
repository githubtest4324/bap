var RestProperty = function(parentParam){
    'use strict';
    /**
     * Any primitive or custom type.
     */
    this.$type = undefined;
    /**
     * Used in case this.type is 'list'. May be any primitive or custom type.
     */
    this.$itemType = undefined;

    this.$parent = parentParam;
};

module.exports = function () {
    'use strict';
    this.$type = 'rest';
    this.$name = undefined;
    this.$parent = undefined;
    this.$input = new RestProperty(this);
    this.$output = new RestProperty(this);

    this.getNamespace = function () {
        return this.$parent.$namespace;
    };
};

