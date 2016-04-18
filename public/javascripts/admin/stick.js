var ueContent_stick;
// init rich text editor
ueContent_stick = UE.getEditor('stick_content', {
    serverUrl: '/admin/stick/ue'
});
// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// show add modal when lick
$('#stick > div > div > h4 > button').click(function(){
    $('#stick_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#stick_modal_addLabel').html('添加帖子');
    _clear_form_stick();
});
$('#stick_modal_add').on('shown.bs.modal', function(){
    $('#stick_title').focus();
});

// clear form
function _clear_form_stick(){
    $('#stick_title').val('');
    ueContent_stick.ready(function() {
        ueContent_stick.setContent('');
    });
    $('#stick_cover_image').hide().attr('src','');
    $('#stick_title').attr('data-id', '');
}
// add stick info
$('#stick_save').click(function(e){
    var id = $('#stick_title').attr('data-id');
    var sTitle = $('#stick_title').val().trim();
    var sContent = ueContent_stick.getContent();
    if(!sTitle) {
        $.bstip('请输入帖子标题', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sContent) {
        $.bstip('请输入帖子内容', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#stick_modal_add button').attr('disabled', 'disabled');
    $('#stick_form').ajaxSubmit({
        url: '/admin/stick/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            stick_getall(HISTORYSTART-1);
            $('#stick_modal_add button').removeAttr('disabled');
            $('#stick_modal_add').modal('hide');
            _clear_form_stick();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deletestick(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/stick/remove',
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
function _updatestick(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();
    var sContent = $(oTr).find('td:eq(2) div').html();
    $('#stick_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#stick_modal_addLabel').html('编辑帖子');
    $('#stick_title').attr('data-id', id).val(sTitle);
    ueContent_stick.ready(function() {
        ueContent_stick.setContent(sContent);
    });
}

// update table.is_active
function _updatestickactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/stick/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#stick .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#stick .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            stick_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function stick_updateActiveEvent(){
    //update event
    $('#stick .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatestickactive(id, 0);
    });
    $('#stick .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatestickactive(id, 1);
    });
}

// init operator event
function stick_OperatorEvent(){
    //delete event
    $('#stick .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletestick(id, oTr);
    });
    //update event
    $('#stick .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatestick(id, oTr);
    });
}

// get all info
function stick_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/stick/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#stick-list').empty();
            $('#stick-list').append(res.tpl);
            stick_updateActiveEvent();
            stick_OperatorEvent();

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
                    stick_getall(newPage-1);
                }
            };
            $('#stick-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#stick"]').on('show.bs.tab', function(){
    stick_getall(0);
});
