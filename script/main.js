// Main application logic

// 유틸리티 함수들
const utils = {
  // 디바운스 함수
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 요소가 뷰포트에 있는지 확인
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // 부드러운 스크롤
  smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
};

// 포트폴리오 필터링 (필요시 사용)
class PortfolioFilter {
  constructor() {
    this.items = document.querySelectorAll('.portfolio-item');
    this.init();
  }

  init() {
    // 필터 버튼이 있다면 이벤트 리스너 추가
    const filterButtons = document.querySelectorAll('[data-filter]');
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => this.filter(e.target.dataset.filter));
      });
    }
  }

  filter(category) {
    this.items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }
}

// 이미지 레이지 로딩
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    this.images.forEach(img => imageObserver.observe(img));
  }
}

// 폼 유효성 검사 (컨택트 폼이 있을 경우)
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // 유효성 검사
    if (this.validate(data)) {
      this.submitForm(data);
    }
  }

  validate(data) {
    let isValid = true;

    // 이메일 검사
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        this.showError('email', '올바른 이메일 주소를 입력해주세요.');
        isValid = false;
      }
    }

    // 필수 필드 검사
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showError(field.name, '이 필드는 필수입니다.');
        isValid = false;
      }
    });

    return isValid;
  }

  showError(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      errorDiv.style.color = 'red';
      errorDiv.style.fontSize = '0.875rem';
      errorDiv.style.marginTop = '0.25rem';

      // 기존 에러 메시지 제거
      const existingError = field.parentNode.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }

      field.parentNode.appendChild(errorDiv);
      field.focus();
    }
  }

  submitForm(data) {
    console.log('Form submitted:', data);
    // 실제 제출 로직을 여기에 추가
    alert('문의가 성공적으로 전송되었습니다!');
    this.form.reset();
  }
}

// 성능 모니터링
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // 페이지 로드 성능 측정
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
    });
  }
}

// 테마 토글 (다크모드 등)
class ThemeToggle {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // 테마 적용
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // 토글 버튼이 있다면
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 레이지 로딩 초기화
  new LazyLoader();

  // 성능 모니터링
  new PerformanceMonitor();

  // 콘솔에 환영 메시지
  console.log('%c웹디자이너 성경은 포트폴리오', 'font-size: 20px; font-weight: bold; color: #283f6e;');
  console.log('%c문의: soongoodday@gmail.com', 'font-size: 14px; color: #5577ae;');
});

// 전역 에러 핸들링
window.addEventListener('error', (e) => {
  console.error('Error occurred:', e.error);
});

// 리사이즈 핸들링 (디바운스 적용)
window.addEventListener('resize', utils.debounce(() => {
  // 리사이즈 시 필요한 로직
  console.log('Window resized');
}, 250));

// Export utilities for use in other scripts
window.portfolioUtils = utils;

// 맨 아래로 스크롤하기
const btn = document.querySelector(".hero_box_scrollButton");
const bottom = document.querySelector("#page-bottom");

document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.querySelector('.top-btn');
  if (!topBtn) return;

  const toggleTopBtn = () => {
    if (window.scrollY > 400) topBtn.classList.add('show');
    else topBtn.classList.remove('show');
  };

  window.addEventListener('scroll', toggleTopBtn);
  toggleTopBtn(); // 처음 로드 시도 체크

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const downBtn = document.querySelector(".hero_box_scrollButton");
  const bottom = document.querySelector("#page-bottom");

  const topBtn = document.querySelector(".top-btn");
  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

