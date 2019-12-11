// module.exports = {
//     init: function (opt) {
//         let html = require('./add.html')
//         $('body').append(html + opt.title)
//     }
// }

define(function (require, exports, module) {
    exports.init = function(opt){
        let html = require('./add.html')
        $('body').append(html + opt.title)
    }
})

