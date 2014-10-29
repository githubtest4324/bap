module.exports = [
    {
        name : 'f1',
        dsl : {
            ns1 : {
                E1 : {
                    model : true,
                    type : 'entity',
                    properties : {
                        p1 : 'str',
                        p2 : {
                            properties : {
                                p2_1 : 'str'
                            }
                        },
                        p3 : '[int]',
                        p4 : {
                            type : 'str'
                        },
                        p5 : {
                            type : '[int]'
                        },
                        p6 : {
                            name : 'E3',
                            properties : {
                                p3 : 'str'
                            }
                        }
                    }
                },
                E2 : {
                    model : true,
                    type : 2,
                    properties : 3
                },
                Rest1 : {
                    type : 'rest',
                    input : {
                        model : true,
                        name : 'Rest1Request',
                        type : '[E1]',
                    },
                    output : {
                        model : true,
                        type : 'str'
                    }
                },
                Rest2 : {
                    type : 'rest',
                    input : {
                        model : true,
                        properties : {
                            p4 : '[E1]',
                            p5 : 'str'
                        }
                    },
                    output : {
                        model : true,
                        type : '[str]',
                    }
                },
                Page1 : {
                    type : 'page',
                    model : {
                        mdodel : true,
                        properties : {
                            p5 : 'str',
                            p6 : {
                                properties : {
                                    p7 : 'E1',
                                    p8 : 'str'
                                }
                            }
                        }

                    }
                }
            }

        }
    }
];
