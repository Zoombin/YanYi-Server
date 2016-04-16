// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// show add modal when lick
$('#video > div > div > h4 > button').click(function(){
    $('#video_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#video_modal_addLabel').html('添加视频');
    _clear_form_video();
});
$('#video_modal_add').on('shown.bs.modal', function(){
    $('#video_title').focus();
});

// clear form
function _clear_form_video(){
    $('#video_title').val('');
    $('#video_cover_url').val('');
    $('#video_subtitle').val('');
    $('#video_wechat_url').val('');
    $('#video_cover_image').hide().attr('src','');
    $('#video_title').attr('data-id', '');
    $('#show_type1').click();
}
// add video info
$('#video_save').click(function(e){
    var id = $('#video_title').attr('data-id');
    var sTitle = $('#video_title').val().trim();
    var sCoverUrl = $('#video_cover_url').val();
    var sSubTitle = $('#video_subtitle').val();
    var sUrl = $('#video_wechat_url').val();
    if(!sTitle) {
        $.bstip('请输入期数', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sSubTitle) {
        $.bstip('请输入标题', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sCoverUrl && !id) {
        $.bstip('请上传视频封面', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sUrl) {
        $.bstip('请输入视频网址', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#video_modal_add button').attr('disabled', 'disabled');
    $('#video_form').ajaxSubmit({
        url: '/admin/video/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            video_getall(HISTORYSTART-1);
            $('#video_modal_add button').removeAttr('disabled');
            $('#video_modal_add').modal('hide');
            _clear_form_video();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deletevideo(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/video/remove',
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
function _updatevideo(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();
    var sSubTitle = $(oTr).find('td:eq(2)').html();
    var sCoverUrl = $(oTr).find('td:eq(3) img').attr('src');
    var sWechatUrl = $(oTr).find('td:eq(5)').html();
    var sShowType = $(oTr).find('td:eq(7) div').html();
    $('#video_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#video_modal_addLabel').html('编辑视频');
    $('#video_title').attr('data-id', id).val(sTitle);
    $('#video_cover_image').show().attr('src',sCoverUrl);
    $('#video_subtitle').val(sSubTitle);
    $('#video_wechat_url').val(sWechatUrl);
    $('#show_type'+sShowType).click();
}

// update table.is_active
function _updatevideoactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/video/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#video .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#video .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            video_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function video_updateActiveEvent(){
    //update event
    $('#video .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatevideoactive(id, 0);
    });
    $('#video .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatevideoactive(id, 1);
    });
}

// init operator event
function video_OperatorEvent(){
    //delete event
    $('#video .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletevideo(id, oTr);
    });
    //update event
    $('#video .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatevideo(id, oTr);
    });
}

// get all info
function video_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/video/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#video-list').empty();
            $('#video-list').append(res.tpl);
            video_updateActiveEvent();
            video_OperatorEvent();

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
                    video_getall(newPage-1);
                }
            };
            $('#video-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#video"]').on('show.bs.tab', function(){
    video_getall(0);
});
