module.exports={
    init:function(){
        let add = require('./add.js')
        $('#content').off('click').on('click',function(){
            add.init({
                title:111,
                data:{
                    content:'测试内容333'
                }
            })
        })
    }
}