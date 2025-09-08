$(function(){
////// animateEffect
function animateEffect() {
  const elements = document.querySelectorAll('[data-animation-effect]');
  if (elements.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const animationEffect = el.dataset.animationEffect;
        const delay = parseInt(el.dataset.effectDelay) || 0;
        if (delay > 0) el.style.animationDelay = `${delay}ms`;
        el.classList.add('animated', 'object-visible', animationEffect);
        observer.unobserve(el); // 한 번 실행 후 감지 중지
      }
    });
  }, {
    rootMargin: '0px 0px -130px 0px' // accY: -130과 동일
  });
  elements.forEach(el => observer.observe(el));
}
animateEffect();

// 맨 상단으로 버튼 클릭 이벤트
$('#btTop').click(function() {
  $('html, body').animate({ scrollTop: 0 }, 500);
});

$("#wrap").append("<div class='mo-bg'></div>");
$(".bt-mn").click(function(){
  $("#mobileMenu").toggleClass("open");
  $(".mo-bg").fadeIn(200);
});
$(".mo-bt-close").click(function(){
  $("#mobileMenu").toggleClass("open");
  $(".mo-bg").fadeOut(200);
});
$(".mo-menu > li").click(function(){
  $(this).addClass("active");
	$("#mobileMenu").toggleClass("open");
	$(".mo-bg").fadeOut();
});
$(".mo-bg").click(function(){
  let t = $("#mobileMenu").hasClass("open");
  if(t === true){
    $("#mobileMenu").removeClass("open");
    $(".mo-bg").hide();
  }
});
////// 모바일메뉴 서브메뉴
$(".mo-menu > li").mouseenter(function(){
  $(this).find(".depth2").stop().slideDown(100);
});
$(".mo-menu > li").mouseleave(function(){
  $(this).find(".depth2").stop().slideUp(100);
});

$("#header").mouseenter(function(){
  $(this).find(".depth2").stop().fadeIn(100);
  $("#header").addClass("on").stop();
});
$("#header").mouseleave(function(){
  $(this).find(".depth2").stop().fadeOut(100);
  $("#header").removeClass("on").stop();
});

//투명 헤더 메뉴 오버시
//아래로변경 2025-08-18 yun
const $menu = $('.header .inner .menu');
const $sMenuCont = $('.s_menu_cont');
let hideMenuTimer; // 타이머를 저장할 변수 - 담윤추가
$menu.add($sMenuCont).on('mouseenter', function() {
		clearTimeout(hideMenuTimer); // 숨기려는 타이머가 있다면 취소
		$sMenuCont.addClass('on');
});
$menu.add($sMenuCont).on('mouseleave', function() {
		hideMenuTimer = setTimeout(function() {
				$sMenuCont.removeClass('on');
		}, 100);
});

////////////////// 메인 ///////////////////
//메인-비주얼 main-visual
var mainVis = new Swiper('.main-visual', {
  speed: 600,
  spaceBetween: 0,
  effect:'fade',
  keyboard: true,
  loop: true,
  //centeredSlides: true,
  pagination: {
    el: ".main-visual .pag-num",
    clickable: true,
  },
  navigation: {
    nextEl: ".main-visual .next",
    prevEl: ".main-visual .prev",
  },  
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      spaceBetween: 20,
    },
    800: {
      spaceBetween: 70,
    },
    1400: {
      spaceBetween: 290,
    },
  },
});
mainVis.on('slideChange', function () {
  $('.main-visual .swiper-slide *').removeClass('animated').removeClass('object-visible').removeClass('fadeInUp');
  animateEffect();
  var index = mainVis.realIndex + 1;
  $('.main-visual .pag b').text(index.toString().padStart(2, '0'));
  // 모든 act클래스를 지우고 활성화된 act를 실행
	$('.main-visual .pag[class*="act"]').removeClass(function(index, className) {
			return (className.match(/\bact\S+/g) || []).join(' ');
	});  
	$('.main-visual .pag').addClass("act" + (mainVis.realIndex + 1));
});

