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
$("#course").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:2});

//honour
// $("#honour").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:2});

//lectuer
$("#lectuer").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:false,vis:4});