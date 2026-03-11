/* ================================
   portfolio-js-otherworks.js
   ✅ 3단 갤러리: "프로젝트(슬라이드) 1개당 카드 1개"
   ✅ 모달에서 해당 프로젝트 이미지들(left + rights) 넘기기
   ✅ 썸네일 클릭으로 이미지 전환
   ✅ ESC 닫기 / 좌우키 이미지 이동
================================ */
let savedScrollY = 0;





(() => {
  const OTHER_WORKS_SLIDES = [
    {
      thumb: { src: "images/nouvedilie_thumb.png", alt: "누베딜리 상세 페이지 및 배너 썸네일" },
      left: { src: "images/nouvedilie1.png", alt: "누베딜리 상세 페이지" },
      rights: [ {src: "images/nouvedilie_banner.png", alt: "누베딜리 배너"} ],
      title: "누베딜리 상세 페이지 및 배너",
      desc: "누베딜리 웹페이지의 제품 썸네일을 클릭하면 나오는 상세 페이지 및 배너",
      topic: "일상에서 부담없이 캐주얼하게 착용 가능한 반지",
      age: "30대 ~ 40대 이상",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/Crowny_thumb.png", alt: "ClassCare 웹앱 시험 파트 UI 디자인" },
      left: { src: "images/Crowny1.png", alt: "ClassCare 웹앱 시험 파트 UI 디자인" },
      rights: [ {src: "images/Crowny2.png", alt: "ClassCare 웹앱 시험 파트 UI 디자인"} ],
      title: "ClassCare 웹앱 시험 파트 UI 디자인",
      desc: "ClassCare 웹앱 시험 파트 UI 디자인",
      topic: "ClassCare 웹앱 시험 파트 UI 디자인",
      age: "ClassCare 웹앱 시험 파트 UI 디자인",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/headphone_banner_thumb.png", alt: "입문용 헤드폰 배너" },
      left: { src: "images/headphone_banner.png", alt: "입문용 헤드폰 배너" },
      rights: [],
      title: "입문용 헤드폰 배너",
      desc: "입문용 헤드폰 배너",
      topic: "입문용 헤드폰 배너",
      age: "입문용 헤드폰 구매에 관심있는 모든 고객",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/university_brochure_thumb.png", alt: "중앙대학교 리플렛 썸네일" },
      left: { src: "images/university_brochure1.png", alt: "중앙대학교 리플렛" },
      rights: [{src: "images/university_brochure2.png", alt: "중앙대학교 리플렛" }],
      title: "중앙대학교 리플렛",
      desc: "중앙대학교 리플렛",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "cover"
    },
    {
      thumb: { src: "images/carrot_thumb1.png", alt: "당근마켓 웹 배너 썸네일" },
      left: { src: "images/carrot_banner1.png", alt: "당근마켓 웹 배너1" },
      rights: [{ src: "images/carrot_banner2.png", alt: "당근마켓 웹 배너2" }],
      title: "당근마켓 웹 배너",
      desc: "당근마켓의 메인 컬러와 캐릭터를 활용해서 구인 목적으로 띄우는 광고 배너를 작업했습니다.",
      topic: "프로모션/이벤트 배너",
      age: "당근마켓을 사용하는 전 연령대 사용자",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/green_thumb.png", alt: "학원 모집 홍보 포스터 썸네일" },
      left: { src: "images/green17_poster.png", alt: "학원 모집 홍보 포스터" },
      rights: [],
      title: "학원 모집 홍보 포스터",
      desc: "Ideogram을 활용해 이미지를 생성하고 variation을 도출해 전체적인 색상을 반영했습니다. 빠르고 높은 취업률을 강점으로 내세운 콘셉트입니다.",
      topic: "학원 모집 홍보 포스터",
      age: "학원 수강에 관심이 있는 10대 ~ 30대 이상",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      left: { src: "images/game_banner_260121.png", alt: "게임 배너" },
      rights: [ {src: "images/KartRider_banner.png"} ],
      title: "카트 게임 배너",
      desc: "카트 게임 배너를 ChatGPT로 이미지 생성 후 제작했습니다.",
      topic: "프로모션/이벤트 배너",
      age: "전 연령(게임 사용자)",
      caption: "",
      link: "#",
      thumbFit: "cover"
    },
    {
      thumb: { src: "images/mcs_thumb.png", alt: "대한민국 공익광고제 포스터 썸네일" },
      left: { src: "images/mcs1.jpg", alt: "한전MCS 플로깅 판넬" },
      rights: [{ src: "images/mcs2.png", alt: "한전MCS 플로깅 계획안" },
                { src: "images/mcs3.jpg", alt: "한전MCS 플로깅 계획안" }
      ],
      title: "한전MCS 플로깅 판넬 및 계획안",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/AMC1_thumb.png", alt: "AMC2024 썸네일"},
      left: { src: "images/AMC1.png", alt: "AMC2024" },
      rights: [ { src: "images/AMC2.png", alt: "AMC2024" },
                { src: "images/AMC3.png", alt: "AMC2024" },
                { src: "images/AMC4.png", alt: "AMC2024" },
                { src: "images/AMC5.png", alt: "AMC2024" },
                { src: "images/AMC6.png", alt: "AMC2024" },
                { src: "images/AMC7.png", alt: "AMC2024" },
       ],
      title: "AMC2024",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      left: { src: "images/top.jpg", alt: "티오피월드 행정사사무소 명함" },
      rights: [],
      title: "티오피월드 행정사사무소 명함",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/mcs_water_thumb.png", alt: "한전MCS 청렴수 물병 라벨지 썸네일" },
      left: { src: "images/mcs_water.png", alt: "한전MCS 청렴수 물병 라벨지" },
      rights: [ { src: "images/mcs_water2.png", alt: "한전MCS 청렴수 물병 라벨지" }, ],
      title: "한전MCS 청렴수 물병 라벨지",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/nanum_poster_thumb.png", alt: "대한민국 공익광고제 포스터 썸네일" },
      left: { src: "images/nanum_poster_mockup.png", alt: "대한민국 공익광고제 포스터" },
      rights: [],
      title: "대한민국 공익광고제 포스터",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/medal_poster_thumb.png", alt: "경기도 금연공감문화제 포스터 썸네일" },
      left: { src: "images/medal_poster_mockup.png", alt: "경기도 금연공감문화제 포스터" },
      rights: [],
      title: "경기도 금연공감문화제 포스터",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/mcs_poster_thumb.png", alt: "중대재해 예방 포스터 썸네일" },
      left: { src: "images/mcs_poster.png", alt: "중대재해 예방 포스터" },
      rights: [],
      title: "중대재해 예방 포스터",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/insta_ukymelar_mockup_thumb.png", alt: "웨딩스튜디오 인스타그램 디자인 썸네일" },
      left: { src: "images/insta_ukymelar_mockup.png", alt: "웨딩스튜디오 인스타그램 디자인" },
      rights: [ { src: "images/insta_ukymelar.png", alt: "웨딩스튜디오 인스타그램 디자인" }],
      title: "웨딩스튜디오 인스타그램 디자인",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/iSuite_thumb.png", alt: "iSuite 홍보물 썸네일" },
      left: { src: "images/iSuite1.png", alt: "iSuite 홍보물" },
      rights: [ { src: "images/iSuite2.png", alt: "iSuite 홍보물" }],
      title: "iSuite 홍보물",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/ivh_thumb.png", alt: "iVH 기업 명함 썸네일" },
      left: { src: "images/ivh.png", alt: "iVH 기업 명함" },
      rights: [],
      title: "iVH 기업 명함",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/mud_poster_thumb.png", alt: "보령머드축제 포스터 썸네일" },
      left: { src: "images/mud_poster.png", alt: "보령머드축제 포스터" },
      rights: [],
      title: "보령머드축제 포스터",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/2023_guidance_thumb.png", alt: "2023 한국가이던스 팜플렛 썸네일" },
      left: { src: "images/2023_guidance.png", alt: "2023 한국가이던스 팜플렛" },
      rights: [ { src: "images/2023_guidance2.png", alt: "2023 한국가이던스 팜플렛" } ],
      title: "2023 한국가이던스 팜플렛",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/guidance_ssgi_thumb.png", alt: "SSGI 결과표 & 통계표 썸네일" },
      left: { src: "images/guidance_ssgi1.png", alt: "SSGI 결과표 & 통계표" },
      rights: [ { src: "images/guidance_ssgi2.png", alt: "SSGI 결과표 & 통계표" } ],
      title: "SSGI 결과표 & 통계표",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    },
    {
      thumb: { src: "images/guidance_ssda_thumb.png", alt: "SSDA 결과표 & 통계표 썸네일" },
      left: { src: "images/guidance_ssda1.png", alt: "SSDA 결과표 & 통계표" },
      rights: [ { src: "images/guidance_ssda2.png", alt: "SSDA 결과표 & 통계표" } ],
      title: "SSDA 결과표 & 통계표",
      desc: "",
      topic: "",
      age: "",
      caption: "",
      link: "#",
      thumbFit: "contain"
    }
  ];

  const grid = document.getElementById("otherWorksGrid3");
  if (!grid) return;

  // ✅ 카드 = 슬라이드 1개
  grid.innerHTML = OTHER_WORKS_SLIDES.map((s, i) => {
    const thumb = s.thumb?.src || s.left?.src || "";
    const alt = s.thumb?.alt || s.left?.alt || s.title || "";
    return `
      <article class="ow-card" role="button" tabindex="0" data-slide="${i}" aria-label="${s.title} 크게보기">
        <div class="ow-thumb">
          <img src="${thumb}" alt="${alt}" style="object-fit:${s.thumbFit || 'cover'};">
        </div>
        <div class="ow-body">
          <h3 class="ow-title">${s.title || ""}</h3>
          <p class="ow-caption">${s.caption || ""}</p>
        </div>
      </article>
    `;
  }).join("");

  // ===== 모달 요소 =====
  const modal = document.getElementById("owModal");
  const modalImg = document.getElementById("owModalImg");

    /* =========================
     ✅ ZOOM(돋보기) + PINCH(모바일 핀치줌)
  ========================= */

  // 1) 버튼 만들기(돋보기)
  const zoomBtn = document.createElement("button");
  if (window.innerWidth <= 768) zoomBtn.style.display = "none";
  zoomBtn.type = "button";
  zoomBtn.className = "ow-zoom-btn";
  zoomBtn.textContent = "🔍";
  zoomBtn.setAttribute("aria-label", "확대/축소");
  modalImg.parentElement.appendChild(zoomBtn);

  const figureEl = modalImg.closest(".ow-modal__figure");
  // ✅ 태블릿(769~1024): 스와이프(좌우)만 허용 느낌으로
if (window.innerWidth <= 1024 && window.innerWidth > 768) {
  figureEl.style.touchAction = "pan-x";
}


  // // 2) 확대 상태 변수들
  // let scale = 1;     // 확대 배율
  // let tx = 0;        // x 이동
  // let ty = 0;        // y 이동

  // const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

  // const apply = () => {
  //   modalImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  //   figureEl?.classList.toggle("is-zoomed", scale > 1);
  // };

  // const resetZoom = () => {
  //   scale = 1; tx = 0; ty = 0;
  //   apply();
  // };

  // 3) 돋보기 버튼 = 확대/원복 토글
  zoomBtn.addEventListener("click", () => {
    if (scale === 1) {
      scale = 2; tx = 0; ty = 0;
      apply();
    } else {
      resetZoom();
    }
  });

  // 4) PC: 마우스 휠 확대/축소
  // figureEl?.addEventListener("wheel", (e) => {
  //   e.preventDefault();
  //   const delta = e.deltaY > 0 ? -0.12 : 0.12;
  //   scale = clamp(scale + delta, 1, 4);
  //   if (scale === 1) { tx = 0; ty = 0; }
  //   apply();
  // }, { passive: false });

  // 5) 공통: 드래그로 이동(확대 상태일 때만)
  // let isDrag = false;
  // let dragStartX = 0;
  // let dragStartY = 0;

  // figureEl?.addEventListener("pointerdown", (e) => {
  //   if (scale <= 1) return;
  //   isDrag = true;
  //   dragStartX = e.clientX - tx;
  //   dragStartY = e.clientY - ty;
  //   figureEl.setPointerCapture?.(e.pointerId);
  // });

  // figureEl?.addEventListener("pointermove", (e) => {
  //   if (!isDrag) return;
  //   tx = e.clientX - dragStartX;
  //   ty = e.clientY - dragStartY;
  //   apply();
  // });

  // figureEl?.addEventListener("pointerup", () => {
  //   isDrag = false;
  // });

  // figureEl?.addEventListener("pointercancel", () => {
  //   isDrag = false;
  // });

  // // 6) ⭐ 모바일: 두 손가락 핀치 줌
  // // 손가락 두 개의 거리로 확대/축소 계산
  // let pinchStartDist = 0;
  // let pinchStartScale = 1;

  // const getDist = (a, b) => {
  //   const dx = a.clientX - b.clientX;
  //   const dy = a.clientY - b.clientY;
  //   return Math.hypot(dx, dy);
  // };

  // figureEl?.addEventListener("touchstart", (e) => {
  //   if (e.touches.length === 2) {
  //     pinchStartDist = getDist(e.touches[0], e.touches[1]);
  //     pinchStartScale = scale;
  //   }
  // }, { passive: true });

  // figureEl?.addEventListener("touchmove", (e) => {
  //   if (e.touches.length === 2) {
  //     e.preventDefault(); // ⭐ 브라우저 기본 줌 막고 우리가 처리
  //     const dist = getDist(e.touches[0], e.touches[1]);
  //     const ratio = dist / pinchStartDist;
  //     scale = clamp(pinchStartScale * ratio, 1, 4);

  //     if (scale === 1) { tx = 0; ty = 0; }
  //     apply();
  //   }
  // }, { passive: false });

  // ✅ 이미지가 바뀌거나 모달 닫힐 때 resetZoom을 호출해야 깔끔해!
  // 아래 2곳에 resetZoom(); 한 줄씩 추가해줘:
  // 1) setModalImage() 맨 끝
  // 2) closeModal() 맨 끝

  const modalThumbs = document.getElementById("owModalThumbs");
  const modalTitle = document.getElementById("owModalTitle");
  const modalDesc = document.getElementById("owModalDesc");
  const modalTopic = document.getElementById("owModalTopic");
  const modalAge = document.getElementById("owModalAge");
  const modalLink = document.getElementById("owModalLink");
  const prevBtn = document.getElementById("owPrev");
  const nextBtn = document.getElementById("owNext");

  let currentSlide = 0;
  let currentImg = 0;
  let currentImages = [];
  let justOpened = false; // ⭐ 방금 열렸는지
  let opening = false; // ⭐ 열기 중(같은 클릭으로 닫히는 것 방지)

  const buildImages = (slide) => {
    const s = OTHER_WORKS_SLIDES[slide];
    const imgs = [];
    if (s?.left) imgs.push(s.left);
    (s?.rights || []).forEach((r) => imgs.push(r));
    return imgs;
  };

  const renderThumbs = () => {
  if (!modalThumbs) return;

  // ✅ 이미지가 1장이면 thumbs 숨김
if (!currentImages || currentImages.length <= 1) {
  modal.classList.add("no-thumbs");   // ⭐ 추가
  modalThumbs.style.display = "none";
  modalThumbs.innerHTML = "";
  return;
}
modal.classList.remove("no-thumbs"); // ⭐ 추가(2장 이상이면 복구)

  // ✅ 2장 이상이면 thumbs 보이기
  modalThumbs.style.display = "flex";

  modalThumbs.innerHTML = currentImages.map((im, idx) => {
    return `
      <button class="ow-modal__thumb ${idx === currentImg ? "is-active" : ""}"
              type="button"
              data-img="${idx}"
              aria-label="이미지 ${idx + 1}">
        <img src="${im.src}" alt="">
      </button>
    `;
  }).join("");
};

const setModalImage = (idx) => {
  currentImg = Math.max(0, Math.min(idx, currentImages.length - 1));
  const im = currentImages[currentImg];

  // ⭐ 스크롤 위치 초기화
  const panel = modal.querySelector(".ow-modal__panel");
  if (panel) panel.scrollTop = 0;

  // ⭐ 모달 스크롤 맨 위로
  modal.scrollTop = 0;
  
  modalImg.onerror = () => console.warn("❌ 이미지 로드 실패:", im.src);
  modalImg.src = im.src;
  modalImg.alt = im.alt || OTHER_WORKS_SLIDES[currentSlide]?.title || "";

  renderThumbs();
};

modalThumbs?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();  // ⭐ 캡처/버블 꼬임 방지
  const t = e.target.closest(".ow-modal__thumb");
  if (!t) return;
  const idx = Number(t.dataset.img);
  if (!Number.isNaN(idx)) setModalImage(idx);
});
const openModal = (slideIndex) => {
  currentSlide = Math.max(0, Math.min(slideIndex, OTHER_WORKS_SLIDES.length - 1));
  const s = OTHER_WORKS_SLIDES[currentSlide];

  currentImages = buildImages(currentSlide);
  currentImg = 0;
  
  // openModal 안, setModalImage(0) 직전에 추가:
  modal.scrollTop = 0;
  setModalImage(0);

  modalTitle.textContent = s.title || "";
  modalDesc.textContent = s.desc || "";
  modalTopic.textContent = s.topic || "";
  modalAge.textContent = s.age || "";
  modalLink.href = s.link || "#";

  modal.classList.add("image-only");
  modal.classList.add("is-open");

  opening = true;
  setTimeout(() => { opening = false; }, 0);

  justOpened = true;
  setTimeout(() => { justOpened = false; }, 150);

  modal.setAttribute("aria-hidden", "false");




  

  // ⭐ body 스크롤만 막기 (position 건드리지 않음)
  setModalImage(0);
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.classList.remove("image-only");
  modal.setAttribute("aria-hidden", "true");
};

  // ⭐ 모달 안 클릭은 전파 막기 (열렸다가 바로 닫히는 현상 방지)
