var ueContent_service, VAR_LANG_SERVICE='zh_cn';
// init rich text editor
ueContent_service = UE.getEditor('service_content', {
    serverUrl: '/admin/service/ue'
});
// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;


$('#service_modal_add').on('shown.bs.modal', function(){
    ueContent_service.focus();
});

// clear form
function _clear_form_service(){
    $('#service_type').val('');
    $('#service_type').attr('data-id', '');
    ueContent_service.ready(function() {
        ueContent_service.setContent('');
    });
}
// add service info
$('#service_save').click(function(e){
    var id = $('#service_type').attr('data-id');
    var sContent = ueContent_service.getContent();
    
    if(!sContent) {
        $.bstip('请输入内容', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#service_modal_add button').attr('disabled', 'disabled');
    $('#service_form').ajaxSubmit({
        url: '/admin/service/add',
        type: 'post',
        data:{id:id, lang: VAR_LANG_SERVICE},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            service_getall(HISTORYSTART-1);
            $('#service_modal_add button').removeAttr('disabled');
            $('#service_modal_add').modal('hide');
            _clear_form_service();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deleteservice(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/service/remove',
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
function _updateservice(id, oTr){
    var sLabel =  $(oTr).find('td:eq(1)').html();
    var sContent = $(oTr).find('td:eq(2) div').html(); 
    $('#service_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#service_modal_addLabel').html(sLabel);
    $('#service_type').attr('data-id', id);
    ueContent_service.ready(function() {
        ueContent_service.setContent(sContent);
    });
}

// update table.is_active
function _updateserviceactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/service/active',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#service .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#service .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            service_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function service_updateActiveEvent(){
    //update event
    $('#service .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateserviceactive(id, 0);
    });
    $('#service .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updateserviceactive(id, 1);
    });
}

// init operator event
function service_OperatorEvent(){
    //delete event
    // $('#service .tag-operator .delete').unbind('click').click(function(){
    //     var id = $(this).data('id');
    //     var oTr = $(this).parent().parent().parent();
    //     _deleteservice(id, oTr);
    // });
    //update event
    $('#service .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updateservice(id, oTr);
    });
}

// get all info
function service_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/service/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart, lang: VAR_LANG_SERVICE},
        success: function(res) {
            $('#service-list').empty();
            $('#service-list').append(res.tpl);
            // service_updateActiveEvent();
            service_OperatorEvent();

            //add pagination
            // var total_page = Math.ceil(res.totalCount/PAGESIZE) > 1 ? Math.ceil(res.totalCount/PAGESIZE) : 1;
            // var options = {
            //     bootstrapMajorVersion: 3,
            //     currentPage: HISTORYSTART,//设置当前页
            //     totalPages: total_page,//设置总页数
            //     alignment: 'right',//设置控件的对齐方式
            //     numberOfPages: 5,//设置控件显示的页码数
            //     useBootstrapTooltip: true,//设置是否使用Bootstrap内置的tooltip
            //     onPageChanged: function(event, oldPage, newPage) {//为操作按钮绑定页码改变事件
            //         // Reload current page with target PageNo
            //         HISTORYSTART =newPage;
            //         service_getall(newPage-1);
            //     }
            // };
            // $('#service-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#service"]').on('show.bs.tab', function(){
    service_getall(0);
});

$('#service_btn_cn').unbind('click').click(function(){
    VAR_LANG_SERVICE='zh_cn';
    service_getall(0);
});
$('#service_btn_en').unbind('click').click(function(){
    VAR_LANG_SERVICE='en';
    service_getall(0);
});