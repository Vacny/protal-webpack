"use strict";
; (function ($, window, document, undefined) {

    var defaults = {
    }
    var SelectPullDownData;//数据存储
    var pubdata = {};
    var focusVal = '';
    var searValue = '';
    var SelectPullData = [];
    var opts = [];

    var selectPlug = function (dom, options) {
        this.init(dom, options);
        opts = options;
    }

    selectPlug.prototype.init = function (dom, options) {
        var that = this;
        var self = dom;
        var text = '',
            placeholder = '--请选择--',
            textname = options.textName || '',
            valname = options.valName || '';
        var nameid = options.nameId || '';
        var valid = options.valid || '';
        var defaultVal = options.defaultVal || ''; // 默认显示值
        var defaultCode = options.defaultCode || ''; // 默认显示值对应的code/id
        var verfiy = $(dom).attr('lay-verify') || options.required || ''; // layui 验证
        var readonly = '',
            disabled = '';
        pubdata[dom] = options;
        pubdata.choice = [];
        var html = '';
        if (options.disabled) {
            readonly = 'readonly';
            disabled = 'disabled';
        }
        if(options.choice === true){
            var _hm = '';
            if(defaultVal){
                var _dVal = defaultVal.split(',');
                var _dCode = defaultCode.split(',');
                for(var i in _dVal){
                    // _hm += '<span class="choice">' + _dVal[i] + ' <a href="javascript:;" data-name="smallSelectNameId" data-value="smallSelectvalId" data-text="' + _dVal[i] + '" data-val="' + _dCode[i] + '" id="choiceCloseTag"><i class="fa fa-times-circle" aria-hidden="true"></i></a></span>';
                    _hm += '<span class="choice">' + _dVal[i] + ' <a href="javascript:;" data-name="' + options.inpTextName + '" data-value="' + options.inpValName + '" data-text="' + _dVal[i] + '" data-val="' + _dCode[i] + '" id="choiceCloseTag"><i class="fa fa-times-circle" aria-hidden="true"></i></a></span>';
                }
            }
            html = '<div class="tra-lay-select-title pubSelectPesonBox"><div class="choiceBox row" id="SelectPullDownChoiceBox"><input type="text" readonly data-key="' + dom + '"  lay-disabled="' + disabled + '" class="SelectPullDown">' + _hm + '</div><input type="hidden"  autocomplete="off" data-key="' + dom + '" placeholder="' + placeholder + '"  value="' + defaultVal + '" name="' + options.inpTextName + '" class="layui-input SelectPullDown" id="' + nameid + '" lay-verify="' + verfiy + '"><input type="hidden" placeholder="" value="' + defaultCode + '"  autocomplete="off" name="' + options.inpValName + '" id="' + valid + '"></div>';
        }else{
            if(options.searchType == 'local' && defaultCode && !defaultVal){
                for(var i = 0;i<options.data.length;i++){
                    if(options.data[i][valname] == defaultCode){
                        defaultVal = options.data[i][textname]
                    }
                }
            }
            html = '<div class="tra-lay-select-title pubSelectPesonBox">' +
                '<input type="text"  autocomplete="off" data-key="' + dom + '" focusVal="'+ defaultVal +'" placeholder="' + placeholder + '" value="' + defaultVal + '" name="' + options.inpTextName + '" class="layui-input SelectPullDown" '+ (nameid ? 'id="'+ nameid + '"': '')+' ' + readonly + ' lay-disabled="' + disabled + '" lay-verify="' + verfiy + '">' +
                '<input type="hidden" placeholder=""  autocomplete="off" name="' + options.inpValName + '" value="' + defaultCode  + '" '+ (valid ? 'id="'+ valid + '"': '')+'><i class="icon"></i></div>';
        }

        $(self).html(html);
        $(dom).attr('lay-verify',false);
        // if(defaultVal){
        //     $('[name="' + options.inpTextName + '"]').val(defaultVal);
        //     $('[name="' + options.inpValName + '"]').val(defaultCode);
        // }
        if(options.callback){
            options.callback(false);
        }
        button(dom, options);
    }


    //数据请求
    var ajaxSend = function(opt){
        var data = opt.data;
        // console.log(opt)
        data.select = 1;
        if(opt.contentType){
            $.ajax({
                type:opt.datatype || 'post',
                url:opt.url,
                contentType:opt.contentType,
                data:data,
                success:function (res) {
                    if(typeof res == 'string'){
                        res = JSON.parse(res);
                    }
                    opt.success(res);
                }
            });
        }else{
            $.ajax({
                type:opt.datatype || 'post',
                url:opt.url,
                data:data,
                success:function (res) {
                    if(typeof res == 'string'){
                        res = JSON.parse(res);
                    }
                    opt.success(res);
                }
            });
        }
    }

    var button = function(dom, options){

        //加载下拉框
        $('body').off('click','.SelectPullDown').on('click','.SelectPullDown',function(e){
            e.stopPropagation();
            var disabled = $(this).attr('lay-disabled'); // 禁用
            if(disabled){
                return false
            }
            $('#pubSelectPesonDl, #treeSelectBox').remove();
            $('.SelectPullDown').removeClass('SelectPullDownId');

            var $box = $(this).closest('.pubSelectPesonBox');
            var _left = $(this).offset().left;
            var _top = $(this).offset().top;
            var h = $(window).height();
            var w = $box.width();
            var tb = '';
            var keys = $(this).attr('data-key');
            var options = pubdata[keys];
            focusVal = $(this).val();
            pubdata.selDatas = [];
            pubdata.choice = [];
            pubdata.keys = keys;
            pubdata.pagetype = true;
            if($('#pubSelectPesonDl').length > 0){
                return false
            }
            $('.SelectPullDown').removeClass('SelectPullDownId');
            // $(this).attr('id','SelectPullDown');
            $(this).addClass('SelectPullDownId');
            if(w < 200){
                w = 200;
            }
            if(_top < h - 200){
                if(options.choice === true){
                    _top = _top + 15;
                }
                tb = 'top:' + _top + 'px;';
            }else{
                var _w = h - _top + 235;
                tb = 'bottom:' + _w + 'px;top:auto;';
            }
            $('#pubSelectPesonDl').remove();
            var data = {}
            if(options.data){
                data = options.data;
            }
            if (options.pageParamter){
                data[options.pageParamter] = 1
            } else {
                data.pageNo = 1;
            }
            var htmls = '<div class="tra-lay-select-dl" id="pubSelectPesonDl" page="0" style="width:' + w + 'px;left:' + _left +'px;' + tb +'">\
                            <dl class="layui-anim layui-anim-upbit" style="" >\
                                <dd lay-value="" class="layui-select-tips ">加载中.....</dd>\
                            </dl>\
                        </div>';
            if(options.choice === true){
                htmls = '<div class="tra-lay-select-dl" id="pubSelectPesonDl" page="0" style="padding-top:15px;width:' + w + 'px;left:' + _left +'px;' + tb +'">\
                            <div><input type="text" class="layui-input SelectPullDownId" id="choiceSearchText"></div>\
                            <dl class="layui-anim layui-anim-upbit"  style="top:43px">\
                                <dd lay-value="" class="layui-select-tips ">加载中.....</dd>\
                            </dl>\
                        </div>';
            }
            $('body').append(htmls);
            if(options.choice === true){
                $('#choiceSearchText').focus();
            }
            // var datasss = localStorage.getItem('SelectPullData');

            if(options.searchType == 'json'){
                ajaxSend({
                    data:data,
                    url:options.url,
                    contentType:options.contentType,
                    datatype:options.datatype,
                    success:function(res){
                        if (typeof res == 'string'){
                            res = JSON.parse(res)
                        }
                        if (res.rows != null && options.searchType != 'local') {
                            //后台检索
                            var html = '<dd lay-value="" class="" style="color:#999999;">请选择</dd>';
                            if(options.choice === true){
                                html = '';
                            }
                            pubdata.selDatas = res.rows; //存数据
                            $.each(res.rows,function(i,v){
                                var t = v[options.textName];
                                if(options.layout == '-'){
                                    t = v[options.valName] + '-' + t;
                                }
                                // if(options.choice === true){
                                //     var vs =  $('[name="'+ options.inpValName +'"]').val()
                                //     vs = vs.split(',');
                                //     var c = '';
                                //     for(var n in vs){
                                //         if(v[options.valName] == vs[n]){
                                //             c = 'select';
                                //             continue
                                //         }
                                //     }
                                //     html += '<dd lay-value="' + v[options.valName] + '" class="' + c + '">' + t + '</dd>';
                                // }else{
                                //     html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                                // }
                                html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';

                            })
                            $('#pubSelectPesonDl').attr('page',res.pageNo);
                            if (options.pageParamter){
                                $('#pubSelectPesonDl').attr('page',res.page);
                            } else {
                                $('#pubSelectPesonDl').attr('page',res.pageNo);
                            }
                            $('#pubSelectPesonDl dl').html(html);
                            scrollfun(dom, options);
                        }else if(res.object != null && options.searchType == 'local') {
                            //本地检索
                            SelectPullDownData = res.object;
                            pubdata.selDatas = res.object
                            $.each(SelectPullDownData,function(i,v){
                                var z = v.pinying.toUpperCase();
                                var c = v.pinying.toLowerCase();
                                v.pinying = z + c;
                                SelectPullDownData[i].pinying = v.pinying;
                            })
                            var html = '<dd lay-value="" class="" style="color:#999999;">请选择</dd>';
                            if(options.choice === true){
                                html = '';
                            }
                            var p = $('#pubSelectPesonDl').attr('page');
                            SelectPullData = res.object;
                            // localStorage.setItem('SelectPullData', JSON.stringify(res.object));
                            if(p == 0) p = 1
                            var num = 20 * parseInt(p);
                            $.each(res.object,function(i,v){
                                if(i < num){
                                    var t = v[options.textName];
                                    if(options.layout == '-'){
                                        t = v[options.valName] + '-' + t;
                                    }
                                    // if(options.choice === true){
                                    //     var vs =  $('[name="'+ options.inpValName +'"]').val()
                                    //     vs = vs.split(',');
                                    //     var c = '';
                                    //     for(var n in vs){
                                    //         if(v[options.valName] == vs[n]){
                                    //             c = 'select';
                                    //             continue
                                    //         }
                                    //     }
                                    //     html += '<dd lay-value="' + v[options.valName] + '" class="' + c + '">' + t + '</dd>';
                                    // }else{
                                    //     html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                                    // }
                                        html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                                }
                            })
                            p ++
                            $('#pubSelectPesonDl').attr('page',p);
                            $('#pubSelectPesonDl dl').html(html);
                            scrollfun(dom, options);
                        } else if (res.object != null) {
                            var html = '<dd lay-value="" class="" style="color:#999999;">请选择</dd>';
                            if(options.choice === true){
                                html = '';
                            }
                            pubdata.selDatas = res.object; //存数据
                            $.each(res.object,function(i,v){
                                // if(options.choice === true){
                                //     var vs =  $('[name="'+ options.inpValName +'"]').val()
                                //     vs = vs.split(',');
                                //     var c = '';
                                //     for(var n in vs){
                                //         if(v[options.valName] == vs[n]){
                                //             c = 'select';
                                //             continue
                                //         }
                                //     }
                                //     html += '<dd lay-value="' + v[options.valName] + '" class="' + c + '">' + v[options.textName] + '</dd>';
                                // }else{
                                //     html += '<dd lay-value="' + v[options.valName] + '" class="">' + v[options.textName] + '</dd>';
                                // }
                                    html += '<dd lay-value="' + v[options.valName] + '" class="">' + v[options.textName] + '</dd>';
                            })
                            $('#pubSelectPesonDl').attr('page',res.pageNo);
                            $('#pubSelectPesonDl dl').html(html);
                            scrollfun(dom, options);
                        } else {
                            console.log('数据获取失败！');
                        }
                    }
                });
            }else if(options.searchType == 'local'){
                var html = '';
                var p = $('#pubSelectPesonDl').attr('page');
                if(p == 0) p = 1
                var num = 20 * parseInt(p);
                SelectPullDownData = options.data || options.datas || options.localData
                SelectPullData = options.data || options.datas || options.localData
                pubdata.selDatas = options.data || options.datas || options.localData
                $.each(SelectPullDownData,function(i,v){
                    if(i < num){
                        var t = v[options.textName];
                        if(options.layout == '-'){
                            t = v[options.valName] + '-' + t;
                        }
                        // if(options.choice === true){
                        //     var vs =  $('[name="'+ options.inpValName +'"]').val()
                        //     vs = vs.split(',');
                        //     var c = '';
                        //     for(var n in vs){
                        //         if(v[options.valName] == vs[n]){
                        //             c = 'select';
                        //             pubdata.choice.push(v);
                        //             continue
                        //         }
                        //     }
                        //     html += '<dd lay-value="' + v[options.valName] + '" class="' + c + '">' + t + '</dd>';
                        // }else{
                        //     html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                        // }
                        html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                    }
                })
                p ++
                $('#pubSelectPesonDl').attr('page',p);
                $('#pubSelectPesonDl dl').html(html);
                scrollfun(dom, options);
            }
        }).off('blur','.SelectPullDown').on('blur','.SelectPullDown',function(){
            var disabled = $(this).attr('lay-disabled'); // 禁用
            if(disabled){
                return false
            }
            $(this).val($(this).attr('focusVal'));
        });

        //下拉框数据点击事件
        $('body').off('click','#pubSelectPesonDl dd').on('click','#pubSelectPesonDl dd',function(e){
            e.stopPropagation();
            var value = $(this).attr('lay-value');
            var name = $(this).text();
            var data = {};
            var keys = pubdata.keys;
            var options = pubdata[keys];

            $.each(pubdata.selDatas,function(i,v){
                if(v[options.valName] == value){
                    data = v;
                }
            })
            if(options.choice === true){
                var s = $(this).hasClass('select');
                var vl = $(this).attr('lay-value');
                var txt = $(this).text();

                var nameStr = $('[name="' + options.inpTextName + '"]').val();
                var nameArr = nameStr.split(',');
                var replace = false;
                for(var i in nameArr){
                    if(nameArr[i] == txt){
                        replace = true;
                    }
                }
                if(replace === true){
                    $('#pubSelectPesonDl').remove();
                    return false;
                }

                if(s === true){
                    $(this).removeClass('select');
                    for(var i in pubdata.choice){
                        if(vl == pubdata.choice[i][options.valName]){
                            pubdata.choice.splice(i,1);
                        }
                    }
                }else{
                    $(this).addClass('select');
                    pubdata.choice.push(data);
                }
                var _n = $('[name="' + options.inpTextName + '"]').val(),
                    _v = $('[name="' + options.inpValName + '"]').val();
                if(_n != ''){
                    _n += ',' + txt;
                    _v += ',' + vl
                }else{
                    _n = txt;
                    _v = vl;
                }
                if(_n == '请选择') {
                    _n = '';
                }
                $('[name="' + options.inpTextName + '"]').val(_n);
                $('[name="' + options.inpValName + '"]').val(_v);
                var h = '<span class="choice">' + txt + ' <a href="javascript:;" data-name="' + options.inpTextName + '" data-value="' + options.inpValName + '" data-text="' + txt + '" data-val="' + vl + '" id="choiceCloseTag"><i class="fa fa-times-circle" aria-hidden="true"></i></a></span>';
                $('[name="' + options.inpTextName + '"]').parent().find("#SelectPullDownChoiceBox").append(h);
                $('#pubSelectPesonDl').remove();
                if(options.callback){
                    options.callback(pubdata.choice);
                }
            }else{
                if(name == '请选择') {
                    name = '';
                    value = '';
                }
                $('.SelectPullDownId').val(name);
                $('.SelectPullDownId').attr('focusVal',name);
                $('.SelectPullDownId').next().val(value);
                $('#pubSelectPesonDl').remove();
                // $('.SelectPullDown').addClass('SelectPullDownId');
                $('.SelectPullDown').removeClass('SelectPullDownId');
                if(options.callback){
                    options.callback(data);
                }
            }

        })

        $(document).off('click','.choice a').on('click','.choice a',function(e){
            e.stopPropagation();
            var txt = $(this).attr('data-text');
            var val = $(this).attr('data-val');
            var name = $(this).attr('data-name');
            var value = $(this).attr('data-value');
            var nameStr = $('[name="' + name + '"]').val();
            var valueStr = $('[name="' + value + '"]').val();
            var nameArr = nameStr.split(',');
            var valueArr = valueStr.split(',');
            nameArr.splice(nameArr.indexOf(txt), 1);
            $('[name="' + name + '"]').val(nameArr.join(","));
            valueArr.splice(valueArr.indexOf(val), 1);
            $('[name="' + value + '"]').val(valueArr.join(","));
            $(this).closest('span.choice').remove();
        })


        $(document).off('click','#choiceSearchText').on('click','#choiceSearchText',function(e){
            e.stopPropagation();
        })
            // $('#pubSelectPesonDl').remove();

        $('body').bind('click', function(){
            $('#pubSelectPesonDl').remove();
            $('.SelectPullDown').removeClass('SelectPullDownId');
            // localStorage.removeItem('SelectPullData');
        })

    }

    var scrollfun = function(dom, options){
        //滚动加载
        $('#pubSelectPesonDl dl').scroll(function(){
            var yScroll = $(this).scrollTop();
            var h = $(this)[0].scrollHeight;
            var $s = $(this);
            var keys = pubdata.keys;
            var options = pubdata[keys];
            var nval = $('.SelectPullDownId').val();
            if(pubdata.scorllbull === false){
                return false;
            }
            if(h - 200 < yScroll && options.searchType != 'local'){
                var page = $('#pubSelectPesonDl').attr('page');
                page ++
                if(pubdata.pagetype != false){
                    var data = {}
                    if(options.data){
                        data = options.data;
                    }
                    if (options.pageParamter){
                        data[options.pageParamter] = page;
                    } else {
                        data.pageNo = page;
                    }
                    if(options.searName){
                        data[options.searName] = searValue;
                    }
                    if(options.condition){
                        data[options.condition] = searValue;
                    }else if(options.searName){
                        data[options.textName] = searValue;
                    }
                    pubdata.scorllbull = false;
                    ajaxSend({
                        data:data,
                        url:options.url,
                        contentType:options.contentType,
                        datatype:options.datatype,
                        success:function(res){
                            if (res.rows != null) {
                                pubdata.scorllbull = true;
                                if(res.rows.length == 0){
                                    $('#pubSelectPesonDl dl').append('<dt style="color:#999999;text-align:center;">已加载完成</dt>');
                                    pubdata.pagetype = false;
                                }else{
                                    var html = '';
                                    if (options.pageParamter){
                                        $('#pubSelectPesonDl').attr('page',res.page);
                                    } else {
                                        $('#pubSelectPesonDl').attr('page',res.pageNo);
                                    }
                                    $.each(res.rows,function(i,v){
                                        var t = v[options.textName];
                                        if(options.layout == '-'){
                                            t = v[options.valName] + '-' + t;
                                        }
                                        html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                                        pubdata.selDatas.push(v);
                                    })
                                    $('#pubSelectPesonDl dl').append(html);
                                }
                            } else if (res.object != null) {
                            } else {
                                console.log('数据获取失败！');
                            }
                        }
                    });
                }
            }else if(h - 200 < yScroll && options.searchType == 'local'){
                var p = $('#pubSelectPesonDl').attr('page');
                var data = SelectPullData;
                data = inputChange(data,searValue);
                pubdata.selDatas = data;
                pubdata.scorllbull = true;
                if(pubdata.pagetype != false){
                    pubdata.pagetype = false;
                    // if(p == 1) p = 2
                    var num = 20 * parseInt(p);
                    // var html = '<dd lay-value="" class="layui-select-tips">---请选择---</dd>';
                    var html = '';
                    var len = data.length;
                    $.each(data,function(i,v){
                        if(i < num){
                            var t = v[options.textName];
                            if(options.layout == '-'){
                                t = v[options.valName] + '-' + t;
                            }
                            html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                        }else{

                        }
                    })

                    if(num >= len) {
                        html += '<dt style="color:#999999;text-align:center;">加载完成</dt>';
                        pubdata.scorllbull = false;
                    }else{
                        p ++
                        pubdata.scorllbull = true;
                    }
                    $('#pubSelectPesonDl').attr('page',p);
                    $('#pubSelectPesonDl dl').html(html);
                    setTimeout(function(){
                        pubdata.pagetype = true;
                    },500)
                }
            }
        });
        //输入搜索
        $('.SelectPullDownId').off('keyup').on('keyup',function(){
            if(!$('body #pubSelectPesonDl').length){
                var $box = $(this).closest('.pubSelectPesonBox');
                var _left = $(this).offset().left;
                var _top = $(this).offset().top;
                var h = $(window).height();
                var w = $box.width();
                var tb = '';
                var keys = $(this).attr('data-key');
                var options = pubdata[keys];
                focusVal = $(this).val();
                pubdata.selDatas = [];
                pubdata.choice = [];
                pubdata.keys = keys;
                pubdata.pagetype = true;
                $('.SelectPullDown').removeClass('SelectPullDownId');
                // $(this).attr('id','SelectPullDown');
                $(this).addClass('SelectPullDownId');
                if(w < 200){
                    w = 200;
                }
                if(_top < h - 200){
                    if(options.choice === true){
                        _top = _top + 15;
                    }
                    tb = 'top:' + _top + 'px;';
                }else{
                    var _w = h - _top + 235;
                    tb = 'bottom:' + _w + 'px;top:auto;';
                }
                var htmls = '<div class="tra-lay-select-dl" id="pubSelectPesonDl" page="0" style="width:' + w + 'px;left:' + _left +'px;' + tb +'">\
                            <dl class="layui-anim layui-anim-upbit" style="" >\
                                <dd lay-value="" class="layui-select-tips ">加载中.....</dd>\
                            </dl>\
                        </div>';
                if(options.choice === true){
                    htmls = '<div class="tra-lay-select-dl" id="pubSelectPesonDl" page="0" style="padding-top:15px;width:' + w + 'px;left:' + _left +'px;' + tb +'">\
                            <div><input type="text" class="layui-input SelectPullDownId" id="choiceSearchText"></div>\
                            <dl class="layui-anim layui-anim-upbit"  style="top:43px">\
                                <dd lay-value="" class="layui-select-tips ">加载中.....</dd>\
                            </dl>\
                        </div>';
                }
                $('body').append(htmls);
            }
            var $s = $(this);
            var txt = $(this).val();
            var keys = pubdata.keys;
            var options = pubdata[keys];
            if(options.searchType != 'local'){
                var page = $('#pubSelectPesonDl').attr('page');
                searValue = txt;
                pubdata.scorllbull = true;
                var data = {}
                page ++
                if(options.data){
                    data = options.data;
                }
                if (options.pageParamter){
                    data[options.pageParamter] = 1;
                } else {
                    data.pageNo = 1;
                }
                if(options.condition){
                    data[options.condition] = txt;
                }else{
                    data[options.textName] = txt;
                }
                ajaxSend({
                    data:data,
                    url:options.url,
                    contentType:options.contentType,
                    datatype:options.datatype,
                    success:function(res){
                        if (res.rows != null) {
                            pubdata.selDatas = res.rows;
                            // var html = '<dd lay-value="" class="layui-select-tips">---请选择---</dd>';
                            var html = '';

                            if (options.pageParamter){
                                $('#pubSelectPesonDl').attr('page',res.page);
                            } else {
                                $('#pubSelectPesonDl').attr('page',res.pageNo);
                            }
                            $.each(res.rows,function(i,v){
                                var t = v[options.textName];
                                if(options.layout == '-'){
                                    t = v[options.valName] + '-' + t;
                                }
                                html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                            })
                            $('#pubSelectPesonDl dl').html(html);
                        } else if (res.object != null) {
                            pubdata.selDatas = res.object;
                            // var html = '<dd lay-value="" class="layui-select-tips">---请选择---</dd>';
                            var html = '';
                            $('#pubSelectPesonDl').attr('page',res.pageNo);
                            $.each(res.object,function(i,v){
                                var t = v[options.textName];
                                if(options.layout == '-'){
                                    t = v[options.valName] + '-' + t;
                                }
                                html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                            })
                            $('#pubSelectPesonDl dl').html(html);
                        } else {
                            console.log('数据获取失败！');
                        }
                    }
                });
            }else if(options.searchType == 'local'){
                var data = SelectPullData;
                if (options.condition && typeof options.condition == 'object') {
                    data = inputChange(data,txt,{textName: options.condition});
                } else if (options.condition && typeof options.condition == 'string') {
                    data = inputChange(data,txt,{textName: options.condition});
                } else {
                    data = inputChange(data,txt,options);
                }
                searValue = txt;

                // var html = '<dd lay-value="" class="layui-select-tips">---请选择---</dd>';
                // $.each(data,function(i,v){
                //     var t = v[options.textName];
                //     if(options.layout == '-'){
                //         t = v[options.valName] + '-' + t;
                //     }
                //     html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                // })

                // $('#pubSelectPesonDl dl').html(html);
                // var html = '<dd lay-value="" class="layui-select-tips">---请选择---</dd>';
                var html = '';
                $.each(data,function(i,v){
                    if(i < 20){
                        var t = v[options.textName];
                        if(options.layout == '-'){
                            t = v[options.valName] + '-' + t;
                        }
                        html += '<dd lay-value="' + v[options.valName] + '" class="">' + t + '</dd>';
                    }
                })
                $('#pubSelectPesonDl').attr('page',1);
                $('#pubSelectPesonDl dl').html(html);
            }
        });
    }

    var inputChange = function(datas, inputValue,options) {
        if(inputValue != ''){
            var matcher = new RegExp(inputValue);
            var arr =  $.grep(datas, function(value) {
                return matcher.test(value.projectName);
            });
            var arr1 = $.grep(datas, function(value) {
                return matcher.test(value.pinying);
            });
            var _arr = mergeArray(arr, arr1);
            var arr2 = null;
            if (typeof options.textName == 'object') {
                var _arr2 = null;
                var _arr2_sc = [];
                var cs = options.textName;
                for (var i in cs) {
                    _arr2 = $.grep(datas, function(value) {
                        return matcher.test(value[cs[i]]);
                    });
                    _arr2_sc = mergeArray(_arr2_sc, _arr2);
                }
                arr2 = _arr2_sc;
            } else {
                arr2 = $.grep(datas, function(value) {
                    return matcher.test(value[options.textName]);
                });
            }
            // _arr = _arr.concat(arr2);
            return mergeArray(_arr, arr2);
        }else{
            return datas;
        }
    };

    function mergeArray(arr1, arr2) {
        var _arr = new Array();
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] != "") {
                _arr.push(arr1[i]);
            }
        }
        for (var i = 0; i < arr2.length; i++) {
            var flag = true;
            for (var j = 0; j < arr1.length; j++) {
                if (arr2[i] == arr1[j]) {
                    flag = false;
                    break;
                }
            }
            if (flag && arr2[i] != "") {
                _arr.push(arr2[i]);
            }
        }
        return _arr;
    }
    window.selectPlug = selectPlug;
    $.selectPlug = selectPlug;
})(jQuery, window, document);
