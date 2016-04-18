var ueContent_activity;
// init rich text editor
ueContent_activity = UE.getEditor('activity_content', {
    serverUrl: '/admin/activity/ue'
});
// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// show add modal when lick
$('#activity > div > div > h4 > button').click(function(){
    $('#activity_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#activity_modal_addLabel').html('添加活动');
    _clear_form_activity();
});
$('#activity_modal_add').on('shown.bs.modal', function(){
    $('#activity_title').focus();
});

// clear form
function _clear_form_activity(){
    $('#activity_title').val('');
    $('#activity_subtitle').val('');
    $('#activity_cover_url').val('');
    ueContent_activity.ready(function() {
        ueContent_activity.setContent('');
    });
    $('#activity_cover_image').hide().attr('src','');
    $('#activity_title').attr('data-id', '');
    $('#status1').click();
}
// add activity info
$('#activity_save').click(function(e){
    var id = $('#activity_title').attr('data-id');
    var sTitle = $('#activity_title').val().trim();
    var sSubTitle = $('#activity_subtitle').val().trim();
    var sCoverUrl = $('#activity_cover_url').val();
    var sContent = ueContent_activity.getContent();
    if(!sTitle) {
        $.bstip('请输入活动名称', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sSubTitle) {
        $.bstip('请输入活动时间', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sCoverUrl && !id) {
        $.bstip('请上传活动封面', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sContent) {
        $.bstip('请输入活动内容', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#activity_modal_add button').attr('disabled', 'disabled');
    $('#activity_form').ajaxSubmit({
        url: '/admin/activity/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            activity_getall(HISTORYSTART-1);
            $('#activity_modal_add button').removeAttr('disabled');
            $('#activity_modal_add').modal('hide');
            _clear_form_activity();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deleteactivity(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/activity/remove',
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
function _updateactivity(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();
    var sSubTitle =  $(oTr).find('td:eq(2)').html();
    var sCoverUrl = $(oTr).find('td:eq(3) img').attr('src');
    var sContent = $(oTr).find('td:eq(4) div').html();
    var sStatus = $(oTr).find('td:eq(7) div').html();
    $('#activity_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#activity_modal_addLabel').html('编辑活动');
    $('#activity_title').attr('data-id', id).val(sTitle);
    $('#activity_subtitle').val(sSubTitle);
    $('#activity_cover_image').show().attr('src',sCoverUrl);
    $('#status'+sStatus).click();
    ueContent_activity.ready(function() {
        ueContent_activity.setContent(sContent);
    });
}

// update table.is_active
function _updateactivityactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/activity/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#activity .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#activity .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            activity_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function activity_updateActiveEvent(){
    //update event
    $('#activity .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateactivityactive(id, 0);
    });
    $('#activity .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateactivityactive(id, 1);
    });
}

// init operator event
function activity_OperatorEvent(){
    //delete event
    $('#activity .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deleteactivity(id, oTr);
    });
    //update event
    $('#activity .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updateactivity(id, oTr);
    });
}

// get all info
function activity_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/activity/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#activity-list').empty();
            $('#activity-list').append(res.tpl);
            activity_updateActiveEvent();
            activity_OperatorEvent();

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
                    activity_getall(newPage-1);
                }
            };
            $('#activity-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#activity"]').on('show.bs.tab', function(){
    activity_getall(0);
});
