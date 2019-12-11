module.exports={
    init:function(){

        new $.trasenTable('grid-test',{
            datatype:'local',
            pager:'grid-pager',
            data:[],
            colModel: [
                {label: '编号', width: 80, name: 'issueNo', index:'p.issue_no'},
                {label: '医院名称', width: 200, name: 'customerName',index:'p.customer_name', classes: 'workorderProblemsSee'},
                {label: '产品', width: 60, name: 'productName',index:'p.product_name'},
                {label: '主题', width: 180, name: 'title',index:'p.title',classes:'workorderProblemsSee'},
                {label: '状态', width: 90, name: 'issueStatusName',index:'p.internal_issue_status'},
                {label: '综合得分', width: 60, name:'compositeScores',sortable:false}
            ]
        })
    }
}