const panel = modal.querySelector(".ow-modal__panel");
panel?.addEventListener("click", (e) => {
  e.stopPropagation();
});

modal.querySelector(".ow-modal__backdrop")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (opening) return;     // ⭐ 추가: 열기 직후 click로 닫히는 것 방지
    if (justOpened) return; // ⭐ 방금 열린 직후 클릭은 무시
    closeModal();
  });

  const moveImg = (dir) => {
    const next = dir === "next" ? currentImg + 1 : currentImg - 1;
    if (next < 0 || next > currentImages.length - 1) return;
    setModalImage(next);
  };

grid.addEventListener("pointerdown", (e) => {
  const card = e.target.closest(".ow-card");
  if (!card) return;

  e.preventDefault();
  e.stopPropagation();

  const idx = Number(card.dataset.slide);
  setTimeout(() => openModal(idx), 0); // ⭐ 핵심: 클릭 이벤트 끝난 다음에 열기
}, true);

  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".ow-card");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const idx = Number(card.dataset.slide);
      setTimeout(() => openModal(idx), 0); // ⭐ click 이벤트 끝난 다음에 열기

    }
  });

/* ===================================
   ✅ 모달 닫기: "이미지 제외한 어디든" 누르면 닫기 (100% 동작)
   - pointerdown + capture(캡처링)이라 이벤트가 막혀도 무조건 잡힘
=================================== */

