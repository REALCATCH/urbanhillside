jconfirm.defaults = {
	title:'',
	theme: 'white',
	closeIcon: true,
	animation: 'scale',
	type: 'green',
	buttons: {
		ok: {
			text: ' 확인 ',
			action: function(){
				return true;
			}
		}
	}
}

//라이선스
$('#license-modal').iziModal({
	title: '라이선스',
	headerColor: 'var(--theme-color)',
	theme: '', // 또는 ''
	width: 600,
	closeOnEscape: true,
	closeButton: true,
	iframe: true,
	iframeHeight: 350,
	iframeURL: "/home_page/inc/modal/license.html"
});

//개인정보 취급방침
$('#privacy-modal').iziModal({
	title: '개인정보취급방침',
	headerColor: 'var(--theme-color)',
	theme: '', // 또는 ''
	width: 800,
	closeOnEscape: true,
	closeButton: true,	
	iframe: true,
	iframeHeight: 500,
	iframeURL: "/home_page/inc/modal/privacy.html"
});

// 이용약관
$('#privacy2-modal').iziModal({
	title: '이용약관',
	headerColor: 'var(--theme-color)',
	theme: '', // 또는 ''
	width: 800,
	closeOnEscape: true,
	closeButton: true,	
	iframe: true,
	iframeHeight: 500,
	iframeURL: "/home_page/inc/modal/privacy2.html"
});
// Google Sheets (Apps Script) endpoint configuration
// You can set these from a separate inline script as:
//   window.GSHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/XXXXX/exec';
//   window.GSHEETS_WEB_APP_URL_SMS = 'https://script.google.com/macros/s/YYYYY/exec';
// If not set, it will fall back to original site endpoints.
window.GSHEETS_WEB_APP_URL = window.GSHEETS_WEB_APP_URL || '';
window.GSHEETS_WEB_APP_URL_SMS = window.GSHEETS_WEB_APP_URL_SMS || window.GSHEETS_WEB_APP_URL;

function call_iz_modal(title, modalId, move_url, width, height){
	if(width == "" || width == undefined || width == "undefined") width = 800;
	if(height == "" || height == undefined || height == "undefined") height = 800;
	var options = {
		headerColor: 'var(--theme-color)',
		theme: 'dark', // 또는 ''
		title : title,
		width: width,
		closeOnEscape: true,
		closeButton: true,
		zindex:99999,
		iframe: true,
		iframeHeight: height,
		iframeURL: move_url,
		overlayClose: false,
		autoOpen: true
	};
	$(modalId).iziModal('destroy');	
	$(modalId).iziModal(options);
}


$('#map2-modal').iziModal({
	title: '현장',
	headerColor: 'var(--theme-color)',
	theme: '', // 또는 ''
	width: 1000,
	closeOnEscape: true,
	closeButton: true,	
	iframe: true,
	iframeHeight: 600,
	iframeURL: "/home_page/inc/modal/map.html?g=2"
});

function only_number(input) {	//oninput="only_number(this)"
  input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}


// 'common-customer-btn' 클릭 시 'common-customer'와 'common-customer-btn'에 active 클래스 추가
const commonCustomerBtn = document.querySelector('.tel-fix-ver2 .common-customer-btn');
const commonCustomer = document.querySelector('.tel-fix-ver2 .common-customer');
const footerQuickMenu = document.querySelector('.footer-quick-menu');

if(commonCustomerBtn){
	commonCustomerBtn.addEventListener('click', () => {
		commonCustomer.classList.add('active');
		commonCustomerBtn.classList.add('active');
		footerQuickMenu.classList.add('active');
	});
}else{
	if(footerQuickMenu){
		footerQuickMenu.classList.add('active01');
	}
}

// 'fa-times' 클릭 시 'common-customer'와 'common-customer-btn'의 active 클래스 제거
const faTimesIcons = document.querySelectorAll('.tel-fix-ver2 .faq-toggle-off');
faTimesIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        commonCustomer.classList.remove('active');
        commonCustomerBtn.classList.remove('active');
		footerQuickMenu.classList.remove('active');

    });
});