/* ===================================
   footer 연락처: 복사 + 앱 열기 + 모달 팝업
   ✅ 클릭 -> 모달 뜸 -> [복사하고 열기] 누르면
      1) 클립보드 복사
      2) 전화앱/메일앱 열기
=================================== */
(() => {
  // 1) 대상 찾기
  const items = Array.from(document.querySelectorAll(".footer-contact .contact-item"));

  // 2) 복사 함수 (실패 대비 포함)
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }
  };

  // 3) 모달 HTML 생성
  const modal = document.createElement("div");
  modal.id = "copyModal";
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  modal.innerHTML = `
    <div class="copy-modal__backdrop" style="
      position:absolute; inset:0;
      background: rgba(0,0,0,0.55);
    "></div>

    <div class="copy-modal__panel" role="dialog" aria-modal="true" style="
      position: relative;
      width: min(420px, 100%);
      background: #fff;
      border-radius: 18px;
      padding: 18px 18px 14px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      transform: translateY(8px);
    ">
      <button type="button" class="copy-modal__close" aria-label="닫기" style="
        position:absolute; top:10px; right:10px;
        width: 36px; height: 36px;
        border-radius: 999px;
        border: 1px solid #e8e8e8;
        background: #fff;
        font-size: 18px;
        cursor: pointer;
      ">×</button>

      <div class="copy-modal__title" style="
        font-weight: 800;
        font-size: 16px;
        margin: 6px 0 8px;
        color: #111;
      ">복사할까요?</div>

      <div class="copy-modal__desc" style="
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        margin-bottom: 12px;
      "></div>

      <div class="copy-modal__value" style="
        font-size: 14px;
        color: #111;
        background: #f6f6f6;
        border: 1px solid #ededed;
        border-radius: 12px;
        padding: 10px 12px;
        margin-bottom: 12px;
        word-break: break-all;
      "></div>

      <div class="copy-modal__actions" style="
        display:flex;
        gap: 10px;
        justify-content: flex-end;
      ">
        <button type="button" class="copy-modal__cancel" style="
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #e6e6e6;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
        ">취소</button>

        <button type="button" class="copy-modal__ok" style="
          padding: 10px 12px;
          border-radius: 12px;
          border: 0;
          background: #111;
          color: #fff;
          cursor: pointer;
          font-weight: 800;
        ">복사하고 열기</button>
      </div>

      <div class="copy-modal__hint" style="
        margin-top: 10px;
        font-size: 12px;
        color: #666;
      ">* 버튼을 누르면 복사 후 앱이 열려요.</div>
    </div>
  `;
  document.body.appendChild(modal);

  const backdrop = modal.querySelector(".copy-modal__backdrop");
  const closeBtn = modal.querySelector(".copy-modal__close");
  const cancelBtn = modal.querySelector(".copy-modal__cancel");
  const okBtn = modal.querySelector(".copy-modal__ok");
  const descEl = modal.querySelector(".copy-modal__desc");
  const valueEl = modal.querySelector(".copy-modal__value");

  // 4) 토스트(하단 팝업)도 같이 만들기
  const toast = document.createElement("div");
  toast.id = "copyToast";
  toast.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 26px;
    transform: translateX(-50%);
    background: rgba(20,20,20,0.92);
    color: #fff;
    padding: 12px 16px;
    border-radius: 14px;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s ease, transform .25s ease;
  `;
  document.body.appendChild(toast);

  let toastTimer = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(-6px)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 1200);
  };

  // 5) 모달 열고 닫기
  let pending = { copy: "", action: "", label: "" };

  const openModal = ({ copy, action, label }) => {
    pending = { copy, action, label };
    descEl.textContent = label === "전화번호"
      ? "전화번호를 클립보드에 복사하고, 전화 앱을 열까요?"
      : "이메일을 클립보드에 복사하고, 메일 앱을 열까요?";
    valueEl.textContent = copy;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  };

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // 6) 핵심: [복사하고 열기]
  okBtn.addEventListener("click", async () => {
    const ok = await copyText(pending.copy);
    showToast(ok ? `${pending.label} 복사 완료! 📋` : `복사 실패 😢`);

    // ✅ 앱 열기: 새 탭 느낌으로 막히는 경우가 있어 "동일 탭"으로 호출
    // - 모바일은 보통 바로 열림
    // - PC는 tel: 은 앱이 없으면 반응이 없을 수도 있음(정상)
    if (pending.action) {
      // 약간의 딜레이를 주면 복사 후 열기가 안정적
      setTimeout(() => {
        window.location.href = pending.action;
      }, 150);
    }

    closeModal();
  });

  // 7) 각 contact-item에 클릭 이벤트 걸기
  const bind = (el) => {
    const copy = el.dataset.copy || el.textContent.trim();
    const action = el.dataset.action || "";
    const label = el.id === "copyPhone" ? "전화번호" : "이메일";

    el.style.cursor = "pointer";
    el.addEventListener("click", () => openModal({ copy, action, label }));
  };

  items.forEach(bind);
})();





/* =======================================================
   ✅ Sub Slider 최종 통합본
   - 도트 생성 / 활성화
   - 도트 클릭 이동
   - 스크롤 시 활성 도트 갱신
   - 세로 휠 → 가로 이동
     ✅ 위로 휠 = 다음(앞으로)
     ❌ 가로 영역 위에서는 페이지 세로 이동 완전 차단
======================================================= */

(() => {
  /* =============================
     1) sub-slider 도트 + 활성화
  ============================= */
  const subSliders = document.querySelectorAll("[data-subslider]");

  subSliders.forEach((wrap) => {
    const track = wrap.querySelector(".sub-slider__track");
    const dotsWrap = wrap.querySelector(".sub-slider__dots");
    if (!track || !dotsWrap) return;

    const slides = Array.from(track.children).filter(el => el.nodeType === 1);
    if (!slides.length) return;

    // 도트 생성
    dotsWrap.innerHTML = "";
    const dots = slides.map((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sub-slider__dot";
      btn.setAttribute("aria-label", `슬라이드 ${i + 1}`);
      btn.addEventListener("click", () => scrollToIndex(i));
      dotsWrap.appendChild(btn);
      return btn;
    });

    // 가장 가까운 슬라이드 index 계산
    const getActiveIndex = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;

      slides.forEach((el, i) => {
        const elCenter = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(center - elCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      return best;
    };

    const setActiveDot = (idx) => {
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };

    const scrollToIndex = (idx) => {
      const el = slides[idx];
      if (!el) return;
      track.scrollTo({
        left: el.offsetLeft,
        behavior: "smooth"
      });
      setActiveDot(idx);
    };

    // 스크롤 중 도트 갱신
    let rafId = null;
    track.addEventListener("scroll", () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setActiveDot(getActiveIndex());
      });
    });

    // 초기 상태
    setActiveDot(getActiveIndex());
  });

  /* ==========================================
     2) 휠을 가로 스크롤로 변환 (완전 차단)
     - capture 단계에서 먼저 잡아서
       Lenis / window 스크롤도 못 움직이게
  ========================================== */
  const wheelSelectors = [
    ".other-works-viewport",
    ".sub-slider__track",
    ".sub-images--scroll3"
  ];

  const getWheelArea = (target) => {
    if (!(target instanceof Element)) return null;
    return target.closest(wheelSelectors.join(","));
  };

  window.addEventListener(
    "wheel",
    (e) => {
      // ✅ 모달 열려있으면 휠 가로변환/차단 로직 아예 실행 금지
      if (document.getElementById("owModal")?.classList.contains("is-open")) return;
      if (e.shiftKey) return;

      const area = getWheelArea(e.target);
      if (!area) return;

      const maxScrollLeft = area.scrollWidth - area.clientWidth;
      if (maxScrollLeft <= 5) return;

      // ✅ 위로 휠(deltaY < 0) → 다음(오른쪽)
      const moveX = -e.deltaY;

      // 🔥 핵심: 가로 영역 위에서는 무조건 세로 스크롤 차단
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      const SPEED = 1.3;
      area.scrollLeft += moveX * SPEED;
    },
    { passive: false, capture: true }
  );

  // /* =============================
  //    3) 도트 최소 스타일(보험)
  // ============================= */
  // if (!document.getElementById("subSliderDotCSS")) {
  //   const style = document.createElement("style");
  //   style.id = "subSliderDotCSS";
  //   style.textContent = `
  //     .sub-slider__dots{
  //       display:flex;
  //       justify-content:center;
  //       gap:10px;
  //       margin-top:12px;
  //     }
  //     .sub-slider__dot{
  //       width:8px;
  //       height:8px;
  //       border-radius:999px;
  //       border:1px solid rgba(40,63,110,0.45);
  //       background:transparent;
  //       opacity:.65;
  //       cursor:pointer;
  //       padding:0;
  //     }
  //     .sub-slider__dot.is-active{
  //       opacity:1;
  //       background: rgba(40,63,110,0.65);
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }
})();