// (주의) 닫기 버튼이 modal 밖에 있을 수도 있어서 document에서 찾기
const closeBtn = document.querySelector(".ow-modal__close");

// 닫기 버튼 클릭 -> 닫기 (가장 확실)
closeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeModal();
});

/* ===================================
   ✅ ESC 키로 모달 닫기
=================================== */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  // 모달이 열려있을 때만
  if (!modal.classList.contains("is-open")) return;

  e.preventDefault();
  closeModal();
});

/* ===================================
   ✅ 방향키로 이미지 이동 (← / →)
=================================== */
document.addEventListener("keydown", (e) => {
  // 모달이 열려있지 않으면 무시
  if (!modal.classList.contains("is-open")) return;

  // 줌 중일 때는 이미지 이동 막고 싶으면 여기서 return 처리 가능
  // if (scale > 1) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    moveImg("prev");
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    moveImg("next");
  }
});

// ✅ (디버그) carrot만 성공/실패 확인
(() => {
  const list = [
    "images/carrot_thumb1.png",
    "images/carrot_banner1.png",
    "images/carrot_banner2.png"
  ];

  list.forEach((src) => {
    const img = new Image();
    img.onload = () => console.log("%cOK  " + src, "color:#0a0");
    img.onerror = () => console.warn("%cFAIL " + src, "color:#f00");
    img.src = src + "?v=" + Date.now();
  });
})();
})();




