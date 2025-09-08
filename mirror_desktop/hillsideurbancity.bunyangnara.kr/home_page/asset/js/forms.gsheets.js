// Lightweight Google Sheets submission script
// Depends on: jQuery, jquery-confirm (for $.alert), and gsheets.config.js loaded before this file.
(function(){
  // Ensure config exists
  var GS_URL = (window.GSHEETS_WEB_APP_URL || '').trim();
  var _submitting = false;

  function onlyNumber(str){ return (str||'').replace(/[^0-9]/g,''); }

  function getVal(id){ var el = document.getElementById(id); return el ? el.value : ''; }
  function getEl(id){ return document.getElementById(id); }
  function qs(sel){ return document.querySelector(sel); }

  function clearInquiryFields(eNum, flags){
    var suffix = eNum || '';
    var ids = [
      'name' + suffix,
      'phone' + suffix,
      'visit_date_input' + suffix,
      'visit_time_input' + suffix,
      'content' + suffix,
      'inquiry_add' + suffix,
      'inquiry_add2' + suffix
    ];
    ids.forEach(function(id){ var el = getEl(id); if (el) el.value = ''; });
  }

  // Loading / submitting helpers
  function ensureLoadingCss(){
    if (document.getElementById('_loading_css_')) return;
    var css = "\n.loading-overlay{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.45);display:none;z-index:9999}\\n"+
              ".loading-box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border-radius:8px;padding:16px 20px;min-width:240px;display:flex;align-items:center;gap:12px;box-shadow:0 6px 24px rgba(0,0,0,0.2)}\\n"+
              ".loading-spinner{width:22px;height:22px;border:3px solid #e0e0e0;border-top-color:#1e88e5;border-radius:50%;animation:spin 0.9s linear infinite}\\n"+
              ".loading-msg{font-size:14px;color:#333}\\n"+
              "@keyframes spin{to{transform:rotate(360deg)}}\\n"+
              ".btn-register.disabled{pointer-events:none;opacity:0.6}\\n";
    var style = document.createElement('style');
    style.id = '_loading_css_';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function ensureLoadingDom(){
    if (document.getElementById('_loading_overlay_')) return;
    var wrap = document.createElement('div');
    wrap.id = '_loading_overlay_';
    wrap.className = 'loading-overlay';
    wrap.innerHTML = "<div class='loading-box'><div class='loading-spinner'></div><div class='loading-msg'>등록중입니다. 잠시만 기다려주세요</div></div>";
    document.body.appendChild(wrap);
  }

  function showLoading(msg){
    ensureLoadingCss();
    ensureLoadingDom();
    var el = document.getElementById('_loading_overlay_');
    if (!el) return;
    var msgEl = el.querySelector('.loading-msg');
    if (msgEl && msg) msgEl.textContent = msg;
    el.style.display = 'block';
  }

  function hideLoading(){
    var el = document.getElementById('_loading_overlay_');
    if (el) el.style.display = 'none';
  }

  function setRegisterButtonsDisabled(on){
    try{
      var list = document.querySelectorAll('.btn-register');
      list.forEach(function(b){ if(on) b.classList.add('disabled'); else b.classList.remove('disabled'); });
    }catch(e){}
  }

  function setSubmitting(on, message){
    _submitting = !!on;
    if (_submitting){
      setRegisterButtonsDisabled(true);
      showLoading(message || '등록중입니다. 잠시만 기다려주세요');
    } else {
      hideLoading();
      setRegisterButtonsDisabled(false);
    }
  }

  // Inline error helpers
  function setFieldError(el, msg){
    try{
      if(!el) return;
      var next = el.nextElementSibling;
      if(!(next && next.classList && next.classList.contains('error-hint'))){
        next = document.createElement('span');
        next.className = 'error-hint';
        if (el.parentNode) el.parentNode.insertBefore(next, el.nextSibling);
      }
      next.textContent = msg;
    }catch(e){}
  }
  function clearFieldError(el){
    try{
      if(!el) return;
      var next = el.nextElementSibling;
      if(next && next.classList && next.classList.contains('error-hint')) next.remove();
    }catch(e){}
  }

  function alertError(msg, focusEl){
    if (window.$ && $.alert) {
      $.alert({ content: msg, type: 'red', onDestroy: function(){ if(focusEl) focusEl.focus(); } });
    } else {
      window.alert(msg);
      if (focusEl) try{ focusEl.focus(); }catch(e){}
    }
    setFieldError(focusEl, msg);
  }

  function alertOk(msg, after){
    if (window.$ && $.alert) {
      $.alert({ content: msg, type: 'green', onDestroy: function(){ if(typeof after === 'function') after(); } });
    } else {
      window.alert(msg);
      if (typeof after === 'function') try{ after(); }catch(e){}
    }
  }

  // KR phone validation with area codes
  var KR_AREA3 = ['031','032','033','041','042','043','044','051','052','053','054','055','061','062','063','064'];
  function isValidPhone(str){
    var d = onlyNumber(str);
    if (!d) return false;
    if (d.indexOf('010') === 0) {
      // Mobile 010 must be exactly 11 digits
      return d.length === 11;
    }
    if (d.indexOf('02') === 0) {
      // Seoul landline: 9 or 10 digits total (2-3-4 or 2-4-4)
      return d.length === 9 || d.length === 10;
    }
    // Other region landlines (3-digit area codes) must be exactly 10 digits (3-3-4)
    for (var i=0;i<KR_AREA3.length;i++){
      if (d.indexOf(KR_AREA3[i]) === 0) return d.length === 10 || d.length === 11; // 3-3-4 or 3-4-4
    }
    return false;
  }

  // Format phone as KR style with dashes (final targets: 010-1234-5678, 02-123-4567/02-1234-5678, 031-123-4567)
  function formatPhoneKR(str){
    var d = onlyNumber(str);
    if (!d) return '';
    // 010 mobile: 3-4-4 when full
    if (d.indexOf('010') === 0){
      if (d.length >= 11) return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7,11);
      if (d.length > 7)   return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7);
      if (d.length > 3)   return d.slice(0,3)+'-'+d.slice(3);
      return d;
    }
    // Seoul area code 02
    if (d.indexOf('02') === 0){
      if (d.length >= 10) return d.slice(0,2)+'-'+d.slice(2,6)+'-'+d.slice(6,10); // 2-4-4
      if (d.length >= 9)  return d.slice(0,2)+'-'+d.slice(2,5)+'-'+d.slice(5,9);  // 2-3-4
      if (d.length > 5)   return d.slice(0,2)+'-'+d.slice(2,5)+'-'+d.slice(5);
      if (d.length > 2)   return d.slice(0,2)+'-'+d.slice(2);
      return d;
    }
    // Other 3-digit region codes (3-3-4 or 3-4-4 when complete)
    for (var i=0;i<KR_AREA3.length;i++){
      var ac = KR_AREA3[i];
      if (d.indexOf(ac) === 0){
        if (d.length >= 11) return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7,11); // 3-4-4
        if (d.length >= 10) return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6,10); // 3-3-4
        if (d.length > 6)   return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);    // partial last block
        if (d.length > 3)   return d.slice(0,3)+'-'+d.slice(3);
        return d;
      }
    }
    // Fallback grouping for partial/unknown
    if (d.length >= 11) return d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7,11);
    if (d.length >= 10) return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6,10);
    if (d.length > 6)   return d.slice(0,3)+'-'+d.slice(3,6)+'-'+d.slice(6);
    if (d.length > 3)   return d.slice(0,3)+'-'+d.slice(3);
    return d;
  }

  // Global function used by existing HTML onclick handlers
  window.insert_inquiry = function(num, eNum){
    try {
      if (num !== '00') return false;

      var suffix = eNum || '';
      var name = getVal('name' + suffix);
      var phone = getVal('phone' + suffix);

      var agreeNode = eNum ? qs("input[name='agree"+suffix+"']:checked") : qs("input[name='agree']:checked");
      var agree = agreeNode ? agreeNode.value : 'Y'; // 동의 라디오가 없으면 통과

      var visitDateEl = getEl('visit_date_input' + suffix);
      var visitTimeEl = getEl('visit_time_input' + suffix);
      var contentEl   = getEl('content' + suffix);
      var inquiryAddEl  = getEl('inquiry_add' + suffix);
      var inquiryAdd2El = getEl('inquiry_add2' + suffix);

      // Validate
      if (!name) return alertError('이름을 입력해주세요!', getEl('name' + suffix));
      if (!phone) return alertError('연락처를 입력해주세요!', getEl('phone' + suffix));
      if (!isValidPhone(phone)) return alertError('연락처 형식이 올바르지 않습니다. 010은 11자리, 02는 9~10자리(2-3-4/2-4-4), 031~064는 10~11자리(3-3-4/3-4-4)로 입력해주세요!', getEl('phone' + suffix));
      if (agree === 'N') return alertError('개인정보수집 및 이용방침에 동의해주세요!');

      // prevent repeated submission
      if (_submitting) return false;
      setSubmitting(true, '등록중입니다. 잠시만 기다려주세요');

      var formData = new FormData();
      formData.append('work', 'inquery_reg');
      formData.append('type', 'inquiry');
      formData.append('name', name);
      // Send formatted phone to improve readability in the sheet
      formData.append('tel', formatPhoneKR(phone));

      if (visitDateEl && visitDateEl.value) formData.append('visit_date', visitDateEl.value);
      if (visitTimeEl && visitTimeEl.value) formData.append('visit_time', visitTimeEl.value);
      if (contentEl && contentEl.value)     formData.append('content', contentEl.value);
      if (inquiryAddEl && inquiryAddEl.value)   formData.append('inquiry_add', inquiryAddEl.value);
      if (inquiryAdd2El && inquiryAdd2El.value) formData.append('inquiry_add2', inquiryAdd2El.value);

      // Metadata
      formData.append('source_page', window.location.href);
      var dixEl = getEl('hidden_dix');
      if (dixEl) formData.append('site_id', dixEl.value);

      var targetUrl = GS_URL || './home_page/inc/query/reg.html';

      $.ajax({
        type: 'POST',
        url: targetUrl,
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          // If using Apps Script, consider any 2xx success as OK regardless of body
          if (GS_URL) {
            setSubmitting(false);
            alertOk('등록 되었습니다.', function(){ clearInquiryFields(suffix); });
            return;
          }
          if (data == '1') {
            setSubmitting(false);
            alertOk('등록 되었습니다.', function(){ clearInquiryFields(suffix); });
          } else {
            setSubmitting(false);
            alertError('일시적인 오류가 발생했습니다\r\n잠시후에 다시 시도해주세요');
          }
        },
        error: function(){
          // If hitting Apps Script, CORS로 인한 응답 읽기 실패를 성공으로 간주
          if (GS_URL) {
            setSubmitting(false);
            alertOk('등록 되었습니다.', function(){ clearInquiryFields(suffix); });
            return;
          }
          setSubmitting(false);
        }
      });
    } catch (e) {
      console.error(e);
      setSubmitting(false);
      alertError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    return false;
  };

  // Minimal modal toggle (관심고객등록 플로팅 박스) to keep UX
  $(function(){
    // overlay
    if ($('.full-bg').length === 0) {
      $('body').append("<div class='full-bg' style='display:none;'></div>");
    }
    // inline error css
    if ($('#_inline_error_css_').length === 0){
      $('head').append("<style id='_inline_error_css_'>.error-hint{color:#e53935;font-size:12px;margin-top:4px;display:block;}</style>");
    }
    // open
    $(document).on('click', '.fix-box-alram .open-box', function(){
      $(".fix-customer-box").toggleClass("active");
      $(".full-bg").fadeIn();
    });
    // close
    $(document).on('click', '.fix-confirm-btn > .btn-close', function(){
      $(".fix-customer-box").removeClass("active");
      $(".full-bg").fadeOut();
    });

    // Live phone masking for inputs with class 'phone'
    $(document).on('input blur', 'input.phone', function(){
      this.value = formatPhoneKR(this.value);
      if (isValidPhone(this.value)) clearFieldError(this);
    });
    // Clear name error on input
    $(document).on('input', 'input.name', function(){
      if ((this.value||'').trim().length > 0) clearFieldError(this);
    });
  });
})();