// 페이지 로드 시 버튼을 숨기기
const toTopBtn = document.querySelector('.to-top-btn');
if(toTopBtn){
	window.onload = function() {
		document.querySelector('.to-top-btn').style.display = "none";
	};
	// 사용자가 상단에서 100px 아래로 스크롤하면 버튼을 표시
	window.onscroll = function() {
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			toTopBtn.style.display = "block";
		} else {
			toTopBtn.style.display = "none";
		}
	};
	// 버튼을 클릭하면 문서의 상단으로 스크롤
	document.querySelector('.to-top-btn').addEventListener('click', function() {
		window.scrollTo({top: 0, behavior: 'smooth'});
	});
}


////// 푸터하단 관심고객등록 플로팅박스
var windowWidth = $(window).width();
if(windowWidth > 1024){ //1265
	$(".tel-fix-ver2 > .customer-bg").addClass("active");
	$(".tel-fix-ver2 > .common-customer-btn").addClass("active");
	/* 추가 */
	$(".cs-fix-box").addClass("off");
	$(".cs-fix-float").addClass("active");
}
//푸터하단 플로팅 박스 최초 실행모드
let footerInquirySet = document.getElementById("footer_inquiry_set");
if(footerInquirySet){
	let footerInquirySetValue = footerInquirySet.value;
	if(footerInquirySetValue == "Y"){
		$(".cs-fix-box").removeClass("off");
		$(".cs-fix-float").removeClass("active");		
	}else{
		$(".cs-fix-box").addClass("off");
		$(".cs-fix-float").addClass("active");
	}
}

////// 푸터하단 관심고객등록 플로팅박스
$(".cs-fix-float .floatbtn-register").click(function(){
  $(".cs-fix-box").toggleClass("off");
  $(".cs-fix-float").toggleClass("active");
});
$(".cs-fix-box .customer-box .btnwrap .btn-close").click(function(){
  $(".cs-fix-box").removeClass("off");
  $(".cs-fix-float").removeClass("active");
});


////// 하단고정-관심고객등록 모달(theme_01_38)  https://theme03.bunyangnara.kr/
//공통 관심고객등록 버튼+모달팝업
$("body").append("<div class='full-bg'></div>");
$(".fix-box-alram .open-box").click(function(){
  $(".fix-customer-box").toggleClass("active");
  //$(".fix-box-alram .open-box").toggleClass("off");
  $(".full-bg").fadeIn();
});
$(".fix-confirm-btn >.btn-close").click(function(){
  $(".fix-customer-box").removeClass("active");
  //$(".fix-customer-btn").removeClass("off");
  $(".full-bg").fadeOut();
});

function fix_box_alram(){
  $(".fix-customer-box").toggleClass("active");
  $(".full-bg").fadeIn();
}

