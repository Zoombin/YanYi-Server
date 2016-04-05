// 公共号列表 start 

// show add modal when lick add
$('#website > div > div > h4 > button').click(function(){
    $('#website_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#website_modal_addLabel').html('添加');
    $('#website_number').val('');
    $('#website_number').attr('data-id', '').attr('data-cat', '');
});
$('#website_modal_add').on('shown.bs.modal', function(){
    var sCatId = $('#website_number').attr('data-cat');
    if(!sCatId) sCatId = 0;
    $('#website_cat').val(sCatId);
    $('#website_number').focus();
});
//init wechat category when open modal
$('#website_modal_add').on('show.bs.modal', function(){
    var sCatId = $('#website_number').attr('data-cat');
    var sCatHtml = '<select class="form-control" id="website_cat"><option value="0">请选择</option>';
    $.ajax({
        type : 'GET',
        url: '/admin/wechatcat/getall',
        success: function(res) {
            if(res.data.length){
                for (var i = 0; i < res.data.length; i++) {
                    var t = res.data[i];
                    sCatHtml += '<option value="'+t._id+'">'+t.title+'</option>';
                };
                sCatHtml += '</select>';
                $('#website_cat_div').html(sCatHtml);
            }else{
                $.bstip('当前没有分类', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
            }
        
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
});

// add wechat public number
$('#website_save').click(function(e){
    var sNumber = $('#website_number').val().trim();
    var sCat = $('#website_cat').val();
    var id = $('#website_number').attr('data-id');
    if(!sNumber) {
        $.bstip('请输入公共号', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#website_modal_add button').attr('disabled', 'disabled');
    $.ajax({
        type : 'POST',
        url: '/admin/wechatpublic/add',
        data: {id: id, number: sNumber, cat_id: sCat},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            if(id){
                // $('#tr_'+id).find('td:eq(0)').html(sNumber);
                website_getall();
            }else{
                website_getall();
            }
            $('#website_modal_add button').removeAttr('disabled');
            $('#website_modal_add').modal('hide');
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// update cat.is_active
function _updatewebsiteactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/wechatpublic/updateactive',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#website .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#website .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            website_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

//delete number
function _deletewebsite(id, oTr){
    var sNumber =  $(oTr).find('td:eq(0)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sNumber+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/wechatpublic/remove',
            data: {id: id},
            dataType: 'json',
            success: function(res) {
                $(oTr).remove();
                $.bstip(res.msg, {type: 'success'});
                $('#modal_confirm').modal('hide');
                $('#modal_confirm button').removeAttr('disabled');
            },
            error: function(a, b, c) {
                $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
            }
        });
    });
}

//grab article
function _grabwebsite(id){
    $.ajax({
        type : 'POST',
        url: '/admin/wechatpublic/grabarticle',
        data: {id: id},
        dataType: 'json',
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

//update public number
function _updatewebsite(id, oTr){
    var sNumber =  $(oTr).find('td:eq(0)').html();
    var sCatId = $(oTr).find('td:eq(1) span').html();
    $('#website_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#website_modal_addLabel').html('编辑');
    $('#website_number').attr('data-id', id).attr('data-cat', sCatId).val(sNumber);
}

// init update event after list loaded
function website_updateActiveEvent(){
    //update event
    $('#website .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatewebsiteactive(id, 0);
    });
    $('#website .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatewebsiteactive(id, 1);
    });
}

// init operator event
function website_OperatorEvent(){
    //delete event
    $('#website .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletewebsite(id, oTr);
    });
    //update event
    $('#website .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatewebsite(id, oTr);
    });
    //grab article event
    $('#website .tag-operator .grab').unbind('click').click(function(){
        var id = $(this).data('id');
        _grabwebsite(id);
    });
}

//get public number list
function website_getall(){
    $.ajax({
        type : 'GET',
        url: '/admin/wechatpublic/getall',
        success: function(res) {
            $('#website > .panel > table').remove();
            $('#website > .panel').append(res.tpl);
            website_updateActiveEvent();
            website_OperatorEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#website"]').on('show.bs.tab', function(){
    website_getall();
});

// website_getall();

/* ******************************************************************* */
/* ************************* 公共号列表 end ************************** */
/* ******************************************************************* */


/* ******************************************************************** */
/* ************************** 分类列表 start ************************** */
/* ******************************************************************** */
// show add modal when lick add
$('#webcat > div > div > h4 > button').click(function(){
    $('#webcat_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#webcat_modal_addLabel').html('添加');
    $('#webcat_title').val('');
    $('#webcat_title').attr('data-id', '');
});
$('#webcat_modal_add').on('shown.bs.modal', function(){
    $('#webcat_title').focus();
});

// add cat
$('#webcat_save').click(function(e){
    var sTitle = $('#webcat_title').val().trim();
    var id = $('#webcat_title').attr('data-id');
    if(!sTitle) {
        $.bstip('请输入分类名称', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#webcat_modal_add button').attr('disabled', 'disabled');
    $.ajax({
        type : 'POST',
        url: '/admin/wechatcat/add',
        data: {id: id, title: sTitle},
        dataType: 'json',
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            if(id){
                $('#tr_'+id).find('td:eq(0)').html(sTitle);
            }else{
                webcat_getall();
            }
            $('#webcat_modal_add button').removeAttr('disabled');
            $('#webcat_modal_add').modal('hide');
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// update cat.is_active
function _updatewebcatactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/wechatcat/updateactive',
        data: {id: id, is_active: is_active},
        dataType: 'json',
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#webcat .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#webcat .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            webcat_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

//delete cat
function _deletewebcat(id, oTr){
    var sTitle =  $(oTr).find('td:eq(0)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/wechatcat/remove',
            data: {id: id},
            dataType: 'json',
            success: function(res) {
                $(oTr).remove();
                $.bstip(res.msg, {type: 'success'});
                $('#modal_confirm').modal('hide');
                $('#modal_confirm button').removeAttr('disabled');
            },
            error: function(a, b, c) {
                $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
            }
        });
    });
}

//update cat
function _updatewebcat(id, oTr){
    var sTitle =  $(oTr).find('td:eq(0)').html();
    $('#webcat_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#webcat_modal_addLabel').html('编辑');
    $('#webcat_title').attr('data-id', id).val(sTitle);
}


// init update event after list loaded
function webcat_updateActiveEvent(){
    //update event
    $('#webcat .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatewebcatactive(id, 0);
    });
    $('#webcat .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatewebcatactive(id, 1);
    });
}
// init operator event
function webcat_OperatorEvent(){
    //delete event
    $('#webcat .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletewebcat(id, oTr);
    });
    //update event
    $('#webcat .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatewebcat(id, oTr);
    });
}

// get webcat list
function webcat_getall(){
    $.ajax({
        type : 'GET',
        url: '/admin/wechatcat/getall',
        success: function(res) {
            $('#webcat > .panel > table').remove();
            $('#webcat > .panel').append(res.tpl);
            webcat_updateActiveEvent();
            webcat_OperatorEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#webcat"]').on('show.bs.tab', function(){
    webcat_getall();
});

/* ********************************************************************* */
/* ************************* 分类列表 end ****************************** */



/* ********************************************************************* */
/* ************************* 文章列表 start **************************** */
// for pagination
var HISTORYSTART_ARTICLE = 1, PAGESIZE_ARTICLE = 5, SEARCH_NUMBER_ID;
//get article list
function webarticle_getall(iStart, number_id){
    SEARCH_NUMBER_ID = number_id;
    $.ajax({
        type : 'GET',
        url: '/admin/wechatarticle/getall',
        data: {number_id: number_id, PAGESIZE: PAGESIZE_ARTICLE, START: iStart},
        success: function(res) {
            // $('#webarticle > .panel > table').remove();
            // $('#webarticle > .panel').append(res.tpl);
            $('#webarticle-list').empty();
            $('#webarticle-list').append(res.tpl);
            $('#webarticle-total').html(res.totalCount);

            //加载文章中的缩略图
            // var oImg = $('#webarticle > .panel > table .article_img');
            // if(oImg.length){
            //     oImg.each(function(){
            //     $(this).attr('src', $(this).attr('data-src'));
            //     });
            // }

            //add pagination
            var total_page = Math.ceil(res.totalCount/PAGESIZE_ARTICLE) > 1 ? Math.ceil(res.totalCount/PAGESIZE_ARTICLE) : 1;
            var options = {
                bootstrapMajorVersion: 3,
                currentPage: HISTORYSTART_ARTICLE,//设置当前页
                totalPages: total_page,//设置总页数
                alignment: 'right',//设置控件的对齐方式
                numberOfPages: 5,//设置控件显示的页码数
                useBootstrapTooltip: true,//设置是否使用Bootstrap内置的tooltip
                onPageChanged: function(event, oldPage, newPage) {//为操作按钮绑定页码改变事件
                    // Reload current page with target PageNo
                    HISTORYSTART_ARTICLE =newPage;
                    webarticle_getall(newPage-1, SEARCH_NUMBER_ID);
                }
            };
            $('#webarticle-pager').bootstrapPaginator(options);

            //公共号 下拉
            var sHtml = '<select class="form-control" id="webarticle_cat"><option value="0">所有公共号</option>';

            if (res.numbers.length){
                for (var i = 0; i < res.numbers.length; i++) {
                    var t = res.numbers[i];
                    sHtml += '<option value="'+t._id+'">'+t.title+'</option>';
                };
                sHtml += '</select>';
                $('#webarticle_number_div').html(sHtml);
                $('#webarticle_cat').val(res.number_id);

                //绑定事件, 更改时重新加载数据
                $('#webarticle_cat').change(function(){
                    var number_id = $(this).children('option:selected').val();
                    webarticle_getall(0, number_id);
                });
            }

        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#webarticle"]').on('show.bs.tab', function(){
    webarticle_getall(0, 0);
});


// 文章列表 end 