//메인 슬라이드2
const swiper = new Swiper('.main-visual-single .swiper-container', {
    // 옵션 설정
    loop: true, // 루프 모드
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

//슬라이드
let slideNameArray = [];
let mainDesignCnt = document.getElementById("main_design_cnt").value;		//매뉴 겟수 
for(let i = 1; i <= mainDesignCnt; i = i + 1){
	let sectionNum = `section${i}`;																				//ID명
	let sectionNumId = document.getElementById(sectionNum);								//ID엘리멘트 불러오기
	if(sectionNumId !== null){
		let categoryCase = $(`#${sectionNum} .category_case`).val();				//카테고리 케이스
		let categoryNum = $(`#${sectionNum} .category_num`).val();					//카테고리 번호
		//console.log(categoryCase+"=="+categoryNum+"=="+document.getElementById(`slide-count-${categoryNum}`).value);
		if(categoryNum && categoryCase && categoryNum == i){
			//let sectionClass = document.getElementById(sectionNum).className;	//클래스명 가져오기(슬라이드 명을 만들기 위해서)
			//let className = sectionClass.replace(/section/g, '');							//클래스명에서 필요없는 부분 제거후
			//let sectionClassName = className.trim();													//공백 제거
			let sectionClass = document.getElementById(sectionNum);
			let sectionClassName = sectionClass.classList[1];
			//console.log(sectionClassName);
			let slideBigName = `.main-${sectionClassName}-${categoryNum}`;		
			let slideName = `.${sectionClassName}-slide-${categoryNum}`;
			if(categoryCase == "B"){ //main-unit
				let newsCount = document.getElementById(`slide-count-${categoryNum}`).value;
				slideNameArray[categoryNum] = new Swiper(slideName, {
					speed: 800,
					//cssMode: true,
					loop: true,
					direction: "horizontal",
					mousewheel: false,
					keyboard: true,
					autoHeight: true,
					slidesPerView: 1,
					spaceBetween: 30,
					pagination: {
						el: slideBigName+" .pag-num",
						clickable: true,        
						renderBullet: function (index, className) {
							return '<span class="' + className + '">' + (index + 1) + "</span>";
						},
					},
					navigation: {
						nextEl: slideBigName+" .next",
						prevEl: slideBigName+" .prev",
					},
					autoplay: {
						delay: 8000,
						disableOnInteraction: false,
					},
					breakpoints: {
						360: { slidesPerView: 1,	spaceBetween: 20,	},
						480: {	slidesPerView: 2,	spaceBetween: 20,	},
						1280: {	slidesPerView: 3,	spaceBetween: 30,	},
					},
				});
			}	//B 닫기
			if(categoryCase == "D"){
				let b2Chk = document.getElementById(`b2_chk_${categoryNum}`);
				let newsCount = document.getElementById(`slide-count-${categoryNum}`).value;
				let newsLoop = false;
				let ferView = 1;
				let ferView2 = 1;
				let ferView3 = 1;
				let ferView4 = 1;
				if(b2Chk !== null){
					if(newsCount > 3){
						newsLoop = true;
					}
					ferView = 3;
					ferView2 = 3;
					ferView3 = 2;
					ferView4 = 1;
					if(newsCount == 2){
						ferView = 2;
						ferView2 = 2;
					}else if(newsCount == 1){
						ferView = 1;
						ferView2 = 1;
						ferView3 = 1;
					}else{
						ferView = 3;
						ferView2 = 3;
						ferView3 = 2;
						ferView4 = 1;
					}
				}else{
					if(newsCount > 4){
						newsLoop = true;
					}
					ferView = 4;
					ferView2 = 3;
					ferView3 = 2;
					ferView4 = 1;
					if(newsCount == 3){
						ferView = 3;
					}else if(newsCount == 2){
						ferView = 2;
						ferView2 = 2;
					}else if(newsCount == 1){
						ferView = 1;
						ferView2 = 1
					}else{
						ferView = 4;
						ferView2 = 3;
						ferView3 = 2;
						ferView4 = 1;
					}
				}
				slideNameArray[categoryNum] = new Swiper(slideName, {
					speed: 800,
					//cssMode: true,
					direction: "horizontal",
					autoHeight: true, //이미지로딩 지연으로 높이가 안나오는 문제로 아래 추가 2025-08-20 yun
					observer: true, // DOM 변화를 감지하여 Swiper를 업데이트
					observeParents: true, // 부모 요소의 변화도 감지
					
					mousewheel: false,
					loop: newsLoop,      
					pagination: {
						el: slideBigName+" .pag-num",
						clickable: true,        
					},
					navigation: {
						nextEl: slideBigName+" .next",
						prevEl: slideBigName+" .prev",
					},
					autoplay: {
						delay: 5000,
						disableOnInteraction: false,
					},

					
					breakpoints: {
						"@0.00": {	slidesPerView: ferView4,	spaceBetween: 10,	},
						"@0.75": {	slidesPerView: ferView3,	spaceBetween: 20,	},
						"@1.00": {	slidesPerView: ferView2,	spaceBetween: 30,	},
						"@1.50": {	slidesPerView: ferView,	spaceBetween: 30,	},

					},
				});
			}	//D 닫기
			if(categoryCase == "G" || categoryCase == "N" || categoryCase == "P"){ // main-life / life2-slide / 모바일만적용배너 banner
				slideNameArray[categoryNum] = new Swiper(slideName, {
					speed:500,
					effect:'fade',
					centeredSlides: true,
					mousewheel: false,
					keyboard: true,
					autoHeight: true,
					loop: true,    
					pagination: {
						el: slideBigName+` .pag-num`,
						clickable: true,
					},
					navigation: {
						nextEl: slideBigName+` .next`,
						prevEl: slideBigName+` .prev`,
					},
					autoplay: {
						delay: 8000,
						disableOnInteraction: false,
					},
					breakpoints: {
						320: {	spaceBetween: 100,	},
						768: {	spaceBetween: 200,	},
						1400: {	spaceBetween: 300,	},
					},
				});
			}	//G 닫기		
			if(categoryCase == "K"){ //luxury-slide
				slideNameArray[categoryNum] = new Swiper(slideName, {
					speed: 800,
					spaceBetween: 500,
					effect:'fade',
					//centeredSlides: true,
					//cssMode: true,
					keyboard: true,
					loop: true,
					centeredSlides: true,
					autoHeight: true,
					pagination: {
						el: slideBigName+` .pag-num`,
						clickable: true,
					},
					navigation: {
						nextEl: slideBigName+` .next`,
						prevEl: slideBigName+` .prev`,
					},
					autoplay: {
						delay: 6500,
						disableOnInteraction: false,
					},
				});
			}	//K 닫기
			if(categoryCase == "O"){ //카테고리 O - main-lifes
				slideNameArray[categoryNum] = new Swiper(slideName, {
					speed: 500,
					//cssMode: true,
					//effect:'fade',
					//centeredSlides: true,
					loop: true,
					mousewheel: false,
					keyboard: true,
					autoHeight: true,
					slidesPerView: 1,   
					spaceBetween: 100,  
					pagination: {
						el: slideBigName+` .pag-num`,
						clickable: true,
					},
					navigation: {
						nextEl: slideBigName+` .next`,
						prevEl: slideBigName+` .prev`,
					},
					autoplay: {
						delay: 8000,
						disableOnInteraction: false,
					},
				});
			}	// O닫기
			if(categoryCase == "Q"){ //메인- cardstyle 카드슬라이드
				let qOption1 = ($(`#${sectionNum} .r_option1`).val() == "A") ? "" : `${slideBigName} .swiper-scrollbar`;	//이동 스크롤바 사용여부
				let qOption2 = ($(`#${sectionNum} .r_option2`).val() == "A") ? "bullets" : (($(`#${sectionNum} .r_option2`).val() == "B") ? "progressbar" : "fraction");	//네비게이션 사용여부
				var qSwiperContainer = $(`#${sectionNum} .cardstyle-slide`);
				var qSwiperWrapper = qSwiperContainer.find(".swiper-wrapper");
				var qSlides = qSwiperWrapper.find(".swiper-slide");
				var qSlideCount = qSlides.length;
				var qSlidesPerView = 3; 
				var qMinSlides = qSlidesPerView * 2;
				if (qSlideCount > 0 && qSlideCount < qMinSlides) {
						var clonedSlides = qSlides.clone();
						qSwiperWrapper.append(clonedSlides);
				}
				slideNameArray[categoryNum] = new Swiper(qSwiperContainer[0], {
					loop : true,
					speed: 800,
					keyboard: {enabled: true},
					autoHeight: true,
					observer: true,
					observeParents: true,
					slidesPerView: 3,
					spaceBetween: 20,
					centeredSlides: true,
					loopAdditionalSlides : 1,
					scrollbar: { //스크롤바
						el: qOption1,
						hide: true,
					},
					loopAdditionalSlides : 1,
					keyboard: {
							enabled: true,
					},
					grabCursor: true,
					pagination: {
						el: slideBigName+" .swiper-pagination",
						clickable: true,  
						type: qOption2,	
					},
					navigation: {
						nextEl: slideBigName+" .swiper-button-next",
						prevEl: slideBigName+" .swiper-button-prev",
					},
					autoplay: {
							delay: 6000,
							disableOnInteraction: false,
					},
					breakpoints: {
							0: {	slidesPerView: 1,	spaceBetween: 50,	},		  
							520: {	slidesPerView: 2,	 spaceBetween: 20,	},
							1024: {	slidesPerView: qSlidesPerView,	spaceBetween: 20,	},
					}
				});
			}	//Q 닫기 
			if(categoryCase == "R"){
				/* rowstyle 슬라이드 2025-07-07 */
				const progressCircle = document.querySelector(".rowstyle-slide .autoplay-progress svg");
				const progressContent = document.querySelector(".rowstyle-slide .autoplay-progress span");
				slideNameArray[categoryNum] = new Swiper(slideName, {
					slidesPerView: 1,
					spaceBetween: 0,
					loop: true,
					loopAdditionalSlides : 1,	
					parallax: true,
					speed:800,
					keyboard: {
						enabled: true,
					},
					effect: "fade",
					pagination: {
						el: ".rowstyle-slide .swiper-pagination",
						clickable: true,
						renderBullet: function (index, className) {
							return '<span class="' + className + '">' + (index + 1) + "</span>";
						},
					},
					navigation: {
						nextEl: ".rowstyle-slide .swiper-button-next",
						prevEl: ".rowstyle-slide .swiper-button-prev",
					},	  
					autoplay: {
						delay: 6000,
						disableOnInteraction: false,
					},
					on: {
							autoplayTimeLeft(s, time, progress) {
								progressCircle.style.setProperty("--progress", 1 - progress);
								progressContent.textContent = `${Math.ceil(time / 1000)}s`;
							}
						}
				});
			}	//R 닫기
			// 메인카드슬라이드에서 아이콘이 없을때 박스텍스트 여백조정 yun 2025-07-14 
			$('.cardstyle-slide .img-box.icon-').each(function() {
				$(this).closest('.cardstyle-slide .box-wrap').find('.title-box').addClass('icon');
			});

			slideNameArray[categoryNum].on('slideChange', function () {
				$(slideBigName+' '+slideName+' *').removeClass('animated').removeClass('object-visible').removeClass('fadeInUp');
				//$(slideBigName+' '+slideName+' *').removeClass('animated').removeClass('object-visible').removeClass('fadeInDown'); //2025-05-16 yun
				animateEffect();
				let indexNum = slideNameArray[categoryNum].realIndex+1;
				let sdTextCountValue = String(indexNum).padStart(2, '0');
				$(slideBigName+' .pag').find("b").text(sdTextCountValue);
				if(categoryCase == "O"){
					$(slideBigName+" .copy [class*=pr_]").removeClass("active");
					$(slideBigName+" .copy .pr_"+sdTextCountValue).addClass("active");
				}
			});
			
		}	//카테고리번호화 카테고리 케이스가 존재하면 닫기

	}	//세션 ID가 존재하면 닫기
}	//디자인 갯수 FOR문 닫기.


//메인비쥬얼 - 원본이미지 슬라이드 2025-07-29 yun
//var Back = $('.creative .back')
var swiperMain = new Swiper(".creative", {
 slidesPerView: 1,
 spaceBetween: 0,
 speed: 500,
 loop: true,
 keyboard: true,
 grabCursor: true,	 
 effect: "creative",
 creativeEffect: {
	prev: {
	  shadow: true,
	  opacity: .5,
	  translate: ["-20%", 0, -1],
	},
	next: {
	  translate: ["100%", 0, 0],
	},
  },	 
 autoplay: {
		delay: 4000,
		disableOnInteraction: false,
	},
});


// 히어로슬라이드
var menu = [];
$('.hero-slider .swiper-slide').each( function(index){
		menu.push( jQuery(this).find('.slide-inner').attr("data-text") );
});
var interleaveOffset = 0.5;
var swiperOptions = {
	loop: true,
	keyboard: true,
	speed: 1000,
	parallax: true,
	autoplay: {
		delay: 6000,
		disableOnInteraction: false,
	},
	watchSlidesProgress: true,
	pagination: {
		el: '.hero-slider .swiper-pagination',
		clickable: true,
	},

	navigation: {
		nextEl: '.hero-slider .swiper-button-next',
		prevEl: '.hero-slider .swiper-button-prev',
	},

	// 이 부분이 수정되었습니다.
	on: {
		progress: function(swiper) { // 'swiper'를 인자로 받습니다.
			for (var i = 0; i < swiper.slides.length; i++) {
				var slideProgress = swiper.slides[i].progress;
				var innerOffset = swiper.width * interleaveOffset;
				var innerTranslate = slideProgress * innerOffset;
				swiper.slides[i].querySelector(".slide-inner").style.transform =
				"translate3d(" + innerTranslate + "px, 0, 0)";
			}
		},

		touchStart: function(swiper) { // 'swiper'를 인자로 받습니다.
		  for (var i = 0; i < swiper.slides.length; i++) {
			swiper.slides[i].style.transition = "";
		  }
		},

		setTransition: function(swiper, speed) { // 'swiper'와 'speed'를 인자로 받습니다.
			for (var i = 0; i < swiper.slides.length; i++) {
				swiper.slides[i].style.transition = speed + "ms";
				swiper.slides[i].querySelector(".slide-inner").style.transition =
				speed + "ms";
			}
		}
	}
};
var heroSwiper = new Swiper(".hero-slider .swiper-container", swiperOptions);
// data-background
var sliderBgSetting = $(".hero-slider .slide-bg-image");
sliderBgSetting.each(function(indx){
	if ($(this).attr("data-background")){
			$(this).css("background-image", "url(" + $(this).data("background") + ")");
	}
});
//

})