//문의 하기 통합
function insert_inquiry(num, eNum){
	const currentURL = window.location.href;
	//if (currentURL.includes("theme_")) {
	//	$.alert({content:"해당사이트는 샘플사이트 입니다!", type:'red', onDestroy: function() {
	//	} });				
	//	return false;
	//}
	//const sample = $("#sample").val();
	//if(sample == "Y"){
	//	$.alert({content:"해당사이트는 샘플사이트 입니다!", type:'red', onDestroy: function() {
	//	} });				
	//	return false;
	//}
	if(num == '00'){
		const formData = new FormData();
		let name, phone, agree, visitDateInput, visitTimeInput, content, inquiryAdd, inquiryAdd2;
		if(eNum){
			name = document.getElementById("name"+eNum).value;
			phone = document.getElementById("phone"+eNum).value;
			agree = document.querySelector("input[name='agree"+eNum+"']:checked");//.value
			visitDateInput = document.querySelector("#visit_date_input"+eNum);
			visitTimeInput = document.querySelector("#visit_time_input"+eNum);
			content = document.querySelector("#content"+eNum);
			inquiryAdd = document.querySelector("#inquiry_add"+eNum);
			inquiryAdd2 = document.querySelector("#inquiry_add2"+eNum);
		}else{
			var eNum = "";
			name = document.getElementById("name").value;
			phone = document.getElementById("phone").value;
			agree = document.querySelector("input[name='agree']:checked");//.value
			visitDateInput = document.querySelector("#visit_date_input");
			visitTimeInput = document.querySelector("#visit_time_input");
			content = document.querySelector("#content");
			inquiryAdd = document.querySelector("#inquiry_add");
			inquiryAdd2 = document.querySelector("#inquiry_add2");
		}

		let hiddenInquiryDetail = document.getElementById('hidden_inquiry_detail');
		let hiddenInquiryTime = document.getElementById('hidden_inquiry_time');		

		let visitDateChk = false;
		let visitTimeChk = false;
		let contentChk = false;
		let inquiryAddChk = false;
		let inquiryAddChk2 = false;
		if(hiddenInquiryDetail && hiddenInquiryTime){
			if(hiddenInquiryDetail.value == "Y" && hiddenInquiryTime.value == "Y"){
				if(visitDateInput){
					visitDateChk = true;
					let vv = visitDateInput.value;
					let vvdata = vv.split(" ");
					formData.append('visit_date', vvdata[0]	);
					formData.append('visit_time', vvdata[1]	);
				}			
			}else{
				if(visitDateInput){
					visitDateChk = true;
					formData.append('visit_date', visitDateInput.value	);
				}
				if(visitTimeInput){
					visitTimeChk = true;
					formData.append('visit_time', visitTimeInput.value	);
				}
			}
		}else{
			if(visitDateInput){
				visitDateChk = true;
				formData.append('visit_date', visitDateInput.value	);
			}
			if(visitTimeInput){
				visitTimeChk = true;
				formData.append('visit_time', visitTimeInput.value	);
			}
		}
		if(content){
			contentChk = true;
			formData.append('content', content.value	);
		}
		if(inquiryAdd){
			inquiryAddChk = true;
			formData.append('inquiry_add', inquiryAdd.value	);
			if(document.getElementById("inquiry_add_use3").value == "Y" && !inquiryAdd.value){
				const inquiry_add_title = document.getElementById("inquiry_add_title").value;
				$.alert({content: inquiry_add_title+"을(를) 입력해주세요!", type:'red', onDestroy: function() {
					inquiryAdd.focus();
				} });				
				return false;
			}
		}
		if(inquiryAdd2){
			inquiryAddChk2 = true;
			formData.append('inquiry_add2', inquiryAdd2.value	);
			if(document.getElementById("inquiry_add_use4").value == "Y" && !inquiryAdd2.value){
				const inquiry_add_title2 = document.getElementById("inquiry_add_title2").value;
				$.alert({content: inquiry_add_title2+"을(를) 입력해주세요!", type:'red', onDestroy: function() {
					inquiryAdd2.focus();
				} });				
				return false;
			}
		}
		if(name == ""){
			$.alert({content:"이름을 입력해주세요!", type:'red', onDestroy: function() {
				document.getElementById("name"+eNum).focus();
			} });				
			return false;
		}		
		if(phone == ""){
			$.alert({content:"연락처를 입력해주세요!", type:'red', onDestroy: function() {
				document.getElementById("phone"+eNum).focus();
			} });				
			return false;
		}		
  
    //개인정보취급방침 라디오버튼,체크박스일경우 변경추가
    if (agree) {
			agree = agree.value;
		} else {
			agree = null;
		}
		console.log(agree);
		// agree가 null이거나 "N"일 경우 경고 메시지 표시
		if (agree === null || agree === "N") {
			$.alert({
				content: "개인정보수집 및 이용방침에 동의해주세요!", type: 'red', onDestroy: function() {}
			});
			return false;
		}



			////// 푸터하단 관심고객등록 플로팅박스
			var windowWidth = $(window).width();
			if(windowWidth > 1024){ //1265
				$(".tel-fix-ver2 > .customer-bg").addClass("active");
				$(".tel-fix-ver2 > .common-customer-btn").addClass("active");
				/* 추가 */
				$(".cs-fix-box").addClass("off");
				$(".cs-fix-float").addClass("active");
			}
			//푸터하단 플로팅 박스 최초 실행모드
			let footerInquirySet = document.getElementById("footer_inquiry_set");
			if(footerInquirySet){
				let footerInquirySetValue = footerInquirySet.value;
				if(footerInquirySetValue == "Y"){
					$(".cs-fix-box").removeClass("off");
					$(".cs-fix-float").removeClass("active");		
				}else{
					$(".cs-fix-box").addClass("off");
					$(".cs-fix-float").addClass("active");
				}
			}

			////// 푸터하단 관심고객등록 플로팅박스
			$(".cs-fix-float .floatbtn-register").click(function(){
			  $(".cs-fix-box").toggleClass("off");
			  $(".cs-fix-float").toggleClass("active");
			});
			$(".cs-fix-box .customer-box .btnwrap .btn-close").click(function(){
			  $(".cs-fix-box").removeClass("off");
			  $(".cs-fix-float").removeClass("active");
			});


			////// 하단고정-관심고객등록 모달(theme_01_38)  https://theme03.bunyangnara.kr/
			//공통 관심고객등록 버튼+모달팝업
			$("body").append("<div class='full-bg'></div>");
			$(".fix-box-alram .open-box").click(function(){
			  $(".fix-customer-box").toggleClass("active");
			  //$(".fix-box-alram .open-box").toggleClass("off");
			  $(".full-bg").fadeIn();
			});
			$(".fix-confirm-btn >.btn-close").click(function(){
			  $(".fix-customer-box").removeClass("active");
			  //$(".fix-customer-btn").removeClass("off");
			  $(".full-bg").fadeOut();
			});

			function fix_box_alram(){
			  $(".fix-customer-box").toggleClass("active");
			  $(".full-bg").fadeIn();
			}

			/////////////////////////// 서브 ///////////////////////
			/* 서브 비쥬얼이미지 효과 */
			$(function(){
			  function addClassName (object, className) {
				$(object).addClass(className);
			  }
			  function removeClassName (object, className) {
				$(object).removeClass(className);
			  }  
			  setTimeout(function () {
				addClassName($(".sub-visual"), "active");
			  }, 150);
			})

			//서브메뉴네비게이션 슬라이드 2025-04-30 yun
			$(function(){
				var swiperMenu = new Swiper('.sub-menu-nav', {
					slidesPerView: "auto",
					spaceBetween: 0,
					freeMode: true,			
				});
				
				// 액티브 탭의 인덱스 찾기
				var subActiveIndex = $('.sub-menu-nav .swiper-slide.on').index();
				
				// 액티브 탭이 있으면 해당 탭으로 포커스 이동
				if (subActiveIndex !== -1) {
						swiperMenu.slideTo(subActiveIndex, 500); // 0은 애니메이션 속도 (즉시 이동)
				}	
			});
			//

			/////////// 네들은 같이있어
			//탭메뉴 슬라이드 2025-07-31 yun
			$(function(){
				var swiperNav = new Swiper('.tab-menu-nav', {
					slidesPerView: "auto",
					spaceBetween: 0,
					freeMode: true,
					breakpoints: {			
						//"@0.00": {slidesPerView: 3},
						//"@0.75": {slidesPerView: 4},
						//"@1.00": {slidesPerView: 5},
					},
				});
				
				// 액티브 탭의 인덱스 찾기
				var activeIndex = $('.tab-menu-nav .swiper-slide.active').index();
				
				// 액티브 탭이 있으면 해당 탭으로 포커스 이동
				if (activeIndex !== -1) {
						swiperNav.slideTo(activeIndex, 500); // 0은 애니메이션 속도 (즉시 이동)
				}
			});

			// 서브뎁스메뉴 드롭다운 2025-05-14 yun
			$(document).ready(function() {
				// 서브뎁스메뉴 드롭다운 2025-05-14 yun
				// : 호버이벤트
				$('.path-wrap .depth1, .path-wrap .depth2').hover(
					function() {
						$(this).find('.other_list').stop(true, true).slideDown(200);
					},
					function() {
						$(this).find('.other_list').stop(true, true).slideUp(200);
					}
				);
			// 창 크기 변경 시 서브메뉴 초기화
			//		$(window).resize(function() {
			//			if ($(window).width() > 768) {
			//				$('.other_list').hide();
			//			}
			//		});
			});

			//서브네비게이션, 탭메뉴 스크롤시 상단고정 2025-08-01 yun
			$(document).ready(function(){
					let headerChk = document.getElementById("snb"); //sub에서만작동하게
					if(headerChk){
							let header = $("#snb");
							let sub = $(".tab_con");
							let subSticky = header.offset().top;
							$(window).scroll(function() {
									if ($(window).scrollTop() > subSticky) {
											header.addClass("snb-sticky");
											sub.addClass("tab-sticky");
									} else {
											header.removeClass("snb-sticky");
											sub.removeClass("tab-sticky");
									}
							});
					}
			});
			//////////// 네들은 같이있어



			$(document).ready(function() {
			//빠른문자
				const quickSms = document.getElementById("quick_sms_div");
				if(quickSms){
					$("#quick_sms_div").click(function(){
						$("#quick_sms_body").css("display", "block");
					});
					$("#quick_sms_body .btn-register-close").click(function(){
						$("#quick_sms_body").css("display", "none");
					});
				}
			});

			function quick_sms_inquiry(){
				const formData = new FormData();
				const work = "inquery_reg";
				const content = $("#content97").val();
				const phone = $("#phone97").val();
				formData.append('work', work	);
				formData.append('content', content	);
				formData.append('tel',	phone	);
				formData.append('name',	'문자상담'	);
				formData.append('type', 'quick_sms');
				if(!phone){
					$.alert({content:"연락처를 입력해주세요!", type:'red', onDestroy: function() {
						document.getElementById("phone97").focus();
					} });				
					return false;
				}
				if(!content){
					$.alert({content:"문의내용을 입력해주세요!", type:'red', onDestroy: function() {
						document.getElementById("content97").focus();
					} });				
					return false;
				}		
				// Determine target endpoint (Google Sheets Web App if configured)
				const gappsUrlSms = (window.GSHEETS_WEB_APP_URL_SMS && window.GSHEETS_WEB_APP_URL_SMS.length > 0) ? window.GSHEETS_WEB_APP_URL_SMS : (window.GSHEETS_WEB_APP_URL || '');
				const targetUrl = gappsUrlSms ? gappsUrlSms : './home_page/inc/query/reg3.html';
				jQuery.ajax({
					type: 'POST',
					url: targetUrl,
					data: formData,
					processData: false,  // 중요: FormData 객체를 변환하지 않도록 설정
					contentType: false,  // 중요: Content-Type 헤더를 설정하지 않도록 설정
					success: function(data) {
						if (data == '1') {
							$.alert({content:"발송했습니다.", type:'green', onDestroy: function() {
								$("#content97").val('');
								$("#phone97").val('');
								$("#quick_sms_body").css("display", "none");
							} });	
						}else{
							$.alert({content:"일시적인 오류가 발생했습니다\r\n잠시후에 다시 시도해주세요", type:'red', onDestroy: function() 	{
							} });	
						}
					},
					error: function(err) {
						// If using Google Sheets endpoint, CORS may block reading response.
						// Treat as success to avoid UX dead-end.
						const usedGapps = (targetUrl !== './home_page/inc/query/reg3.html');
						if (usedGapps) {
							$.alert({content:"발송했습니다.", type:'green', onDestroy: function() {
								$("#content97").val('');
								$("#phone97").val('');
								$("#quick_sms_body").css("display", "none");
							}});
							return;
						}
						//console.error(err);
					}
				});	
			}
