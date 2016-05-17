// 课程/活动等 读取的个数读取的个数
var PAGESIZE=6, START=0;
var lang = $('#lang_value').html();

// anchor
var topOffSet = 40;
$('#nav_anchor_course').unbind('click').click(function(){
    _highlightNav(this);
    $('html,body').animate({scrollTop: $("#anchor_course").offset().top - topOffSet}, 500);
});
$('#nav_anchor_video').unbind('click').click(function(){
    _highlightNav(this);
    $('html,body').animate({scrollTop: $("#anchor_video").offset().top - topOffSet}, 500);
});
$('#nav_anchor_contactus').unbind('click').click(function(){
    _highlightNav(this);
    $('html,body').animate({scrollTop: $("#anchor_contactus").offset().top - topOffSet}, 500);
});
$('#nav_anchor_homepage').unbind('click').click(function(){
    _highlightNav(this);
    $('html,body').animate({scrollTop: 0}, 500);
});

var _highlightNav = function(obj){
    $('#topbar ul li').removeClass('active');
    $(obj).parent().addClass('active');
}

// Banner
function getBanner(){
    $.ajax({
        type : 'GET',
        url: '/api/banner/getall',
        data: {PAGESIZE: PAGESIZE, START: START},
        success: function(res) {
            $('#index_banner').empty();
            $('#index_banner').append(res.tpl);
            $('#slide').carousel();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getBanner();

// course
function getCourse(){
    $.ajax({
        type : 'GET',
        url: '/api/course/getall',
        data: {PAGESIZE: PAGESIZE, START: START, lang: lang},
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

// video
function getVideo(){
    $.ajax({
        type : 'GET',
        url: '/api/video/getall',
        data: {PAGESIZE: PAGESIZE, START: START, lang: lang},
        success: function(res) {
            $('#index_video').empty();
            $('#index_video').append(res.tpl);

        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getVideo();

// 需求留言
$('#req_btn').click(function(){
    var sName = $('#req_name').val().trim();
    var sEmail = $('#req_email').val().trim();
    var sPhone = $('#req_phone').val().trim();
    var sWebsite = $('#req_website').val().trim();
    var sReq = $('#req_req').val().trim();
    if(!sName) {
        $.bstip('请输入姓名', {type: 'danger', width: 'auto'});
        return false;
    }
    if(!sPhone) {
        $.bstip('请输入电话号', {type: 'danger', width: 'auto'});
        return false;
    }
    if(!sReq) {
        $.bstip('请输入您的需求', {type: 'danger', width: 'auto'});
        return false;
    }

    $('#req_form').ajaxSubmit({
        url: '/admin/requirement/add',
        type: 'post',
        success: function(res) {
            $.bstip(res.msg, {type: 'success'});
            clear_req_form();
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000, width: 'auto'});
        }
    });
});

function clear_req_form(){
    $('#req_form')[0].reset();
}
clear_req_form();

// activity
function getActivity(){
    $.ajax({
        type : 'GET',
        url: '/api/activity/getall',
        data: {PAGESIZE: PAGESIZE, START: START, lang: lang},
        success: function(res) {
            $('#index_activity').empty();
            $('#index_activity').append(res.tpl);

        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getActivity();

// stick
function getStick(){
    $.ajax({
        type : 'GET',
        url: '/api/stick/getall',
        data: {PAGESIZE: PAGESIZE, START: START, lang: lang},
        success: function(res) {
            $('#index_stick').empty();
            $('#index_stick').append(res.tpl);

        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getStick();

//lectuer
$("#lectuer").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:4});
function getTeam(){
    $.ajax({
        type : 'GET',
        url: '/api/team/getall',
        data: {PAGESIZE: PAGESIZE, START: START, lang: lang},
        success: function(res) {
            $('#index_team').empty();
            $('#index_team').append(res.tpl);

            $("#lectuer").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:4});
        },
        error: function(a, b, c) {
            $.bstip('服务器错误，请与管理员联系！', {type: 'danger', delay: 4000});
        }
    });
}
getTeam();