/* ==========================================
   OW MODAL FINAL: 배경 고정 + 모달 휠 스크롤
   - openModal/closeModal 전역 없어도 동작 (MutationObserver)
   - Lenis/전역 wheel 캡처가 모달 휠 먹는 것 차단
========================================== */
(() => {
  const modal = document.getElementById("owModal");
  if (!modal) return;

  let savedY = 0;
  let locked = false;
  let ignoreWheelUntil = 0; // ✅ 닫힌 직후 휠 튐 방지용

  const lockBg = () => {
    if (locked) return;
    locked = true;

    savedY = window.lenis?.scroll ?? window.scrollY ?? window.pageYOffset ?? 0;


    // ✅ 배경 완전 고정 (가장 확실)
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.classList.add("modal-open");

    // ✅ Lenis 쓰면 stop
    window.lenis?.stop?.();
  };

  const unlockBg = () => {
  if (!locked) return;
  locked = false;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.classList.remove("modal-open");

  // ✅ 1) 네이티브 스크롤 위치도 같이 맞춰주기 (Lenis가 transform 쓰는 케이스 대비)
  window.scrollTo(0, savedY);

  // ✅ 2) Lenis 재개 + 같은 위치로 즉시 동기화
  if (window.lenis?.start) window.lenis.start();

  if (window.lenis?.scrollTo) {
    window.lenis.scrollTo(savedY, { immediate: true });
  }

  ignoreWheelUntil = performance.now() + 200;
};




  const sync = () => {
    if (modal.classList.contains("is-open")) lockBg();
    else unlockBg();
  };

  // ✅ 모달 open/close를 class 변화로 감지
  const obs = new MutationObserver(sync);
  obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
  sync();

  // ✅ 모달 위에서는 전역 wheel 캡처(가로변환 등) 못 건드리게 막기
  // (중요: preventDefault 안 함 → 모달 자체 스크롤은 정상 동작)
  const inModal = (target) => target instanceof Element && !!target.closest("#owModal");

  window.addEventListener(
  "wheel",
  (e) => {
    // 모달이 닫힌 직후 아주 잠깐 휠 입력은 무시(위로 굴릴 때 맨위 튐 방지)
    if (!modal.classList.contains("is-open") && performance.now() < ignoreWheelUntil) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },
  { capture: true, passive: false }
);

window.addEventListener(
  "wheel",
  (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (!inModal(e.target)) return;
    e.stopImmediatePropagation(); // ✅ 전역 휠 가로변환 코드 못오게 막기
  },
  { capture: true, passive: false }
);


  // 모바일 터치 스크롤도 전역 핸들러가 먹는 경우 방지
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (!inModal(e.target)) return;
      e.stopImmediatePropagation();
    },
    { capture: true, passive: true }
  );
})();