(() => {
  const KEY = 'portfolio_build_mode'; // 'human' | 'ai'
  const html = document.documentElement;

  const btn = document.getElementById('modeSwitch');
  if (!btn) return;

  // --- 유틸 ---
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ✅ 섹션별 배지 자동 삽입 (각 section-header의 h2 옆에 붙임)
  function ensureSectionBadges() {
    const headers = qsa('.section-header');
    headers.forEach(h => {
      const title = h.querySelector('.section-title') || h.querySelector('h2') || h;
      if (!title) return;

      let badge = h.querySelector('.mode-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'mode-badge';
        badge.innerHTML = `<i class="dot" aria-hidden="true"></i><span class="txt">HUMAN BUILD</span>`;
        title.insertAdjacentElement('afterend', badge);
      }
    });
  }

  // ✅ 모드에 따라 배지/라벨 업데이트
  function updateBadges(mode) {
    qsa('.mode-badge .txt').forEach(el => {
      el.textContent = (mode === 'ai') ? '' : '';
    });

    // (선택) 카드 태그들도 바꾸고 싶으면 여기서 같이 처리 가능
    // 예: HERO의 PLAYER 배지 옆에 BUILD 표시 등
  }

  // ✅ 버튼 UI 업데이트
  function setButtonState(mode) {
    btn.classList.toggle('is-ai', mode === 'ai');
    btn.classList.toggle('is-human', mode !== 'ai');
    btn.setAttribute('aria-checked', mode === 'ai' ? 'true' : 'false');

    // thumb 글리치 애니 transform 충돌 방지용 변수
    const thumbX = (mode === 'ai') ? 70 : 0;
    btn.style.setProperty('--thumb-x', thumbX + 'px');
  }

  // ✅ html data 속성 + 저장
  function applyMode(mode, withGlitch = false) {
    html.setAttribute('data-build', mode);

    // UI
    setButtonState(mode);
    updateBadges(mode);

    // 저장
    try { localStorage.setItem(KEY, mode); } catch (e) { }

    if (withGlitch) {
      btn.classList.remove('is-glitching');
      // reflow로 애니 재실행
      void btn.offsetWidth;
      btn.classList.add('is-glitching');
      window.setTimeout(() => btn.classList.remove('is-glitching'), 220);
    }
  }

  // 초기 세팅
  ensureSectionBadges();
  const saved = (() => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  })();
  const initMode = (saved === 'ai' || saved === 'human') ? saved : 'human';
  applyMode(initMode, false);

  // 클릭 토글
  btn.addEventListener('click', () => {
    const now = html.getAttribute('data-build') === 'ai' ? 'ai' : 'human';
    const next = (now === 'ai') ? 'human' : 'ai';
    applyMode(next, true);
  });

})();




