$('#topbar ul li').removeClass('active');
$('#nav_anchor_event').parent().addClass('active');

$('#topbar ul li a').unbind('click').click(function(){
    if(this.id != 'nav_anchor_event'){
        location.href = '/';
    }
});

$('#calendar_event').calendar({
    width: 340,
    height: 300,
    format: 'yyyy-mm-dd',
    onSelected: function (view, date, data) {
        if(view == 'date'){
            getEventData(date);
        }
    }
});

// date:Fri Jun 17 2016 00:00:00 GMT+0800
function getEventData(date){
    var dt = new Date(date);
    var sStartDate = dt.getFullYear() + '-01-01'
    var sMonth = Number(dt.getMonth())+1;
    var sDay = dt.getDate();
    sMonth = sMonth < 10 ? '0'+ sMonth : sMonth;
    sDay = sDay < 10 ? '0'+ sDay : sDay;
    
    var sEndDate = dt.getFullYear() + '-' + sMonth + '-' + sDay;
    console.log(sStartDate);
    console.log(sEndDate);
    $.ajax({
        type : 'GET',
        url: '/api/event/getall',
        data: {start_date: sStartDate, end_date: sEndDate},
        success: function(res) {
            $('#event_content').empty();
            $('#event_content').append(res.tpl);
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getEventData(new Date());