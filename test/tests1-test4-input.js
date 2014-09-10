module.exports = {
    ns1 : {
        e1 : {
            type : 'entity',
            properties : {
                f1 : 'str',
                f2 : 'e2',
                f3 : {
                    type : 'str',
                    readOnly : true
                },
                f4 : {
                    type : 'list',
                    itemType : 'e3'
                },
                f5 : {
                    type : 'entity',
                    properties : {
                        f51 : 'str',
                        f52 : {
                            type : 'str',
                            readOnly : true
                        },
                        f53 : {
                            type : 'list',
                            itemType : 'e3'
                        },
                        f54 : {
                            type: 'entity',
                            name: 'F54Ent',
                            properties: {
                                f541: 'str'
                            }
                        },
                        f55 : {
                            type: 'entity',
                            name: 'e1_f5',
                            properties: {
                                f541: 'str'
                            }
                        },
                        f56 : {
                            type: 'entity',
                            properties: {
                                f541: 'str'
                            }
                        }                    }
                }
            }
        }
    }
};