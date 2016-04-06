// show add modal when lick
$('#course > div > div > h4 > button').click(function(){
    $('#course_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#course_modal_addLabel').html('添加课程');
    $('#course_title').val($('#site_title_label').html());
});
$('#course_modal_add').on('shown.bs.modal', function(){
    var ue = UE.getEditor('course_editor');
    $('#site_title').focus();
});

// add course info
$('#course_save').click(function(e){
    var sSiteTitle = $('#site_title').val().trim();
    if(!sSiteTitle) {
        $.bstip('请输入网站标题', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#course_modal_add button').attr('disabled', 'disabled');
    $.ajax({
        type : 'POST',
        url: '/admin/course/add',
        data: {site_title: sSiteTitle},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            getall();
            $('#course_modal_add button').removeAttr('disabled');
            $('#course_modal_add').modal('hide');
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deletecourse(id, oTr){
    var sNumber =  $(oTr).find('td:eq(0)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sNumber+'</span> ？');
    $('#modal_confirm_save').unbind('click').click(function(){
        $('#modal_confirm button').attr('disabled', 'disabled');
        $.ajax({
            type : 'POST',
            url: '/admin/course/remove',
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
function _updatecourse(id, oTr){
    var sNumber =  $(oTr).find('td:eq(1)').html();
    var sCatId = $(oTr).find('td:eq(2) span').html();
    $('#course_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#course_modal_addLabel').html('编辑课程');
    $('#course_number').attr('data-id', id).attr('data-cat', sCatId).val(sNumber);
}

// update table.is_active
function _updatecourseactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/course/updateactive',
        data: {id: id, is_active: is_active},
        success: function(res) {
            if(is_active == 1){
                oBtn = $('#course .tag-status .btn-danger[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-danger').addClass('btn-success');
                $(oBtn).find('span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }else{
                oBtn = $('#course .tag-status .btn-success[data-id="'+id+'"]');
                $(oBtn).removeClass('btn-success').addClass('btn-danger');
                $(oBtn).find('span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
            }
            $.bstip(res.msg, {type: 'success'});
            course_updateActiveEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
}

// init update event after list loaded
function course_updateActiveEvent(){
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
function course_OperatorEvent(){
    //delete event
    $('#course .tag-operator .delete').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _deletecourse(id, oTr);
    });
    //update event
    $('#course .tag-operator .update').unbind('click').click(function(){
        var id = $(this).data('id');
        var oTr = $(this).parent().parent().parent();
        _updatecourse(id, oTr);
    });
}

// get all info
function getall(){
    $.ajax({
        type : 'GET',
        url: '/admin/course/getall',
        success: function(res) {
            $('#course-list').empty();
            $('#course-list').append(res.tpl);
            course_updateActiveEvent();
            course_OperatorEvent();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#course"]').on('show.bs.tab', function(){
    getall();
});
