// for pagination
var HISTORYSTART = 1, PAGESIZE = 5, VAR_LANG_TEAM='zh_cn';

// show add modal when lick
$('#team_btn_add').click(function(){
    $('#team_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#team_modal_addLabel').html('添加讲师');
    _clear_form_team();
});
$('#team_modal_add').on('shown.bs.modal', function(){
    $('#team_title').focus();
});

// clear form
function _clear_form_team(){
    $('#team_title').val('');
    $('#team_cover_url').val('');
    $('#team_brief').val('');
    $('#team_cover_image').hide().attr('src','');
    $('#team_title').attr('data-id', '');
}
// add team info
$('#team_save').click(function(e){
    var id = $('#team_title').attr('data-id');
    var sTitle = $('#team_title').val().trim();
    var sCoverUrl = $('#team_cover_url').val();
    var sBrief = $('#team_brief').val();
    if(!sTitle) {
        $.bstip('请输入姓名', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sBrief) {
        $.bstip('请输入简介', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sCoverUrl && !id) {
        $.bstip('请上传讲师封面', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
   
    $('#team_modal_add button').attr('disabled', 'disabled');
    $('#team_form').ajaxSubmit({
        url: '/admin/team/add',
        type: 'post',
        data:{id:id, lang: VAR_LANG_TEAM},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            team_getall(HISTORYSTART-1);
            $('#team_modal_add button').removeAttr('disabled');
            $('#team_modal_add').modal('hide');
            _clear_form_team();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deleteteam(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/team/remove',
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
function _updateteam(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();
    var sBrief = $(oTr).find('td:eq(3) div').html();
    var sCoverUrl = $(oTr).find('td:eq(2) img').attr('src');
    $('#team_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#team_modal_addLabel').html('编辑讲师');
    $('#team_title').attr('data-id', id).val(sTitle);
    $('#team_cover_image').show().attr('src',sCoverUrl);
    $('#team_brief').val(sBrief);
}

// update table.is_active
function _updateteamactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/team/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#team .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#team .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            team_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function team_updateActiveEvent(){
    //update event
    $('#team .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateteamactive(id, 0);
    });
    $('#team .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateteamactive(id, 1);
    });
}

// init operator event
function team_OperatorEvent(){
    //delete event
    $('#team .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deleteteam(id, oTr);
    });
    //update event
    $('#team .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updateteam(id, oTr);
    });
}

// get all info
function team_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/team/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart, lang: VAR_LANG_TEAM},
        success: function(res) {
            $('#team-list').empty();
            $('#team-list').append(res.tpl);
            team_updateActiveEvent();
            team_OperatorEvent();

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
                    team_getall(newPage-1);
                }
            };
            $('#team-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#team"]').on('show.bs.tab', function(){
    team_getall(0);
});
$('#team_btn_cn').unbind('click').click(function(){
    VAR_LANG_TEAM='zh_cn';
    team_getall(0);
});
$('#team_btn_en').unbind('click').click(function(){
    VAR_LANG_TEAM='en';
    team_getall(0);
});