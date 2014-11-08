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
                        },
                        p7 : {
                            type : {
                                name : 'E4',
                                properties : {
                                    p7_E4 : 'str'
                                }
                            }
                        },
                        p8 : {
                            type : {
                                properties : {
                                    p8_p1 : 'str'
                                }
                            }
                        },
                        p9 : {
                            type : {
                                list : {
                                    name : 'E5',
                                    properties : {
                                        p1 : 'str'
                                    }
                                }
                            }

                        },
                        p10 : {
                            type : {
                                list : {
                                    properties : {
                                        p1 : 'str'
                                    }
                                }
                            }

                        },
                        p11 : {
                            list : {
                                name : 'E6',
                                properties : {
                                    p1 : 'str'
                                }
                            }
                        },
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
                        type : '[str]'
                    }
                },
                Page1 : {
                    type : 'page',
                    model : {
                        model : true,
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
