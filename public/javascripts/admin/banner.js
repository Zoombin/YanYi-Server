// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// show add modal when lick
$('#banner > div > div > h4 > button').click(function(){
    $('#banner_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#banner_modal_addLabel').html('添加BANNER');
    _clear_form_banner();
});
$('#banner_modal_add').on('shown.bs.modal', function(){
    $('#banner_title').focus();
});

// clear form
function _clear_form_banner(){
    // $('#banner_title').val('');
    $('#banner_cover_url').val('');
    $('#banner_cover_image').hide().attr('src','');
    $('#banner_cover_url').attr('data-id', '');
}
// add banner info
$('#banner_save').click(function(e){
    var id = $('#banner_cover_url').attr('data-id');
    var sCoverUrl = $('#banner_cover_url').val();

    if(!sCoverUrl && !id) {
        $.bstip('请上传BANNER', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
   
    $('#banner_modal_add button').attr('disabled', 'disabled');
    $('#banner_form').ajaxSubmit({
        url: '/admin/banner/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            banner_getall(HISTORYSTART-1);
            $('#banner_modal_add button').removeAttr('disabled');
            $('#banner_modal_add').modal('hide');
            _clear_form_banner();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deletebanner(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/banner/remove',
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
// update, init data
function _updatebanner(id, oTr){
    var sCoverUrl = $(oTr).find('td:eq(1) img').attr('src');
    $('#banner_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#banner_modal_addLabel').html('编辑BANNER');
    $('#banner_cover_url').attr('data-id', id);
    $('#banner_cover_image').show().attr('src',sCoverUrl);
}

// update table.is_active
function _updatebanneractive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/banner/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#banner .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#banner .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            banner_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function banner_updateActiveEvent(){
    //update event
    $('#banner .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatebanneractive(id, 0);
    });
    $('#banner .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatebanneractive(id, 1);
    });
}

// init operator event
function banner_OperatorEvent(){
    //delete event
    $('#banner .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletebanner(id, oTr);
    });
    //update event
    $('#banner .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatebanner(id, oTr);
    });
}

// get all info
function banner_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/banner/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#banner-list').empty();
            $('#banner-list').append(res.tpl);

            //加载缩略图
            var oImg = $('#banner-list > table .banner_img');
            if(oImg.length){
                oImg.each(function(){
                    $(this).attr('src', $(this).attr('data-src'));
                });
            }

            banner_updateActiveEvent();
            banner_OperatorEvent();

            //add pagination
            var total_page = Math.ceil(res.totalCount/PAGESIZE) > 1 ? Math.ceil(res.totalCount/PAGESIZE) : 1;
            var options = {
                bootstrapMajorVersion: 3,
                currentPage: HISTORYSTART,//设置当前页
                totalPages: total_page,//设置总页数
                alignment: 'right',//设置控件的对齐方式
                numberOfPages: 5,//设置控件显示的页码数
                useBootstrapTooltip: true,//设置是否使用Bootstrap内置的tooltip
                onPageChanged: function(event, oldPage, newPage) {//为操作按钮绑定页码改变事件
                    // Reload current page with target PageNo
                    HISTORYSTART =newPage;
                    banner_getall(newPage-1);
                }
            };
            $('#banner-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#banner"]').on('show.bs.tab', function(){
    banner_getall(0);
});
