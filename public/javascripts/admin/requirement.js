// for pagination
var HISTORYSTART = 1, PAGESIZE = 5;

// export excel
$('#require > div > div > h4 > button').click(function(){
    // TODO...
});

// get all info
function require_getall(iStart){
    $.ajax({
        type : 'GET',
        url: '/admin/requirement/getall',
        data: {PAGESIZE: PAGESIZE, START: iStart},
        success: function(res) {
            $('#require-list').empty();
            $('#require-list').append(res.tpl);

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
                    require_getall(newPage-1);
                }
            };
            $('#require-pager').bootstrapPaginator(options);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}

$('a[href="#require"]').on('show.bs.tab', function(){
    require_getall(0);
});
