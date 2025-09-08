$(function(){
/////////// in use yunhee ///////////
/* TBC To Be Confirmed 확정되지 않은건 즉 추후 확정, 변경 가능 */
/***** TBD To Be Determined 결정해야 할 사항, 추후 결정 또는 미정 *****/

//////// magnifier ////////
window.onload = function () {
  $(".map.img_view").each(function () {
    var $container = $(this);
    var $target = $container.find('.target');
    var zoom = $target.data('zoom');

    $container
      .on('mousemove', magnify)
      .prepend("<div class='magnifier'></div>")      
      .children('.magnifier').css({
        "background": "url('" + $target.attr("src") + "') no-repeat",
        "background-size": $target.width() * zoom + "px " + $target.height() * zoom + "px"
      });

    var $magnifier = $container.children('.magnifier');

    function magnify(e) {
      var mouseX = e.pageX - $container.offset().left;
      var mouseY = e.pageY - $container.offset().top;

      // 버튼 영역 위에 있는지 확인
      var $btnBox = $container.find('.btn-bx-sns');
      var btnBoxOffset = $btnBox.offset();
      var btnBoxWidth = $btnBox.width();
      var btnBoxHeight = $btnBox.height();
      var isOverBtnBox =
        e.pageX >= btnBoxOffset.left &&
        e.pageX <= btnBoxOffset.left + btnBoxWidth &&
        e.pageY >= btnBoxOffset.top &&
        e.pageY <= btnBoxOffset.top + btnBoxHeight;

      // 버튼 영역 위에 있거나 컨테이너 밖이면 돋보기 숨김
      if (
        isOverBtnBox ||
        mouseX >= $container.width() ||
        mouseY >= $container.height() ||
        mouseX <= 0 ||
        mouseY <= 0
      ) {
        $magnifier.fadeOut();
        return; // 버튼 위에서는 추가 동작 중지
      } else {
        $magnifier.fadeIn();
      }

      if ($magnifier.is(":visible")) {
        var rx = -(mouseX * zoom - $magnifier.width() / 2);
        var ry = -(mouseY * zoom - $magnifier.height() / 2);
        var px = mouseX - $magnifier.width() / 2;
        var py = mouseY - $magnifier.height() / 2;

        $magnifier.css({
          left: px,
          top: py,
          backgroundPosition: rx + "px " + ry + "px"
        });
      }
    }
  });
};

/*
//////// web or mobile ////////
initWidth = $(window).width();
if(initWidth > 1025) $("body").addClass("web");
else $("body").addClass("mobile");
$(window).on('resize', function(){
  if($(window).width() <= 1024 && $("body").hasClass('web')){ 
		//location.reload();
  } else if ($(window).width() > 1024 && $("body").hasClass('mobile')) {
    //location.reload();
  }
});
*/
//////// scroll탑으로 ////////
$( window ).scroll( function() {
  var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
  if(400 > scrollBottom){
    $("#btTop").fadeIn(200);
  } else {
    $("#btTop").fadeOut(200);
  }
});
if ($('body').hasClass('.main')) {
} else {
  $('#btTop').click(function(e){
    $('body,html').animate({
      scrollTop: 0
    }, 200);
    return false;
  });
}


/////////////////// 팝업 ////////////////////
//메인 -팝업슬라이드
var popupCount = $("#popup_count").val();
if(popupCount > 3){
	popupCount = 3;
}
if(popupCount < 2){
	var popupCount2 = 1;
}else{
	var popupCount2 =2;
}
var mainPop = new Swiper('#main-pop1 .pop-slide', {
  speed:800,
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  navigation: {
    nextEl: ".main-pop .next",
    prevEl: ".main-pop .prev",
  },        
  pagination: {
    el: ".main-pop .pag",
    type: "fraction",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    480: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    680: {
      slidesPerView: popupCount2,
      spaceBetween: 0,
    },
    800: {
      slidesPerView: popupCount2,
      spaceBetween: 0,
    },
    1024: { // max1204
      slidesPerView: popupCount,
      spaceBetween: 0,
    },
  },
	on: {
		init: function() {
			updateSlidesPerView(this);
		},
		resize: function() {
			updateSlidesPerView(this);
		},
		slideChange: function() {
			// 필요 시 슬라이드 변경 시 동작 추가
		},
	},
});

function updateSlidesPerView(swiper) {
	let popupCount = $("#popup_count").val();
	var currentSlidesPerView = swiper.params.slidesPerView;
	if (currentSlidesPerView === 'auto') {
		currentSlidesPerView = Math.floor(swiper.width / swiper.slides[0].offsetWidth);
	}
	if(currentSlidesPerView < popupCount){
		$(".main-pop .pop-foot .act1").css("display", "flex");
	}else{
		$(".main-pop .pop-foot .act1").css("display", "none");
	}
}

var temaNum = $("#tema_num").val();
var ck = getCookie('popup_'+temaNum);
if(ck == "done"){
	$("#main-pop1").stop().animate({right:'-100%'}, 0);
}else{
	$("#main-pop1").css("display", "block");
	$("#main-pop1").stop().animate({right:'50%'}, 400);
}

//메인-팝업열기
$(".pop-sm").click(function(){
	let idx = $("#hidden_dix").val();
	$(".pop-bx, .pop-sm").stop().animate({right:'-100%'}, 400);
	$("#main-pop1").css("display", "block");
	$("#main-pop1").stop().animate({right:'50%'}, 400);
	$("#main-pop2").css("display", "block");
	$("#main-pop2").stop().animate({right:'50%'}, 400);
	$("#main-pop2 .main-pop").css("display", "block");
});
$(".bt-close").click(function(){
 $(".pop-bx, .pop-sm").stop().animate({right:'0%'}, 400);
 $("#main-pop1").stop().animate({right:'-150%'}, 400);
});


//navScroll
let navScroll;
let lastScrollTop = 0;
let delta = 5;
let navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
  navScroll = true; 
});

