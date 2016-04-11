var ueContent;
// init rich text editor
ueContent = UE.getEditor('course_content', {
    serverUrl: '/admin/course/ue'
});
// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// show add modal when lick
$('#course > div > div > h4 > button').click(function(){
    $('#course_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#course_modal_addLabel').html('添加课程');
    _clear_form();
});
$('#course_modal_add').on('shown.bs.modal', function(){
    $('#course_title').focus();
});

// clear form
function _clear_form(){
    $('#course_title').val('');
    $('#course_cover_url').val('');
    ueContent.ready(function() {
        ueContent.setContent('');
    });
    $('#course_cover_image').hide().attr('src','');
    $('#course_title').attr('data-id', '');
}
// add course info
$('#course_save').click(function(e){
    var id = $('#course_title').attr('data-id');
    var sTitle = $('#course_title').val().trim();
    var sCoverUrl = $('#course_cover_url').val();
    var sContent = ueContent.getContent();
    if(!sTitle) {
        $.bstip('请输入课程名称', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sCoverUrl && !id) {
        $.bstip('请上传课程封面', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    if(!sContent) {
        $.bstip('请输入课程内容', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    // $('#course_modal_add button').attr('disabled', 'disabled');
    $('#course_form').ajaxSubmit({
        url: '/admin/course/add',
        type: 'post',
        data:{id:id},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            getall(HISTORYSTART-1);
            $('#course_modal_add button').removeAttr('disabled');
            $('#course_modal_add').modal('hide');
            _clear_form();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// delete
function _deletecourse(id, oTr){
    var sTitle =  $(oTr).find('td:eq(1)').html();

    $('#modal_confirm').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#modal_confirm_body').html('确定要删除：<span class="text-danger">'+sTitle+'</span> ？');
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
    var sTitle =  $(oTr).find('td:eq(1)').html();
    var sCoverUrl = $(oTr).find('td:eq(2) img').attr('src');
    var sContent = $(oTr).find('td:eq(3) div').html();
    $('#course_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#course_modal_addLabel').html('编辑课程');
    $('#course_title').attr('data-id', id).val(sTitle);
    $('#course_cover_image').show().attr('src',sCoverUrl);
    ueContent.ready(function() {
        ueContent.setContent(sContent);
    });
}

// update table.is_active
function _updatecourseactive(id, is_active){
    var oBtn;
    $.ajax({
        type : 'POST',
        url: '/admin/course/active',
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
    $('#course .tag-status .btn-success').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatecourseactive(id, 0);
    });
    $('#course .tag-status .btn-danger').unbind('click').click(function(){
        var id = $(this).data('id');
       _updatecourseactive(id, 1);
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
function getall(iStart){
    console.log(iStart);
    console.log(PAGESIZE);
    $.ajax({
        type : 'GET',
        url: '/admin/course/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#course-list').empty();
            $('#course-list').append(res.tpl);
            course_updateActiveEvent();
            course_OperatorEvent();

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
                    getall(newPage-1);
                }
            };
            $('#course-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#course"]').on('show.bs.tab', function(){
    getall(0);
});