// (() => {
//   const LIGHT_URL = "https://soongoodday.github.io/Portfolio/";
//   const DARK_URL = "https://soongoodday.github.io/Portfolio_DarkMode/";
//   const STORAGE_KEY = "theme"; // light | dark

//   const isDarkPage = location.pathname.includes("Portfolio_DarkMode");
//   const btn = document.getElementById("themeSwitch");

//   if (!btn) return;

//   // 저장된 테마에 따라 자동 이동
//   const savedTheme = localStorage.getItem(STORAGE_KEY);
//   if (savedTheme === "dark" && !isDarkPage) {
//     location.replace(DARK_URL);
//     return;
//   }
//   if (savedTheme === "light" && isDarkPage) {
//     location.replace(LIGHT_URL);
//     return;
//   }

//   // 현재 상태 반영
//   btn.setAttribute("aria-checked", isDarkPage ? "true" : "false");

//   // 클릭 시 테마 저장 + 페이지 이동
//   btn.addEventListener("click", () => {
//     const nextTheme = isDarkPage ? "light" : "dark";
//     localStorage.setItem(STORAGE_KEY, nextTheme);
//     location.href = nextTheme === "dark" ? DARK_URL : LIGHT_URL;
//   });
// })();




/* =======================================================
   ✅ FINAL Horizontal Wheel Driver (추가용, 맨 아래)
   - 세로 휠을 가로 이동으로 변환
   - 해당 영역 위에서는 페이지 세로 스크롤 완전 차단
   - trackpad deltaX(가로 스와이프)도 자연스럽게 처리
======================================================= */
(() => {
  const WHEEL_SELECTORS = [
    ".other-works-viewport",
    ".sub-slider__track",
    ".sub-images--scroll3",
    ".ai-bars" // 필요 없으면 제거 가능
  ].join(",");

  const getArea = (target) => {
    if (!(target instanceof Element)) return null;
    return target.closest(WHEEL_SELECTORS);
  };

  window.addEventListener(
    "wheel",
    (e) => {
      // 모달 열려있으면 건드리지 않음
      if (document.getElementById("owModal")?.classList.contains("is-open")) return;

      const area = getArea(e.target);
      if (!area) return;

      const maxScrollLeft = area.scrollWidth - area.clientWidth;
      if (maxScrollLeft <= 1) return; // 가로 스크롤 자체가 없는 경우

      // ✅ 여기서부터는 "해당 영역 위" -> 페이지 세로 스크롤 완전 차단
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      // shift+wheel은 브라우저 기본 가로스크롤 느낌을 존중(원하면 막아도 됨)
      // if (e.shiftKey) return;

      // 트랙패드: deltaX가 있으면 그걸 우선 반영
      const dx = Math.abs(e.deltaX) > 0 ? e.deltaX : 0;

      // 마우스 휠: deltaY를 가로로 변환
      // (너가 기존에 쓰던 방향: 위로 휠(deltaY<0) -> 오른쪽으로 이동하려면 -deltaY)
      const dyToX = -e.deltaY;

      const SPEED = 1.25;

      area.scrollLeft += (dx + dyToX) * SPEED;
    },
    { passive: false, capture: true }
  );
})();