setInterval(function() {
  if (navScroll) {
      hasScrolled();
      navScroll = false;      
  }
}, 250);

function hasScrolled() {
	var idx = $("#hidden_dix").val();
	let temaNum = $("#tema_num").val();
	var popupAutoClose = $("#hidden_popup_auto_close").val();
  var st = $(this).scrollTop();  
  if(Math.abs(lastScrollTop - st) <= delta)
    return;  
  if ( $( document ).scrollTop() > 55 ) {    
    if (st > lastScrollTop && st > navbarHeight){      
      $('#wrap').removeClass('nav-down').addClass('nav-up');
			if(temaNum == "B2"){
				$('.header.sec01_on').removeClass('sec01_on').addClass('sec02_on');
			}
      //스크롤다운되면 팝업사라지고 버튼온
			if(popupAutoClose == "Y"){
				$("#main-pop1").stop().animate({right:'-100%'}, 400);
				$(".pop-bx, .pop-sm").stop().animate({right:'0%'}, 400);
				$("#main-pop2").stop().animate({right:'-100%'}, 400);
			}
    } else {
      $('#wrap').removeClass('nav-up').addClass('nav-down');
      // 맨 위로 스크롤했을 때만 sec01_on으로 변경
      if (st === 0 && temaNum == "B2") {
        $('.header.sec02_on').removeClass('sec02_on').addClass('sec01_on');
      }
    }
  } else {
		//$("#wrap").removeClass('nav-down');
		$('#wrap').removeClass('nav-down');
		// 문서 맨 위에 있을 때 sec01_on으로 변경
		if (temaNum == "B2") {
		  $('.header.sec02_on').removeClass('sec02_on').addClass('sec01_on');
		}
  }  
  lastScrollTop = st;
  //console.log(sctop);
  //console.log(outerHeight); //1050
}
/////////////////// 팝업 ////////////////////

/*
	//전화번호고정 하단숨김
	$(window).resize(function() {
		footer_tel();
	});

	$(document).ready(function(){
		footer_tel();
	});
*/
});
function popup_sm(){
	let idx = $("#hidden_dix").val();
	$(".pop-bx, .pop-sm").stop().animate({right:'-100%'}, 400);
	$("#main-pop1").css("display", "block");
	$("#main-pop1").stop().animate({right:'50%'}, 400);
	$("#main-pop2").css("display", "block");
	$("#main-pop2").stop().animate({right:'50%'}, 400);
	$("#main-pop2 .main-pop").css("display", "block");
}

