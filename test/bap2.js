module.exports = {
	"ecom" : {
		"customers" : {
			"Test" : {
				"type" : "entity",
				"properties" : {
					"code" : {
						"type" : "string"
					}
				}
			}
		},
		"ns1" : {
			"Ent1" : {
				"type" : "entity",
				"properties" : {

				}
			}
		}
	},

	"ns2" : {
		"Ent2" : {
			"type" : "entity",
			"properties" : {
				"field1" : "string"
			}
		}
	},
	"Request2" : {
		"type" : "entity",
		"properties" : {
			"name" : "str",
			"code" : {
				"type" : "str",
				"translate" : "code2"
			},
			"customer" : "Customer"
		}
	}

};