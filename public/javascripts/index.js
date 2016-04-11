var PAGESIZE=6, START=0;

// anchor
var topOffSet = 40;
$('#nav_anchor_course').unbind('click').click(function(){
    $('html,body').animate({scrollTop: $("#anchor_course").offset().top - topOffSet}, 500);
});
$('#nav_anchor_video').unbind('click').click(function(){
    $('html,body').animate({scrollTop: $("#anchor_video").offset().top - topOffSet}, 500);
});
$('#nav_anchor_contactus').unbind('click').click(function(){
    $('html,body').animate({scrollTop: $("#anchor_contactus").offset().top - topOffSet}, 500);
});

// course
function getCourse(){
    $.ajax({
        type : 'GET',
        url: '/api/course/getall',
        data: {PAGESIZE: PAGESIZE, START: START},
        success: function(res) {
            $('#index_course').empty();
            $('#index_course').append(res.tpl);

            $("#course").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:2});
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getCourse();

//honour
// $("#honour").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:2});

//lectuer
$("#lectuer").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:4});


