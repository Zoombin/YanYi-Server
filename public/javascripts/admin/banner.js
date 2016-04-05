// show add modal when lick
$('#basic > div > div > h4 > button').click(function(){
    $('#basic_modal_add').modal({show: true, keyboard: false, backdrop: 'static'});
    $('#basic_modal_addLabel').html('编辑');
    $('#basic_number').val('');
    $('#basic_number').attr('data-id', '').attr('data-cat', '');
});

function init(){
    $.ajax({
        type : 'GET',
        url: '/admin/basic/init',
        success: function(res) {
            $('#basic > .panel > table').remove();
            $('#basic > .panel').append(res.tpl);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

// $('a[href="#basic"]').on('show.bs.tab', function(){
//     init();
// });

// init();