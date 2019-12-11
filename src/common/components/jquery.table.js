"use strict";
;(function ($, window, document, undefined) {
    var lastSel;

    var defaults = {
        // url: urls,                 //请求地址
        datatype: 'json',          // 访问方式  json：请求服务器数据    local：本地数据
        // data: tdDataInfo,   //本地数据
        // colNames: formTit,     //表头名字
        // colModel: formField,   //表字段
        rowNum: 100,
        rowList: [100, 200, 500, 1000, 2000],
        pager: 'grid-pager',    //分页id
        sortname: 'create_date',
        mtype: "post",        //  post   get   请求
        viewrecords: true,
        postData: {},
        sortorder: "desc",
        autowidth: true,
        altRows: true,
        footerrow: false,
        userDataOnFooter: false, // 显示底部
        //单元格编辑
        cellEdit: false,   // 单元格编辑   true:可编辑    false:不可编辑
        cellsubmit: 'clientArray',
        cellurl: '',
        editurl: null,
        prmNames: {page: "pageNo", rows: "pageSize"},
        rownumbers: true, //如果为ture则会在表格左边新增一列，显示行顺序号，从1开始递增。此列名为'rn'
        shrinkToFit: false, //表格宽度  true 初始化列宽度  false 列宽度使用colModel指定的宽度
        multiselect: false,   //关闭全选
        multiboxonly: false, //为ture时只有选择checkbox才会起作用
        //表格还在完成后执行

        // 选择数据
        onSelectAll: null,
        // 单元格选择
        // onCellSelect: null,
        // onSelectRow: null,

        // 子表
        subGrid: false,
        subGridRowExpanded: null,
        beforeSubmitCell: null,
        afterSubmitCell: null,
        onCellSelect: function (rowid) {
        },
        loadComplete: function (xhr) {
            //admin  放开权限
            // if(common.mainId != 'admin'){
            //     if(common.showButton){
            //         $.each(common.showButton,function(i,v){
            //             var dom = '[id=' + v.resourceId + ']'
            //             $(dom).show();
            //         });
            //     }
            // }
            // //合并表格出现的bug处理
            // var thvDom = $('.jqg-first-row-header');
            // if(thvDom.length > 0){
            //     thvDom.closest('.ui-jqgrid-hbox').addClass('tableMergeHead');
            //     $('.trasen-con-box .ui-jqgrid .ui-jqgrid-bdiv').css({
            //         'top':'63px',
            //         'padding-top':'0'
            //     });
            // }
            // var theadSt = $('.jqg-third-row-header.jqg-second-row-header');
            // if(theadSt.length == 1){
            //     theadSt.remove();
            // }
            // $('.ui-jqgrid-sdiv-box').scroll(function(){
            //     var l = $(this).scrollLeft();
            //     var w = $(this).find('.ui-jqgrid-hbox').width();
            //     var $box = $(this).closest('.ui-jqgrid-view');
            //     $box.find('.ui-jqgrid-bdiv').scrollLeft(l);
            // })

        },
        gridComplete: function () {
        },
        localReader: {
            root: "data",
            page: "page",
            total: "total",
            records: "records"
        },
        jsonReader: {
            root: "rows",
            page: "pageNo",
            total: "pageCount",
            records: "totalCount",
            repeatitems: false,
            userdata: "rows"
        },
        queryFormId: null,
        buidQueryParams: function () {
        },
        //双击
        ondblClickRow: function () {

        },
        //表格加载失败
        loadError: function () {

        },
        //选中行后
        onSelectRow: function (rowId) {
        },
        afterEditCell: function () {
        },
        afterSaveCell: function () {
        },
        beforeSaveCell: function () {
        },
        //当插入每行时触发
        afterInsertRow: function () {
        },
        //当用户点击行在未选择此行时触发
        beforeSelectRow: function () {

        }
    }

    var trasenTable = function (tableId, options) {
        this.tableId = tableId;
        this.options = $.extend({}, defaults, options);
        this.oTable = null;
        this.init();
    }

    //隐藏列
    trasenTable.prototype.hideCol = function (colname) {
        var self = this;
        return self.oTable.setGridParam().hideCol(colname).trigger("reloadGrid");
    }

    //显示列
    trasenTable.prototype.showCol = function (colname) {
        var self = this;
        return self.oTable.setGridParam().showCol(colname).trigger("reloadGrid");
    }

    //获取colmodle
    trasenTable.prototype.colmodle = function () {
        var self = this;
        return self.oTable.jqGrid('getGridParam', 'colModel');
    }

    //获取colmodle
    trasenTable.prototype.colname = function () {
        var self = this;
        return self.oTable.jqGrid('getGridParam', 'colNames');
    }

    //选中行
    trasenTable.prototype.setSelection = function (rowid) {
        var self = this;
        return self.oTable.jqGrid('setSelection', rowid);
    }

    //选中行id
    trasenTable.prototype.getSelectRowId = function () {
        var self = this;
        return self.oTable.getGridParam('selrow');
    }

    //获取所有选中行id
    trasenTable.prototype.getSelectAllRowIDs = function () {
        var self = this;
        return self.oTable.getGridParam('selarrrow');
    }

    //取表格所有行id
    trasenTable.prototype.getDataIDs = function () {
        var self = this;
        return self.oTable.jqGrid("getDataIDs");
    }

    //选中行数据
    trasenTable.prototype.getSelectRowData = function () {
        var self = this;
        var id = self.oTable.getGridParam('selrow');
        return self.getRowData(id);
    }

    //选中行原始数据
    trasenTable.prototype.getSourceRowData = function (id) {
        var self = this;
        var row = self.oTable.jqGrid('getGridParam', 'userData');
        var id = id || self.oTable.getGridParam('selrow');
        var data = null;
        for (var i in row) {
            if (row[i].id === id) {
                data = row[i]
            } else if (id - 1 == i) {
                data = row[i]
            }
        }
        return data;
    }

    //表格原始数据
    trasenTable.prototype.getSourceData = function () {
        var self = this;
        return self.oTable.jqGrid('getGridParam', 'userData');
    }

    //所有选中行数据
    trasenTable.prototype.getSelectAllRowData = function () {
        var self = this;
        var ids = self.oTable.getGridParam('selarrrow');
        var datas = [];
        for (var i in ids) {
            datas.push(self.getRowData(ids[i]));
        }
        return datas;
    }
    //所有选中行原始数据
    trasenTable.prototype.getSourceAllRowData = function () {
        var self = this;
        var ids = self.oTable.getGridParam('selarrrow');
        var datas = [];
        for (var i in ids) {
            datas.push(self.getSourceData(ids[i]));
        }
        return datas;
    }

    //获取行数据  传行id
    trasenTable.prototype.getRowData = function (id) {
        var self = this;
        return self.oTable.jqGrid("getRowData", id);
    }
    // 获取所有本地数据
    trasenTable.prototype.getLocalAllData = function () {
        var self = this;
        //获取显示配置记录数量
        var rowNum = self.oTable.jqGrid('getGridParam', 'rowNum');
        //获取查询得到的总记录数量
        var total = self.oTable.jqGrid('getGridParam', 'records');
        //设置rowNum为总记录数量并且刷新jqGrid，使所有记录现出来调用getRowData方法才能获取到所有数据
        self.oTable.jqGrid('setGridParam', {rowNum: total}).trigger('reloadGrid');
        var rowIds = self.oTable.jqGrid("getDataIDs");
        var rows = [];
        for (var i in rowIds) {
            var data = self.oTable.jqGrid("getRowData", rowIds[i]);
            if (!data.rowid) {
                data.rowid = rowIds[i];
            }
            rows.push(data);
        }
        //还原原来显示的记录数量
        self.oTable.jqGrid('setGridParam', {rowNum: rowNum}).trigger('reloadGrid');
        return rows;
    }

    //所有数据
    trasenTable.prototype.getAllData = function () {
        var self = this;
        var rowIds = self.oTable.jqGrid("getDataIDs");
        var datas = [];
        for (var i in rowIds) {
            var data = self.oTable.jqGrid("getRowData", rowIds[i]);
            if (!data.rowid) {
                data.rowid = rowIds[i];
            }
            datas.push(data);
        }
        return datas;
    }

    //返回请求的参数信息
    trasenTable.prototype.getGridParamByKey = function (key) {
        var self = this;
        return self.oTable.getGridParam(key);
    }

    //设置选中行
    trasenTable.prototype.setSelection = function (rowid) {
        var self = this;
        return self.oTable.jqGrid("setSelection", rowid);
    }

    //添加一行
    trasenTable.prototype.addRowData = function (rowid, data, w) {
        var self = this;
        return self.oTable.jqGrid("addRowData", rowid, data, w);
    }

    //保存修改行
    trasenTable.prototype.saveRow = function (rowid) {
        var self = this;
        return self.oTable.jqGrid("saveRow", rowid);
    }

    //保存表格
    trasenTable.prototype.saveRowAll = function () {
        var self = this;
        var rowIds = self.oTable.jqGrid("getDataIDs");
        for (var i in rowIds) {
            var nn = self.oTable.jqGrid("saveRow", rowIds[i]);
        }
        // return true;
    }

    //删除行
    trasenTable.prototype.delRowData = function (rowid) {
        var self = this;
        return self.oTable.jqGrid("delRowData", rowid);
    }

    //t添加行
    trasenTable.prototype.addRow = function (rowid, data) {
        var self = this;
        return self.oTable.jqGrid("addRow");
    }

    //某一单元格设置为编辑状态
    trasenTable.prototype.editCell = function (iRow, iCol) {
        var self = this;
        return self.oTable.jqGrid("editCell", iRow, iCol, true);
    }

    //设置单元格value
    trasenTable.prototype.setCell = function (rowId, cellname, value) {
        var self = this;
        return self.oTable.jqGrid("setCell", rowId, cellname, value);
    }

    //取单元格value
    trasenTable.prototype.getCell = function (rowId, iCol) {
        var self = this;
        return self.oTable.jqGrid("getCell", rowId, iCol);
    }

    //设置单元格编辑状态切换
    trasenTable.prototype.setColProp = function (rowid, name, type) {
        var self = this;
        self.oTable.setColProp(name, {editable: type});
        self.oTable.jqGrid("setColProp", name, {editable: type});
        // self.oTable.jqGrid("editRow",rowid,type);
    }

    //设置行编辑状态
    trasenTable.prototype.editRowT = function (rowid) {
        var self = this;
        self.oTable.jqGrid("editRow", rowid, true);
    }

    //刷新本地表格数据，不请求服务器
    trasenTable.prototype.staticrefresh = function (data) {
        var self = this;
        self.oTable.jqGrid('clearGridData');
        self.oTable.jqGrid('setGridParam', {
            datatype: 'local',
            data: data,
            page: 1
        }).trigger("reloadGrid");
    }


    trasenTable.prototype.refresh = function () {
        var self = this;
        var pData = self.oTable.getGridParam("postData");
        if (typeof pData == 'string') {
            pData = JSON.parse(pData)
        }
        var queryParams = {};
        // queryFormId不为空直接获取表单数据作为查询条件
        if (self.queryFormId) {
            var form = $("#" + this.queryFormId);
            var params = form.serializeArray();
            params.map(function (item) {
                // if (item.value) {
                queryParams[item.name] = item.value;
                // }
                return item;
            });
        } else {
            queryParams = self.buidQueryParams();
        }
        var postData = $.extend(true, pData, queryParams);
        if (self.options.ajaxGridOptions) {
            if (self.options.ajaxGridOptions.contentType == 'application/json; charset=utf-8') {
                postData = postData
            }
        }

        self.oTable.setGridParam({
            page: 1,
            postData: postData
        })
        self.oTable.trigger("reloadGrid");
    }

    trasenTable.prototype.init = function () {
        var self = this;
        var options = self.options;
        var gridComplete = self.options.gridComplete
        var tableId = self.tableId;
        options.ajaxGridOptions = options.ajaxGridOptions || {contentType: 'application/x-www-form-urlencoded; charset=UTF-8'};
        options.ajaxGridOptions = options.serializeGridData || null;
        //{
        //    url: options.url,
        //    datatype: options.datatype,
        //    // colNames: options.colNames,
        //    data:options.data,
        //
        //    footerrow: options.footerrow,
        //    userDataOnFooter: options.userDataOnFooter, // 底部
        //    ajaxGridOptions: options.ajaxGridOptions || { contentType:'application/x-www-form-urlencoded; charset=UTF-8'},
        //    serializeGridData: options.serializeGridData || null,
        //    colModel: options.colModel,
        //    colNames: options.colNames,
        //    rowNum: options.rowNum,
        //    postData: options.postData,
        //    rowList: options.rowList,
        //    pager: options.pager,
        //    width: options.width || '',
        //    sortname: options.sortname,
        //    mtype: options.mtype,
        //    viewrecords: options.viewrecords,
        //    sortorder: options.sortorder,
        //    autowidth: options.autowidth,
        //    altRows: options.altRows,
        //    cellEdit: options.cellEdit,
        //    cellsubmit: options.cellsubmit,
        //    cellurl: options.cellurl,
        //    editurl: options.editurl,
        //    prmNames: options.prmNames,
        //    rownumbers: options.rownumbers,
        //    shrinkToFit: options.shrinkToFit,
        //    multiselect: options.multiselect,
        //    multiboxonly: options.multiboxonly,
        //    loadComplete: options.loadComplete,
        //    gridComplete: options.gridComplete,
        //    afterInsertRow: options.afterInsertRow,
        //    beforeSelectRow: options.beforeSelectRow,
        //    ondblClickRow: options.ondblClickRow,
        //    onSortCol: options.onSortCol, //当点击排序列但是数据还未进行变化时触发
        //    // 字表
        //    subGrid: options.subGrid,
        //    subGridRowExpanded: options.subGridRowExpanded,
        //    beforeSubmitCell: options.beforeSubmitCell,
        //    afterSubmitCell: options.afterSubmitCell,
        //
        //    // 选择数据
        //    onSelectAll: options.onSelectAll,
        //    onSelectRow: options.onSelectRow,
        //
        //    loadError: options.loadError,
        //    jsonReader: options.jsonReader,
        //    // 本地分页
        //    localReader: options.localReader,
        //    // onSelectRow: options.onSelectRow,
        //    afterEditCell:options.afterEditCell,
        //    afterSaveCell:options.afterSaveCell,
        //    onCellSelect: options.onCellSelect,
        //
        //    beforeSaveCell:options.beforeSaveCell
        //};
        options.gridComplete = function () {
            if (self.options.noMessageImageUrl != undefined) {
                var that = this;
                var imgU = self.options.noMessageImageUrl || '/public/static/images/table_no_message.png'
                var text = '空空如也' || self.options.noMessageText
                var rowNum = parseInt($(that).getGridParam('records'), 10) || (options.data&&options.data.length) || 0;
                if (rowNum == 0) {
                    if($(this).closest('.ui-jqgrid-bdiv').find('.table_no_message').length){

                    }else{
                        $(this).closest('.ui-jqgrid-bdiv').find('.table_no_message').remove()
                        $(this).closest('.ui-jqgrid-bdiv').children('div').after('<div class="table_no_message">' +
                            '<div><p>' + text + '</p><img src="' + imgU + '" ></div></div>')
                    }

                } else {
                    $(this).closest('.ui-jqgrid-bdiv').find('.table_no_message').remove()
                }
            }
            gridComplete && gridComplete.call($('#' + tableId + '')[0])
        }
        var _table = $('#' + tableId + '').jqGrid(options);

        self.oTable = _table;
        self.buidQueryParams = self.options.buidQueryParams;
        self.queryFormId = options.queryFormId;
    }
    window.trasenTable = trasenTable;
    $.trasenTable = trasenTable;
})(jQuery, window, document);
