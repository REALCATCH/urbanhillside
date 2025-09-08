$(function() {
		let dateTime = '.visit_date';	//변수명 설정
		let hiddenInquirySat = document.getElementById('hidden_inquiry_sat');	//토요일
		let hiddenInquirySun = document.getElementById('hidden_inquiry_sun');	//일요일
		let hiddenInquiryTime = document.getElementById('hidden_inquiry_time');
    var selectedTime = "";			
    // 페이지 로드 시, 이미 선택된 날짜와 시간이 있는지 확인
    var initialDatetime = $(dateTime).val();
    if (initialDatetime) {
        var parts = initialDatetime.split(' ');
        if (parts.length === 2) {
            selectedTime = parts[1];
        }
    }

    // 비활성화할 날짜 가져오기
		var disabledDates = [];
		var addDateLength = document.querySelectorAll('.hidden_add_date');
		addDateLength.forEach(input => {	//반복문을 돌린후 
			if(input.value){
				disabledDates.push(input.value);
			}
		});

		// 추가: 비활성화할 시간 배열 가져오기
		var disabledTimesExtra = [];
		var addTimeElements = document.querySelectorAll('.hidden_add_time');
		addTimeElements.forEach(function(input) {
				if (input.value) {
						disabledTimesExtra.push(input.value);
				}
		});	

		var disabledDatesSet = new Set(disabledDates);
		// isInvalidDate 함수 구현
		function isInvalidDate(date) {
				// 특정 날짜 비활성화
				if (disabledDatesSet.has(date.format('YYYY-MM-DD'))) {
						return true;
				}
				// 토요일 또는 일요일 비활성화
				if(hiddenInquirySat){
					if(hiddenInquirySat.value == "Y"){
						if(date.day() === 6){	//토
							return true;
						}
					}
				}
				if(hiddenInquirySun){
					if(hiddenInquirySun.value == "Y"){
						if (date.day() === 0) {	//일
								return true;
						}
					}
				}
				return false;
		}
/*
    // 시간 버튼을 동적으로 생성하는 함수
    function generateTimeButtons(startHour, endHour, disableTimes = []) {
        var buttonsHtml = '';
        for (var hour = startHour; hour <= endHour; hour++) {
            ['00', '30'].forEach(function(minute) {
                var time = (hour < 10 ? '0' + hour : hour) + ':' + minute;
                if (disableTimes.includes(time)) {
                    buttonsHtml += `<div class="jk-time-btn-box"><button type="button" class="jk-time-btn disabled" data-time="${time}" disabled>${time}</button></div>`;
                } else {
                    var selectedClass = (time === selectedTime) ? ' selected' : '';
                    buttonsHtml += `<div class="jk-time-btn-box"><button type="button" class="jk-time-btn${selectedClass}" data-time="${time}">${time}</button></div>`;
                }
            });
        }
        return buttonsHtml;
    }
*/
		// 시간 버튼을 동적으로 생성하는 함수
		function generateTimeButtons(startTime, endTime, disableTimes = []) {
				var buttonsHtml = '';

				// 시작 시간과 종료 시간을 Date 객체로 변환
				var [startHour, startMinute] = startTime.split(':').map(Number);
				var [endHour, endMinute] = endTime.split(':').map(Number);

				// 시작 시간부터 종료 시간까지 반복
				var currentHour = startHour;
				var currentMinute = startMinute;

				while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
						var time = (currentHour < 10 ? '0' + currentHour : currentHour) + ':' + (currentMinute === 0 ? '00' : currentMinute);
						// 버튼의 비활성화 여부를 결정
						var isDisabled = disableTimes.includes(time);

						if (isDisabled) {
								buttonsHtml += `<div class="jk-time-btn-box"><button type="button" class="jk-time-btn disabled" data-time="${time}" disabled>${time}</button></div>`;
						} else {
								var selectedClass = (time === selectedTime) ? ' selected' : '';
								buttonsHtml += `<div class="jk-time-btn-box"><button type="button" class="jk-time-btn${selectedClass}" data-time="${time}">${time}</button></div>`;
						}

						// 30분씩 증가
						currentMinute += 30;
						if (currentMinute === 60) {
								currentMinute = 0;
								currentHour++;
						}
				}

				return buttonsHtml;
		}
    // 시간 버튼을 생성하고 이벤트를 바인딩하는 함수
    function renderTimeButtons(picker, isToday, disableTimes) {
				let morningFirst		= $(".hidden_morning_first").val();
				let morningLast			= $(".hidden_morning_last").val();
				let afternoonFirst	= $(".hidden_afternoon_first").val();
				let afternoonLast		= $(".hidden_afternoon_last").val();
        var timeButtonsHtml = `
            <div class="time-buttons">
                <strong>오전</strong>
                <div class="time-box">
                    ${generateTimeButtons(morningFirst, morningLast, disableTimes)} <!-- 오전 -->
                </div>
                <strong>오후</strong>
                <div class="time-box">
                    ${generateTimeButtons(afternoonFirst, afternoonLast, disableTimes)} <!-- 오후 -->
                </div>
            </div>
        `;

        // 기존의 시간 버튼이 있다면 제거
        picker.container.find('.time-buttons').remove();

        // 새로 생성된 시간 버튼을 추가
        picker.container.find('.drp-buttons').before(timeButtonsHtml);

        // 시간 버튼 클릭 이벤트 핸들러
        picker.container.find('.jk-time-btn').on('click', function() {
            if ($(this).hasClass('disabled')) {
                return; // 비활성화된 버튼 클릭 시 무시
            }
            // 이전에 선택된 버튼의 스타일을 제거
            picker.container.find('.jk-time-btn').removeClass('selected');
            // 현재 클릭된 버튼에 스타일 추가
            $(this).addClass('selected');
            // 선택된 시간 저장
            selectedTime = $(this).data('time');
        });

        // 선택된 시간이 disableTimes에 포함되어 있는지 확인
        if (isToday && selectedTime) {
            if (disableTimes.includes(selectedTime)) {
                // 선택된 시간이 유효하지 않으므로 초기화
                selectedTime = '';
                picker.container.find('.jk-time-btn.selected').removeClass('selected');
                // 사용자에게 알림 (선택 사항)
                //alert('선택된 시간이 유효하지 않습니다. 시간을 다시 선택해주세요.');
            } else {
                // 선택된 시간이 유효하다면 'selected' 클래스 유지
                picker.container.find(`.jk-time-btn[data-time="${selectedTime}"]`).addClass('selected');
            }
        }
    }

    // Date Range Picker 초기화
    $(dateTime).daterangepicker({
        singleDatePicker: true,
        timePicker: false,
        autoUpdateInput: false, // 사용자가 직접 입력하지 못하게 함
        minDate: moment().startOf('day'), // 오늘 이전 날짜 선택 불가
        isInvalidDate: isInvalidDate,     // 특정 날짜 비활성화
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: "적용",
            cancelLabel: "취소",
            fromLabel: "부터",
            toLabel: "까지",
            customRangeLabel: "사용자 지정",
            daysOfWeek: ["일","월","화","수","목","금","토"],
            monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
            firstDay: 0
        }
    });

    // Date Range Picker가 열릴 때 시간 버튼 추가
    $(dateTime).on('show.daterangepicker', function(ev, picker) {
        // 이미 추가된 시간 버튼이 있다면 제거
        picker.container.find('.time-buttons').remove();

				// 선택된 날짜가 비활성화된 경우 다른 날짜로 강제 설정
				if (isInvalidDate(picker.startDate)) {
						// 현재 날짜에서 가장 가까운 유효한 날짜로 설정
						let newDate = moment().add(1, 'days');
						while (isInvalidDate(newDate)) {
								newDate.add(1, 'days');
						}
						picker.setStartDate(newDate);
						picker.updateView(); // 업데이트 뷰를 호출하여 적용
				}

        // 선택된 날짜가 오늘인지 확인
        var selectedDate = picker.startDate.clone().startOf('day');
        var today = moment().startOf('day');
        var isToday = selectedDate.isSame(today, 'day');

        // 현재 시간이 오늘인 경우, 선택할 수 없는 시간을 계산
        var disableTimes = [];
        if (isToday) {
            var currentTime = moment();
            // 30분 단위로 현재 시간보다 이전인 시간들을 비활성화
            for (var hour = 0; hour <= 23; hour++) {
                ['00', '30'].forEach(function(minute) {
                    var time = moment({ hour: hour, minute: minute });
                    if (time.isBefore(currentTime)) {
                        disableTimes.push(time.format('HH:mm'));
                    }
                });
            }
        }
				// hidden_add_time에서 가져온 비활성화 시간값들을 추가
				disableTimes = disableTimes.concat(disabledTimesExtra);
				if (hiddenInquiryTime && hiddenInquiryTime.value == "Y") {
					// 시간 버튼을 생성
					renderTimeButtons(picker, isToday, disableTimes);
				}
    });

    // Date Range Picker 적용 버튼 클릭 시 날짜 입력 필드 업데이트
    $(dateTime).on('apply.daterangepicker', function(ev, picker) {
			var date = picker.startDate.format('YYYY-MM-DD');
			if(hiddenInquiryTime){
				if(hiddenInquiryTime.value == "Y"){
					if(!selectedTime){
							alert('방문시간을 선택하세요!');
							// 팝업을 닫지 않고 다시 열기
							picker.show();
					} else {
							$(this).val(`${date} ${selectedTime}`);
					}
				}else{
					$(this).val(`${date}`);
				}
			}else{
				$(this).val(`${date}`);
			}
    });

    // Date Range Picker 인스턴스 접근 및 MutationObserver 설정
    $(dateTime).on('show.daterangepicker', function(ev, picker) {
        // MutationObserver를 사용하여 DOM 변화를 감지
        var targetNode = picker.container.find('.calendar-table')[0];
        if (!targetNode) return;

        var config = { childList: true, subtree: true };

        var callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 날짜가 변경되었을 때 시간 버튼 재생성
                    var selectedDate = picker.startDate.clone().startOf('day');
                    var today = moment().startOf('day');
                    var isToday = selectedDate.isSame(today, 'day');

                    var disableTimes = [];
                    if (isToday) {
                        var currentTime = moment();
                        for (var hour = 0; hour <= 23; hour++) {
                            ['00', '30'].forEach(function(minute) {
                                var time = moment({ hour: hour, minute: minute });
                                if (time.isBefore(currentTime)) {
                                    disableTimes.push(time.format('HH:mm'));
                                }
                            });
                        }
                    }
										disableTimes = disableTimes.concat(disabledTimesExtra);
										if (hiddenInquiryTime && hiddenInquiryTime.value == "Y") {
												renderTimeButtons(picker, isToday, disableTimes);
										}
                }
            }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        // Picker가 닫힐 때 observer 해제
        picker.container.on('hide.daterangepicker', function() {
            observer.disconnect();
        });
    });
});