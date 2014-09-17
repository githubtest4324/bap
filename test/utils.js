var Utils = function(){
    'use strict';
    var pub = {};
    pub.printArray = function (arr) {
        var i = 0;
        arr.forEach(function (item) {
            if (i < arr.length - 1) {
                console.log('"' + item + '",');
            } else {
                console.log('"' + item + '"');
            }
            i++;
        });
    };
    
    return pub;
};

module.exports = new Utils();