// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

$('#event_date').datepicker({
    language: "zh-CN",
    format: "yyyy-mm-dd",
    calendarWeeks: true,
    autoclose: true,
    todayHighlight: true
});
// show add modal when lick
$('#event > div > div > h4 > button').click(function(){
    $('#event_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#event_modal_addLabel').html('添加event');
    _clear_form_event();
});
$('#event_modal_add').on('shown.bs.modal', function(){
    // $('#event_date').focus();
});

// clear form
function _clear_form_event(){
    $('#event_date').val('');
    $('#event_content').val('');
    $('#event_date').attr('data-id', '');
    $('#event_date').datepicker('update', '');
}
// add event info
$('#event_save').click(function(e){
    var id = $('#event_date').attr('data-id');
    var sEventDate = $('#event_date').val().trim();
    var sContent = $('#event_content').val();
    if(!sEventDate) {
        $.bstip('请输入事件日期', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sContent) {
        $.bstip('请输入事件内容', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
   
    $('#event_modal_add button').attr('disabled', 'disabled');
    $('#event_form').ajaxSubmit({
        url: '/admin/event/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            event_getall(HISTORYSTART-1);
            $('#event_modal_add button').removeAttr('disabled');
            $('#event_modal_add').modal('hide');
            _clear_form_event();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deleteevent(id, oTr){
    var sEventDate =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sEventDate+' 号</span> 的事件？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/event/remove',
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
function _updateevent(id, oTr){
    var sEventDate =  $(oTr).find('td:eq(1)').html();
    var sContent = $(oTr).find('td:eq(2) div').html();
    $('#event_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#event_modal_addLabel').html('编辑event');
    $('#event_date').attr('data-id', id).val(sEventDate);
    $('#event_date').datepicker('setDate', sEventDate);
    $('#event_content').val(sContent);
}

// update table.is_active
function _updateeventactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/event/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#event .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#event .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            event_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function event_updateActiveEvent(){
    //update event
    $('#event .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateeventactive(id, 0);
    });
    $('#event .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateeventactive(id, 1);
    });
}

// init operator event
function event_OperatorEvent(){
    //delete event
    $('#event .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deleteevent(id, oTr);
    });
    //update event
    $('#event .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updateevent(id, oTr);
    });
}

// get all info
function event_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/event/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#event-list').empty();
            $('#event-list').append(res.tpl);
            event_updateActiveEvent();
            event_OperatorEvent();

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
                    event_getall(newPage-1);
                }
            };
            $('#event-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#event"]').on('show.bs.tab', function(){
    event_getall(0);
});
