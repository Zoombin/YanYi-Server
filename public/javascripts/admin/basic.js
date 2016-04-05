// show add modal when lick
$('#basic > div > div > h4 > button').click(function(){
    $('#basic_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#basic_modal_addLabel').html('编辑');
    $('#site_title').val($('#site_title_label').html());
});
$('#basic_modal_add').on('shown.bs.modal', function(){
    $('#site_title').focus();
});

// update basic info
$('#basic_save').click(function(e){
    var sSiteTitle = $('#site_title').val().trim();
    if(!sSiteTitle) {
        $.bstip('请输入网站标题', {type: 'danger', align: 'center', width: 'auto', offset:{from: 'top', amount: 30}});
        return false;
    }
    $('#basic_modal_add button').attr('disabled', 'disabled');
    $.ajax({
        type : 'POST',
        url: '/admin/basic/update',
        data: {site_title: sSiteTitle},
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            getall();
            $('#basic_modal_add button').removeAttr('disabled');
            $('#basic_modal_add').modal('hide');
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

// get all info
function getall(){
    $.ajax({
        type : 'GET',
        url: '/admin/basic/getall',
        success: function(res) {
            $('#site_title_label').html('test');
            $('#site_title_label').html(res.data[0].value);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

// $('a[href="#basic"]').on('show.bs.tab', function(){
//     getall();
// });

getall();