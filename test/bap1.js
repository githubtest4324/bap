module.exports = {
    "ecom": {
        "customers": {
            "Customer": {
                "type": "entity",
                "properties": {
                    "code": {
                    	"type": "string"
                    }
                }
            }
        },
        "regional": {
            "Country": {
                "type": "entity",
                "properties": {
                    "name": "str"
                }
            },
            "City": {
                "type": "entity",
                "properties": {
                    "name": "str",
                    "code": {
                        "type": "str",
                        "translate": "code2"
                    },
                    "zipCodes": {
                        "type": "list",
                        "itemType": "str"
                    }
                }
            }
        }
    },
    "Request": {
        "type": "entity",
        "properties": {
            "name": "str",
            "code": {
                "type": "str",
                "translate": "code2"
            },
            "customer": "Customer"
        }
    }
}