function footer_tel(){
  if ($(window).width() < 680) {
    $(window).scroll(function() {
      var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
      let element = document.querySelector(".tel-fix");
      if(400 < scrollBottom){
        $(".tel-fix").fadeIn();
      } else {
        $(".tel-fix").fadeOut();
      }
    });
  } else {
    $(".tel-fix").hide();
    //$(window).unbind('scroll');
  }	
}

function getCookie(cName) {
	var x, y; var val = document.cookie.split(';');
	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == cName) {
			return unescape(y);
		}
	}
}

function setCookie( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}

function setPopup(){
	var temaNum = $("#tema_num").val();
	setCookie('popup_'+temaNum,'done',1);
	$("#main-pop1").fadeOut(300);
}

//지도바로가기
function map_open2(g, idx, x, y, n = "위치") {
    var url = "";
    if (g === "naver") {
        url = "https://map.naver.com/?query=" + encodeURIComponent(x + "," + y);
    } else if (g === "kakao") {
        url = "https://map.kakao.com/link/map/"+n+"," + x + "," + y;
    } else {
        //alert("지원하지 않는 지도 타입입니다.");
        return;
    }
    window.open(url, "_blank");
}

//지도
function map_open(g, idx, x, y){
	var title = "견본주택";
	if(g == "2"){
		title = "현장";
	}
	var modalId = "#map-modal";
	var width = 1000;
	var height = 600;
	var url = "https://bunyangnara.kr/home_page/inc/modal/map.html?g=1&idx="+idx+"&x="+x+"&y="+y;
	call_iz_modal(title, modalId, url, width, height);
}


//화면크기체크 yun 2025-01-24 784>800px <!-- 모바일체크추가 -->
function checkDevice() {
    if ($(window).width() <= 784) {
        $('#wrap').removeClass('pc').addClass('mobile');
    } else {
        $('#wrap').removeClass('mobile').addClass('pc');
    }
    // full테마버전 1006>1024px
    if ($(window).width() <= 1006) {
        $('#all_wrap').removeClass('pc').addClass('mobile');
    } else {
        $('#all_wrap').removeClass('mobile').addClass('pc');
    }
}

// 초기 체크
setTimeout(function(){
	checkDevice();
}, 5);
$(window).resize(function() {
	checkDevice();
});

//
$(document).ready(function(){
	// 서브페이지 헤더배경설정 yun 2025-02-05
	var currentUrl = window.location.href;
	// 서브 페이지 체크
	if (currentUrl.includes('sub.html') || currentUrl.includes('sub.html')) {
			$('#header').addClass('sub'); // #header에 sub 클래스 추가
	}

	// 오시는길 한개의 지도라도 이미지가 있을경우에 이미지값의 높이로 설정 yun add 2025-08-13
	if ($('.img_view').length) {
		$('.map_model_frame_div').addClass('img_view_height');
	} else {
		$('.map_model_frame_div').removeClass('img_view_height');
	}

	//투명헤더 적용시 메인비주얼 영역 설정 2025-08-21 yun add
	// .header에 sec01_on 클래스가 있는지 확인
	if ($('.header').hasClass('sec01_on')) { //투명헤더
		// #tema_num의 값을 가져옴
		let temaNum = $('#tema_num').val(); //B2
		$('.section.visual').find('.visual-video, .main-visual-autoplay.creative, .visual-single').addClass(temaNum); // .visual 안의 모든 특정 자식 요소에 temaNum 값을 클래스 이름으로 추가
		//$('.header.sec01_on').addClass(temaNum); //자신에게도 temaNum 값을 클래스 이름으로 추가
		//$('<style>').text('.' + temaNum + ' { margin-top: 0 !important; }').appendTo('head'); // .B2 {margin-top: 0 !important;}
	}
	//

	//pop-quick-layer 퀵레이어열고닫기 2025-08-27
	$(".pop-quick-layer").addClass("open");
	$(".quick-openbtn").click(function(){
		$(".pop-quick-layer").addClass("open");  
	});
	$(".quick-closebtn").click(function(){
		$(".pop-quick-layer").removeClass("open");
	});
	//





//
});