document.addEventListener("DOMContentLoaded", () => {
  // 다크 페이지 감지(파일 분리형)
  const path = location.pathname.toLowerCase();
  if (path.includes("dark")) document.documentElement.classList.add("is-dark");

  const sections = [
    { id: "home",        label: "홈" },
    { id: "about",       label: "소개" },
    { id: "skills",      label: "디자인 역량" },
    { id: "ai-skills",   label: "AI 활용 역량" },
    { id: "portfolio",   label: "프로젝트" },
    { id: "other-works", label: "아카이브" },
    { id: "page-bottom", label: "연락" },
  ];

  const targets = sections
    .map(s => ({ ...s, el: document.getElementById(s.id) }))
    .filter(s => s.el);

  if (!targets.length) return;

  // 중복 생성 방지
  if (document.querySelector(".dotnav")) return;

  // ✅ 메뉴 생성(항상 보이게)
  const nav = document.createElement("nav");
  nav.className = "dotnav";
  nav.setAttribute("aria-label", "섹션 빠른 이동");
  document.body.appendChild(nav);

  const btns = targets.map((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dotnav__btn";
    btn.setAttribute("aria-label", s.label);

    const dot = document.createElement("span");
    dot.className = "dotnav__dot";
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "dotnav__label";
    label.textContent = s.label;

    btn.appendChild(dot);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(s.el, { offset: -10 });
      } else {
        s.el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    nav.appendChild(btn);
    return btn;
  });

  const setActive = (activeId) => {
    btns.forEach((b, i) => {
      const on = targets[i].id === activeId;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  };

  // ✅ 기준점(헤더 아래 + 화면 중간)이 "포함되는 섹션"을 active로
const getFocusY = () => {
  const header = document.querySelector(".header");
  const headerH = header ? header.offsetHeight : 0;

  // 헤더 바로 아래부터 보이는 영역의 중앙을 기준점으로
  return headerH + (window.innerHeight - headerH) * 0.35; 
  // 0.35~0.5 사이로 취향 조절 가능 (0.35면 좀 더 빨리 다음 섹션 잡힘 방지)
};

const updateActiveByScroll = () => {
  const focusY = getFocusY();

  // 1) 기준점이 "섹션 안"에 들어있는 섹션이 있으면 그걸 선택
  let inside = null;

  for (const s of targets) {
    const r = s.el.getBoundingClientRect();
    if (r.top <= focusY && r.bottom >= focusY) {
      inside = s;
      break;
    }
  }

  if (inside) {
    setActive(inside.id);
    return;
  }

  // 2) (예외) 아무 섹션에도 안 들어가면 기준점과 가장 가까운 섹션 선택
  let closest = targets[0];
  let bestDist = Infinity;

  for (const s of targets) {
    const r = s.el.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - focusY);
    if (dist < bestDist) {
      bestDist = dist;
      closest = s;
    }
  }

  setActive(closest.id);
};

// 스크롤 최적화(잔상/튐 방지)
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateActiveByScroll();
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

// 초기 1회
updateActiveByScroll();
  setActive(targets[0].id);
});