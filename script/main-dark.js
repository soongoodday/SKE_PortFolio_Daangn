// helpers
function resolveAsset(path) {
  // "images/a.png" 같은 상대경로를
  // 현재 페이지 기준으로 절대 URL로 바꿔줌 (GitHub Pages 하위경로에서도 안전)
  try {
    return new URL(path, document.baseURI).href;
  } catch (e) {
    return path;
  }
}

function setImgSafe(imgEl, path, alt = '') {
  if (!imgEl) return;

  const url = resolveAsset(path);

  imgEl.onload = () => { if (DEBUG) console.log('✅ IMG LOADED:', url); };
  imgEl.onerror = () => { if (DEBUG) console.error('❌ IMG ERROR:', url); };

  imgEl.src = url;
  imgEl.alt = alt || '';
}


// Toggle console logs
const DEBUG = false;




const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const lerp = (a, b, t) => a + (b - a) * t;

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

// =======================
// 1) cursor glow + vars
// =======================
const cursorGlowEl = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let mx = 0.5, my = 0.5;
let scrollY = 0;

function updateRootVars() {
  const root = document.documentElement;
  root.style.setProperty('--mx', String(mx));
  root.style.setProperty('--my', String(my));
  root.style.setProperty('--scroll', String(scrollY));
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mx = clamp(mouseX / window.innerWidth, 0, 1);
  my = clamp(mouseY / window.innerHeight, 0, 1);

  if (cursorGlowEl && !prefersReducedMotion) {
    cursorGlowEl.style.left = `${mouseX}px`;
    cursorGlowEl.style.top = `${mouseY}px`;
    cursorGlowEl.style.opacity = '1';
  }
  updateRootVars();
});
document.addEventListener('mouseleave', () => {
  if (cursorGlowEl) cursorGlowEl.style.opacity = '0';
});
window.addEventListener('scroll', () => {
  scrollY = window.pageYOffset || 0;
  updateRootVars();
});

// =======================
// 2) mouse follower ship
// =======================
const fxFollower = document.getElementById('fxFollower');
let shipX = window.innerWidth * 0.2;
let shipY = window.innerHeight * 0.3;
let targetX = shipX;
let targetY = shipY;

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX + 20;
  targetY = e.clientY + 20;
});

function shipTick() {
  if (!fxFollower) return;
  shipX = lerp(shipX, targetX, 0.08);
  shipY = lerp(shipY, targetY, 0.08);

  const dx = targetX - shipX;
  const rot = clamp(dx * 0.08, -18, 18);
  const floatY = Math.sin(Date.now() * 0.004) * 6;

  fxFollower.style.transform = `translate3d(${shipX}px, ${shipY + floatY}px, 0) rotate(${rot}deg)`;
  requestAnimationFrame(shipTick);
}
requestAnimationFrame(shipTick);

// =======================
// 3) Press Start
// =======================
const pressBtn = document.getElementById('pressStartBtn');
pressBtn?.addEventListener('click', () => {
  pressBtn.classList.add('is-pressed');
  const hero = document.querySelector('.hero');
  hero?.classList.add('cyber-glitch');
  setTimeout(() => hero?.classList.remove('cyber-glitch'), 260);

  setTimeout(() => {
    document.getElementById('stage1')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    pressBtn.classList.remove('is-pressed');
  }, 220);
});

// nav cta
document.getElementById('navCta')?.addEventListener('click', () => {
  document.getElementById('stage3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// =======================
// 4) Back to top
// =======================
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTopButton) return;
  if (window.pageYOffset > 500) backToTopButton.classList.add('visible');
  else backToTopButton.classList.remove('visible');
});
backToTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =======================
// 5) Title auto glitch
// =======================
(() => {
  if (prefersReducedMotion) return;
  const titlePixels = document.querySelectorAll('.title-pixel');
  if (!titlePixels.length) return;

  const GLITCH_ON_MS = 900;

  function triggerTitleGlitch() {
    titlePixels.forEach(el => {
      el.classList.add('glitch-on');
      clearTimeout(el._autoGlitchTimer);
      el._autoGlitchTimer = setTimeout(() => el.classList.remove('glitch-on'), GLITCH_ON_MS);
    });
  }

  function loop() {
    const delay = Math.random() * 2200 + 2600;
    setTimeout(() => {
      triggerTitleGlitch();
      if (Math.random() < 0.22) {
        const hero = document.querySelector('.hero');
        hero?.classList.add('cyber-glitch');
        setTimeout(() => hero?.classList.remove('cyber-glitch'), 220);
      }
      loop();
    }, delay);
  }

  setTimeout(() => { triggerTitleGlitch(); loop(); }, 1200);
})();

// =======================
// 6) Skill + AI bars animate when visible
// =======================
function animateBars() {
  document.querySelectorAll('.fill[data-skill]').forEach(bar => {
    const v = bar.getAttribute('data-skill');
    if (v) bar.style.width = `${v}%`;
  });
  document.querySelectorAll('.fill.ai[data-ai]').forEach(bar => {
    const v = bar.getAttribute('data-ai');
    if (v) bar.style.width = `${v}%`;
  });
}
let barsAnimated = false;
const stage2 = document.getElementById('stage2');
const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !barsAnimated) {
      animateBars();
      barsAnimated = true;
    }
  });
}, { threshold: 0.25 });

if (stage2) barsObserver.observe(stage2);

// =======================
// 7) Tilt system
// =======================
function setupTilt() {
  if (prefersReducedMotion) return;
  const els = document.querySelectorAll('[data-tilt]');
  els.forEach(el => {
    const strength = parseFloat(el.getAttribute('data-tilt-strength') || '10');

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const px = (x - 0.5) * 2;
      const py = (y - 0.5) * 2;

      const ry = px * strength;
      const rx = -py * strength;

      const tx = px * 6;
      const ty = py * 6;

      el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;
    };

    const onLeave = () => { el.style.transform = ''; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}
setupTilt();

// =======================
// 8) QUEST MODAL (same data, game flavor)
// =======================
const modal = document.getElementById('projectModal');
const modalOverlay = modal?.querySelector('.modal-overlay');
const modalClose = modal?.querySelector('.modal-close');
const workItems = document.querySelectorAll('[data-project]');

const projectData = {
  nextlab: {
    title: '넥스트랩 웹페이지',
    category: 'MAIN QUEST • TEAM PROJECT',
    date: '2025.12 - 2026.02',
    status: '100% Complete',
    description: 'AI 스마트 CCTV 서비스 특성상 첫 화면에서 기술 신뢰도와 전문성이 즉시 전달되지 않으면 이탈 가능성이 높다고 판단했습니다. 이에 실제 제품 이미지와 명확한 핵심 카피를 중심으로 정보 위계를 단순화하고, 모바일 환경에서도 주요 메시지가 먼저 인지되도록 구조를 설계했습니다. 이 과정을 통해 디자인은 단순한 화면 구성보다 사용자가 정보를 접하는 ‘맥락’을 먼저 설계하는 일임을 체감했습니다.',
    role: '메인 디자이너 & 서브 페이지(2페이지) 코딩',
    tools: ['Figma', 'ChatGPT', 'HTML5', 'CSS3', 'Claude'],
    tags: ['Responsive', 'AI CCTV', 'Team Project'],
    image: 'images/nextlab_mac_pixel.png',
    imageAlt: '넥스트랩 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/i1trYEsjw6KASluXJO5Th2/%EB%84%A5%EC%8A%A4%ED%8A%B8%EB%9E%A9?node-id=793-4576&t=Fg8tdzJf0OV0n8RE-1',
    site: 'https://nextlab.ai.kr'
  },
  badaju: {
    title: '바다주 웹페이지',
    category: 'SIDE QUEST • WEB PUBLISHING',
    date: '2025.11 - 2026.01',
    status: '100% Complete',
    description: '기획부터 디자인, 퍼블리싱까지 전 과정에 참여한 프로젝트로, 사용자가 서비스 성격을 빠르게 이해할 수 있도록 컬러 variation 안에서 일관된 콘셉트를 유지했습니다. 타겟 연령대의 가독성을 고려해 아리따 돋움을 메인으로, Pretendard를 보조적으로 사용했으며, 20대부터 40대 이상까지 폭넓은 사용 환경을 고려한 정보 위계 중심의 화면 구조를 설계했습니다.',
    role: '디자인 & 퍼블리싱',
    tools: ['Figma', 'Photoshop', 'HTML5', 'CSS3', 'ChatGPT'],
    tags: ['Responsive', 'Publishing', 'Portfolio'],
    image: 'images/badaju_mac_pixel.png',
    imageAlt: '바다주 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/3yMd1m4K0Cd24DPP3pg8RV/%EC%B6%9C%ED%8C%90%EC%82%AC-%EB%B0%94%EB%8B%A4%EC%A3%BC_%EC%84%B1%EA%B2%BD%EC%9D%80?node-id=396-14&t=wuLjPRJJbLsuwGw7-1',
    site: 'https://soongoodday.github.io/badaju/'

  },
  ukymelar: {
    title: '유키멜라 웹페이지',
    category: 'SIDE QUEST • WEB REDESIGN',
    date: '2025.12 - 2026.01',
    status: '100% Complete',
    description: '기획부터 디자인, 퍼블리싱까지 전 과정에 참여한 프로젝트로, 포트폴리오 활용을 목적으로 작업 문의 등 핵심 정보 전달에 초점을 맞춰 설계했습니다. 시각적 인상을 강화하기 위해 꽃잎과 필름 형태의 디자인 요소를 적용했으며, 스와이퍼 슬라이드를 활용해 사용자의 능동적인 콘텐츠 탐색을 유도했습니다.',
    role: '디자인 & 퍼블리싱',
    tools: ['Figma', 'Photoshop', 'HTML5', 'CSS3', 'Ideogram'],
    tags: ['Photographer', 'UX/UI'],
    image: 'images/ukymelar_mac_pixel.png',
    imageAlt: '유키멜라 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/xOiNMquZhso1HXhskpfabI/%EC%84%B1%EA%B2%BD%EC%9D%80_%EC%9C%A0%ED%82%A4%EB%A9%9C%EB%9D%BC?node-id=198-2&t=cOG2wfOoxRHlKNQo-1',
    site: 'https://soongoodday.github.io/ukymelar/'
  },
  cheil: {
    title: '분당제일여성병원 웹페이지',
    category: 'SIDE QUEST • WEB PUBLISHING',
    date: '2025.12',
    status: '100% Complete',
    description: '기획부터 디자인, 퍼블리싱까지 전 과정에 참여한 리디자인 프로젝트로, 기존 와이드 구조로 인한 가독성 저하 문제를 개선하는 데 집중했습니다. HI 컬러를 유지하면서도 신뢰감을 전달할 수 있는 네이비 계열을 적용하고, 히어로 애니메이션과 마우스 오버 효과를 통해 사용자의 자연스러운 시선 이동과 인터랙션을 유도했습니다.',
    role: '디자인 & 퍼블리싱',
    tools: ['Figma', 'Photoshop', 'HTML5', 'CSS3', 'Midjourney'],
    tags: ['Bundang Cheil hospital', 'Redesign'],
    image: 'images/cheil_mac_pixel.png',
    imageAlt: '분당제일여성병원 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/S0XNoRVIU8UADx7Qh67SUa/%EC%84%B1%EA%B2%BD%EC%9D%80_%EB%B6%84%EB%8B%B9%EC%A0%9C%EC%9D%BC%EC%97%AC%EC%84%B1%EB%B3%91%EC%9B%90?node-id=116-14&t=PVg3aZdm0LsRg6u2-1',
    site: 'https://soongoodday.github.io/Bundang_Cheil/'
  },
  nouvedilie: {
    title: '누베딜리 웹페이지',
    category: 'SIDE QUEST • WEB REDESIGN',
    date: '2026.01',
    status: '100% Complete',
    description: '가상의 반지 브랜드를 주제로, 일상 착용이 가능하면서도 합리적인 가격대의 어포더블 럭셔리 포지션을 설정해 기획·디자인한 브랜딩 프로젝트입니다. 30~40대 이상 사용자를 고려해 정보 전달은 명확하게, 디테일은 절제된 방식으로 표현하여 제품 가치와 신뢰가 함께 전달되도록 설계했습니다.',
    role: '기획 & 디자인',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'ChatGPT', 'Ideogram'],
    tags: ['Nouvedilie', 'Affordable Luxury'],
    image: 'images/nouvedilie_mac_pixel.png',
    imageAlt: '누베딜리 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/782Iu0q50cB7mjHo7Px1H4/%EB%88%84%EB%B2%A0%EB%94%9C%EB%A6%AC?node-id=194-2&t=6JrsP6T8ok8zaHih-1'
  },
  art: {
    title: '미대입시닷컴 웹페이지',
    category: 'SIDE QUEST • WEB REDESIGN',
    date: '2025.12',
    status: '100% Complete',
    description: '기획부터 디자인까지 참여한 리디자인 프로젝트로, 정보가 많고 복잡한 기존 구조를 가독성과 정보 위계 중심으로 재정비했습니다. 미대 입시생과 입시 관련 교사를 주요 사용자로 설정해 감성과 가독성을 동시에 고려했으며, 가평 물결체와 Pretendard를 역할에 맞게 분리 적용했습니다.',
    role: '기획 & 디자인',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'Ideogram'],
    tags: ['Art academy', 'Redesign'],
    image: 'images/art_mac_pixel.png',
    imageAlt: '미대입시닷컴 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/NsA1uGG1njB0qcf5WiEbIG/%EB%AF%B8%EB%8C%80%EC%9E%85%EC%8B%9C%EB%8B%B7%EC%BB%B4_%EC%84%B1%EA%B2%BD%EC%9D%80?node-id=31-153&t=Gg85AwsMLXIRDqhh-1'
  },
  wethink: {
    title: '위띵크 디자인 스트리밍 & 커뮤니티 앱',
    category: 'SIDE QUEST • APP REDESIGN',
    date: '2025.11',
    status: '100% Complete',
    description: '모바일 환경에서 스트리밍 시청과 커뮤니티 활동이 동시에 이루어지는 경험을 목표로 기획한 앱 디자인 프로젝트입니다. 치지직과 협업 툴 UI를 참고해 시청 몰입도를 해치지 않으면서도 소통이 자연스럽게 이어질 수 있도록 설계했으며, 스트리밍 화면과 디자인 캔버스 화면을 핵심 UX 영역으로 중점적으로 구성했습니다.',
    role: '기획 & 디자인',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'ChatGPT'],
    tags: ['Collaboration Tool', 'Community'],
    image: 'images/wethink_mac_pixel.png',
    imageAlt: '미대입시닷컴 웹페이지 미리보기',
    figma: 'https://www.figma.com/design/gaEyN3IWC2B6y6SPfUzVUk/%EC%84%B1%EA%B2%BD%EC%9D%80_%EC%9C%84%EB%9D%B5%ED%81%AC?node-id=84-6512&t=HjPFrHIKxnsQ6zN3-1'
  },
  cutine: {
    title: '컷틴 커트 주기 관리 웹앱',
    category: 'SIDE QUEST • WEBAPP REDESIGN',
    date: '2026.02',
    status: '100% Complete',
    description: '컷틴은 커트 주기 관리의 번거로움을 줄이기 위해 기획한 웹앱으로, 사용자가 주기를 설정하고 알림을 통해 커트 시기를 놓치지 않도록 돕는 데 초점을 맞췄습니다. 핵심 기능에 집중한 직관적인 인터페이스와 깔끔한 화면 구성을 통해 별도의 설명 없이도 바로 사용할 수 있는 사용자 경험을 목표로 설계했습니다.',
    role: '기획 & 디자인 & 코딩',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'ChatGPT', 'Claude Code'],
    tags: ['Hair', 'Cutting', 'Web App'],
    image: 'images/cutine_mobile_pixel.png',
    images: [
      'images/cutine_mobile_pixel.png',              // ✅ 1번(메인)
      'images/cutine_QR.png'             // ✅ 2번(추가)
    ],
    imageAlt: '컷틴 웹앱 미리보기',
    figma: 'https://www.figma.com/design/8h5WOdODTTF7ZfqgiSccHK/%EC%BB%B7%ED%8B%B4?node-id=105-386&t=F2bVulVDLbAS3rAR-1',
    site: 'https://cutine-webapp.web.app/'
  },
};

function openModal(projectId) {
  if (!modal) return;
  const project = projectData[projectId];
  if (!project) return;

  // ✅ 이미지 세팅 (추가)
  const imgEl = modal.querySelector('#modalMainImg');
  if (imgEl) {
    const first = (project.images && project.images[0]) ? project.images[0] : project.image;
    setImgSafe(imgEl, first || '', project.imageAlt || project.title || '');
  }

  modal.querySelector('.modal-title').textContent = project.title;

  modal.querySelector('.modal-meta').innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.2rem;margin-bottom:1.2rem;font-size:0.9rem;">
      <div><strong style="color: var(--neon-blue);">QUEST:</strong><br>${project.category}</div>
      <div><strong style="color: var(--neon-blue);">DATE:</strong><br>${project.date}</div>
      <div><strong style="color: var(--neon-blue);">STATUS:</strong><br><span style="color: var(--neon-green);">${project.status}</span></div>
      <div><strong style="color: var(--neon-blue);">ROLE:</strong><br>${project.role}</div>
    </div>
    <div style="margin-top:0.6rem;">
      <strong style="color: var(--neon-purple);">TOOLS:</strong><br>
      <span style="color: var(--lighter-gray);">${project.tools.join(', ')}</span>
    </div>
  `;

  modal.querySelector('.modal-description').textContent = project.description;

  const tagsHTML = project.tags.map(tag =>
    `<span style="padding:0.5rem 0.9rem;background:rgba(0,240,255,0.1);border:1px solid rgba(0,240,255,0.3);border-radius:999px;font-size:0.75rem;color:var(--neon-blue);">${tag}</span>`
  ).join('');

  modal.querySelector('.modal-details').innerHTML = `
    <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 1rem; color: var(--neon-purple);">REWARDS</h3>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">${tagsHTML}</div>
  `;

  // ✅ (추가) 컷틴처럼 images가 여러장일 때 썸네일 만들기
  const imgs = Array.isArray(project.images) && project.images.length
    ? project.images
    : (project.image ? [project.image] : []);

  const detailsEl = modal.querySelector('.modal-details');
  const imgEl2 = modal.querySelector('#modalMainImg');

  // 기존 갤러리 있으면 제거(다른 프로젝트 눌렀을 때 중복 방지)
  modal.querySelector('.modal-gallery')?.remove();

  if (detailsEl && imgEl2 && imgs.length > 1) {
    const gallery = document.createElement('div');
    gallery.className = 'modal-gallery';
    gallery.style.cssText = 'display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;';

    gallery.innerHTML = imgs.map((src, i) => `
    <button type="button" data-modal-img="${i}"
      style="border:1px solid rgba(0,240,255,.3);background:rgba(0,240,255,.08);border-radius:12px;padding:.35rem;cursor:pointer;">
      <img src="${resolveAsset(src)}" alt="thumb ${i + 1}"
        style="width:92px;height:auto;display:block;border-radius:10px;">
    </button>
  `).join('');

    detailsEl.appendChild(gallery);

    // 썸네일 누르면 큰 이미지(#modalMainImg)가 바뀌게 하기
    gallery.addEventListener('click', (e) => {
      const b = e.target.closest('[data-modal-img]');
      if (!b) return;
      const idx = Number(b.dataset.modalImg);
      if (!imgs[idx]) return;
      setImgSafe(imgEl2, imgs[idx], project.imageAlt || project.title || '');
    });
  }

  // ✅ 모달 버튼 2개 찾기
  const figmaBtn = document.getElementById('modalFigma');
  const siteBtn = document.getElementById('modalSite');

  // ✅ 프로젝트에 링크 있으면 버튼에 꽂기 / 없으면 숨기기
  if (figmaBtn) {
    if (project.figma) {
      figmaBtn.href = project.figma;
      figmaBtn.style.display = '';
    } else {
      figmaBtn.style.display = 'none';
    }
  }

  if (siteBtn) {
    if (project.site) {
      siteBtn.href = project.site;
      siteBtn.style.display = '';
    } else {
      siteBtn.style.display = 'none';
    }
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('.modal-close')?.focus(), 0);
}

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

workItems.forEach(item => {
  item.addEventListener('click', () => {
    const projectId = item.getAttribute('data-project');
    if (projectId) openModal(projectId);
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
});

// =======================
// 10) typing text
// =======================
(() => {
  const el = document.getElementById('typingText');
  if (!el) return;

  if (prefersReducedMotion) {
    el.textContent = 'SYSTEM ONLINE';
    return;
  }

  const texts = [
    'INSERT COIN',
    'NEW GAME / CONTINUE?',
    'LOADING PLAYER DATA...',
    'QUESTS UPDATED',
    'PRESS START TO DEPLOY'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = texts[textIndex];

    if (!deleting) {
      el.textContent = current.slice(0, charIndex++);
      if (charIndex > current.length + 6) deleting = true;
    } else {
      el.textContent = current.slice(0, charIndex--);
      if (charIndex < 0) {
        deleting = false;
        charIndex = 0;
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(typeLoop, deleting ? 40 : 70);
  }

  setTimeout(typeLoop, 600);
})();



/* =========================
   OTHER WORKS ARCHIVE (NEW)
========================= */
(() => {
  // ✅ 여기만 네 작업물 데이터로 채우면 끝!
  const OTHER_WORKS = [
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "누베딜리 상세 페이지 및 배너",
      meta: "Design • 2026",
      desc: "가상의 반지 브랜드 누베딜리 상세 페이지 및 배너",
      topic: "가상의 반지 브랜딩/nouvedilie",
      age: "반지 구입 의향이 있는 30대 ~ 40대 이상 여성",
      figma: "https://www.figma.com/",
      images: ["images/detail_nouvedilie1.png", "images/nouvedilie_banner.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "ClassCare 웹앱 시험 파트 UI 디자인",
      meta: "Design • 2026",
      desc: "ClassCare 웹앱 시험 파트 UI 디자인",
      topic: "ClassCare 웹앱 시험 파트 UI 디자인",
      age: "ClassCare 웹앱 사용자",
      figma: "https://www.figma.com/",
      images: ["images/Crowny1.png", "images/Crowny2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "입문용 헤드폰 배너",
      meta: "Design • 2026",
      desc: "입문용 헤드폰 배너",
      topic: "입문용 헤드폰/배너",
      age: "입문용 헤드폰 구매에 관심있는 모든 고객",
      figma: "https://www.figma.com/",
      images: "images/headphone_banner.png"
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "중앙대학교 리플렛",
      meta: "Design • 2026",
      desc: "중앙대학교 리플렛",
      topic: "중앙대학교/리플렛",
      age: "중앙대학교 관계자 및 학생",
      figma: "https://www.figma.com/",
      images: ["images/university_brochure1.png", "images/university_brochure2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "당근마켓 웹 배너",
      meta: "Design • 2026",
      desc: "당근마켓 웹 배너",
      topic: "당근마켓/배너",
      age: "당근마켓 사용자",
      figma: "https://www.figma.com/",
      images: ["images/carrot_banner1.png", "images/carrot_banner2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "학원 모집 홍보 포스터",
      meta: "Design • 2026",
      desc: "학원 모집 홍보 포스터",
      topic: "학원/홍보 포스터",
      age: "학원 수강에 관심있는 고객",
      figma: "https://www.figma.com/",
      images: "images/green17_poster.png"
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "카트 게임 배너",
      meta: "Design • 2026",
      desc: "카트 게임 배너",
      topic: "카트 게임/배너",
      age: "카트 게임 이용자",
      figma: "https://www.figma.com/",
      images: ["images/game_banner.png", "images/KartRider_banner.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "한전MCS 플로깅 판넬 및 계획안",
      meta: "Design • 2025",
      desc: "한전MCS 플로깅 판넬 및 계획안",
      topic: "한전MCS/플로깅/판넬/계획안",
      age: "한전MCS 관계자",
      figma: "https://www.figma.com/",
      images: ["images/mcs1.jpg", "images/mcs2.jpg", "images/mcs3.jpg"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "AMC2024",
      meta: "Design • 2024",
      desc: "AMC2024",
      topic: "AMC2024/X배너/프로그램북/현수막/네임택",
      age: "AMC2024 관계자 및 참가자",
      figma: "https://www.figma.com/",
      images: ["images/AMC1.png", "images/AMC2.png", "images/AMC3.png", "images/AMC4.png", "images/AMC5.png", "images/AMC6.png", "images/AMC7.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "티오피월드 행정사사무소 명함",
      meta: "Design • 2025",
      desc: "티오피월드 행정사사무소 명함",
      topic: "티오피월드/행정사사무소/명함",
      age: "티오피월드 행정사",
      figma: "https://www.figma.com/",
      images: ["images/top.jpg"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "한전MCS 청렴수 물병 라벨지",
      meta: "Design • 2025",
      desc: "한전MCS 청렴수 물병 라벨지",
      topic: "한전MCS/청렴수/라벨지",
      age: "한전MCS 관계자 및 고객사",
      figma: "https://www.figma.com/",
      images: ["images/mcs_water.png", "images/mcs_water2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "대한민국 공익광고제 포스터",
      meta: "Design • 2025",
      desc: "대한민국 공익광고제 포스터",
      topic: "공익광고제/포스터",
      age: "대한민국 공익광고 관계자",
      figma: "https://www.figma.com/",
      images: ["images/nanum_poster.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "경기도 금연공감문화제 포스터",
      meta: "Design • 2025",
      desc: "경기도 금연공감문화제 포스터",
      topic: "경기도/금연공감문화제/포스터",
      age: "경기도 금연공감문화제 관계자",
      figma: "https://www.figma.com/",
      images: ["images/medal_poster.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "중대재해 예방 포스터",
      meta: "Design • 2023",
      desc: "중대재해 예방 포스터",
      topic: "중대재해 예방/포스터",
      age: "중대재해 예방 관련 관계자 및 일반 대중",
      figma: "https://www.figma.com/",
      images: ["images/mcs_poster.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "웨딩스튜디오 인스타그램 디자인",
      meta: "Design • 2025",
      desc: "웨딩스튜디오 인스타그램 디자인",
      topic: "웨딩스튜디오/인스타그램",
      age: "웨딩스튜디오 관계자 및 고객",
      figma: "https://www.figma.com/",
      images: ["images/insta_ukymelar_mockup.png", "images/insta_ukymelar.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "iSuite 홍보물",
      meta: "Design • 2025",
      desc: "iSuite 홍보물",
      topic: "iSuite/홍보물",
      age: "iSuite 기술에 관심있는 기업",
      figma: "https://www.figma.com/",
      images: ["images/iSuite1.png", "images/iSuite2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "iVH 기업 명함",
      meta: "Design • 2025",
      desc: "iVH 기업 명함",
      topic: "기업/명함",
      age: "iVH 관계자 및 고객",
      figma: "https://www.figma.com/",
      images: ["images/ivh.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "보령머드축제 포스터",
      meta: "Design • 2024",
      desc: "보령머드축제 포스터",
      topic: "보령머드축제/포스터",
      age: "보령머드축제 관계자 및 관심있는 국민",
      figma: "https://www.figma.com/",
      images: ["images/mud_poster.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "2023 한국가이던스 팜플렛",
      meta: "Design • 2023",
      desc: "2023 한국가이던스 팜플렛",
      topic: "기업/팜플렛",
      age: "한국가이던스 관계자 및 학교 상담 선생님",
      figma: "https://www.figma.com/",
      images: ["images/2023_guidance.png", "images/2023_guidance2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "SSGI 결과표 & 통계표",
      meta: "Design • 2023",
      desc: "SSGI 결과표 & 통계표",
      topic: "기업/결과표/통계표",
      age: "한국가이던스 관계자 및 학교 상담 선생님",
      figma: "https://www.figma.com/",
      images: ["images/guidance_ssgi1.png", "images/guidance_ssgi2.png"]
    },
    {
      tag: "ARCHIVE",
      status: "100%",
      title: "SSDA 결과표 & 통계표",
      meta: "Design • 2023",
      desc: "SSDA 결과표 & 통계표",
      topic: "기업/결과표/통계표",
      age: "한국가이던스 관계자 및 학교 상담 선생님",
      figma: "https://www.figma.com/",
      images: ["images/guidance_ssda1.png", "images/guidance_ssda2.png"]
    }
  ];

  const grid = document.getElementById("otherWorksGrid");
  const owModal = document.getElementById("owModal");

  const elTitle = document.getElementById("owTitle");
  const elMeta = document.getElementById("owMeta");
  const elDesc = document.getElementById("owDesc");
  const elTopic = document.getElementById("owTopic");
  const elAge = document.getElementById("owAge");
  const elImg = document.getElementById("owImg");
  const elFigma = document.getElementById("owFigma");

  const elPrev = document.getElementById("owPrev");
  const elNext = document.getElementById("owNext");
  const elIndex = document.getElementById("owIndex");
  const elTotal = document.getElementById("owTotal");
  const elThumbs = document.getElementById("owThumbs");

  if (!grid || !owModal) return;

  let current = 0;
  let currentImg = 0;
  let activeImages = [];




  // ✅ 이미지 배열 통일 (string/array 모두 지원)
  function normalizeImages(w) {
    if (Array.isArray(w.images) && w.images.length) return w.images.filter(Boolean);
    if (typeof w.images === 'string' && w.images) return [w.images];
    return [];
  }

  // ✅ 현재 이미지 표시
  function showImg(idx) {
    if (!activeImages.length) {
      console.error('❌ activeImages empty. check images path:', OTHER_WORKS[current]?.images);
      return;
    }

    currentImg = (idx + activeImages.length) % activeImages.length;
    setImgSafe(elImg, activeImages[currentImg], elTitle?.textContent || '');
    if (elIndex) elIndex.textContent = String(currentImg + 1);
    if (elTotal) elTotal.textContent = String(activeImages.length);
    // 썸네일 active 표시
    if (elThumbs) {
      elThumbs.querySelectorAll('.ow-thumb').forEach((b, i) => {
        b.classList.toggle('active', i === currentImg);
      });
    }
  }

  function renderThumbs() {
    if (!elThumbs) return;

    elThumbs.innerHTML = activeImages.map((src, i) => `
    <button class="ow-thumb ${i === currentImg ? 'active' : ''}" type="button" data-thumb="${i}">
      <img src="${resolveAsset(src)}" alt="thumb ${i + 1}">
    </button>
  `).join("");

    elThumbs.onclick = (e) => {
      const b = e.target.closest('[data-thumb]');
      if (!b) return;
      showImg(Number(b.dataset.thumb));
    };
  }

  // ✅ 이미지 클릭하면 다음 이미지
  elImg?.addEventListener('click', () => {
    if (activeImages.length <= 1) return;
    showImg(currentImg + 1);
  });

  // ✅ 키보드 Up/Down도 이미지 넘기기
  document.addEventListener('keydown', (e) => {
    if (!owModal.classList.contains('is-open')) return;
    if (activeImages.length <= 1) return;

    if (e.key === 'ArrowUp') showImg(currentImg - 1);
    if (e.key === 'ArrowDown') showImg(currentImg + 1);
  });



  function renderCards() {
    grid.innerHTML = OTHER_WORKS.map((w, i) => {
      const pv = normalizeImages(w)[0] || ''; // ✅ 첫 이미지 = preview로 사용
      return `
      <li class="ow-item">
        <article class="ow-card">
          <button class="ow-card-btn" type="button" data-ow="${i}" data-preview="${pv}">
            <div class="ow-top">
              <span class="ow-tag">${w.tag}</span>
              <span class="ow-status">${w.status}</span>
            </div>

            <h3 class="ow-title">${w.title}</h3>
            <p class="ow-desc">${w.desc}</p>

            <footer class="ow-footer">
              <span class="ow-meta">${w.meta}</span>
              <span class="ow-open">OPEN →</span>
            </footer>
          </button>
        </article>
      </li>
    `;
    }).join("");
  }

  function openOwModal(index) {
    current = index;
    const w = OTHER_WORKS[current];

    elTitle.textContent = w.title;
    elMeta.textContent = w.meta;
    elDesc.textContent = w.desc;
    elTopic.textContent = w.topic;
    elAge.textContent = w.age;

    activeImages = normalizeImages(w);
    currentImg = 0;
    showImg(0); // ✅ 여기서 이미지 + 인덱스/토탈까지 한 번에 처리
    renderThumbs();




    // figma 링크
    const hasLink = !!w.figma && w.figma !== "#";
    elFigma.href = hasLink ? w.figma : "#";
    elFigma.style.pointerEvents = hasLink ? "auto" : "none";
    elFigma.style.opacity = hasLink ? "1" : ".5";

    // ✅ (선택) 이미지가 여러 장이면 콘솔로 확인
    // console.log('activeImages=', activeImages);

    owModal.classList.add("is-open");
    owModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const bodyEl = owModal.querySelector(".ow-panel-body");
    if (bodyEl) bodyEl.scrollTop = 0;
  }

  function closeModal() {
    owModal.classList.remove("is-open");
    owModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function move(step) {
    const next = (current + step + OTHER_WORKS.length) % OTHER_WORKS.length;
    openOwModal(next)
  }

  // init
  renderCards();

  // open
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ow]");
    if (!btn) return;
    openOwModal(Number(btn.dataset.ow));
  });

  // close
  owModal.addEventListener("click", (e) => {
    if (e.target.matches("[data-ow-close]")) closeModal();
  });

  // nav + esc
  document.addEventListener("keydown", (e) => {
    if (!owModal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  elPrev?.addEventListener("click", () => move(-1));
  elNext?.addEventListener("click", () => move(1));
})();




/* =========================
   OW PREVIEW -> LIGHTBOX OPEN (ROBUST)
   ✅ DOM 로드 후 실행
   ✅ 이벤트 위임(owImg src가 바뀌어도 항상 동작)
========================= */
window.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('imgLb');
  const lbImg = document.getElementById('imgLbImg');

  if (!lb || !lbImg) {
    console.error('❌ Lightbox DOM not found: #imgLb / #imgLbImg');
    return;
  }

  function openLbWithSrc(src) {
    if (!src) return;
    lbImg.src = src;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    // 모달도 이미 잠그고 있다면 유지되어도 괜찮음
    document.body.style.overflow = 'hidden';
    console.log('✅ Lightbox open:', src);
  }

  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    // ⚠️ OW 모달이 열려있으면 overflow를 풀면 안 됨
    const owModalOpen = document.getElementById('owModal')?.classList.contains('is-open');
    if (!owModalOpen) document.body.style.overflow = '';
  }

  // ✅ (핵심) owImg를 직접 잡지 말고 문서에서 위임으로 잡기
  document.addEventListener('click', (e) => {
    const img = e.target.closest('#owImg');
    if (!img) return;

    e.preventDefault();
    e.stopPropagation();

    const src = img.currentSrc || img.getAttribute('src');
    console.log('🖱️ owImg clicked, src=', src);
    openLbWithSrc(src);
  });

  // 모바일 사파리 대비 touch
  document.addEventListener('touchend', (e) => {
    const img = e.target.closest('#owImg');
    if (!img) return;

    e.preventDefault();
    e.stopPropagation();

    const src = img.currentSrc || img.getAttribute('src');
    console.log('👆 owImg touch, src=', src);
    openLbWithSrc(src);
  }, { passive: false });

  // 닫기 (백드롭/닫기버튼)
  lb.addEventListener('click', (e) => {
    if (e.target.matches('[data-lb-close], .imglb-backdrop')) closeLb();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
  });
});





/* =========================
   IMAGE LIGHTBOX: Zoom + Pan (FINAL CENTER FIX)
========================= */
(() => {
  const lb = document.getElementById('imgLb');
  const viewport = document.getElementById('imgLbViewport');
  const img = document.getElementById('imgLbImg');
  const pctEl = document.getElementById('imgLbPct');

  if (!lb || !viewport || !img) return;

  const btnZoomIn = lb.querySelector('[data-lb-zoom-in]');
  const btnZoomOut = lb.querySelector('[data-lb-zoom-out]');
  const btnReset = lb.querySelector('[data-lb-reset]');

  let scale = 1;
  let tx = 0;
  let ty = 0;

  const MIN = 0.25;  // ✅ 100%보다 더 축소 가능
  const MAX = 6;

  const clamp2 = (v, a, b) => Math.max(a, Math.min(b, v));

  function getImgSize() {
    const iw = img.naturalWidth || img.width || 1;
    const ih = img.naturalHeight || img.height || 1;
    return { iw, ih };
  }

  // ✅ 항상 "가운데 유지" + (큰 경우엔 드래그 범위 제한)
  function clampTranslate() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const { iw, ih } = getImgSize();

    const sw = iw * scale;
    const sh = ih * scale;

    if (sw <= vw) tx = (vw - sw) / 2;
    else tx = clamp2(tx, vw - sw, 0);

    if (sh <= vh) ty = (vh - sh) / 2;
    else ty = clamp2(ty, vh - sh, 0);
  }

  function render() {
    clampTranslate();
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    if (pctEl) pctEl.textContent = `${Math.round(scale * 100)}%`;
  }

  function reset() {
    scale = 1;
    tx = 0;
    ty = 0;
    render();
  }

  // ✅ 특정 포인트 기준으로 줌
  function zoomAt(newScale, clientX, clientY) {
    newScale = clamp2(newScale, MIN, MAX);

    const rect = viewport.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    const ix = (px - tx) / scale;
    const iy = (py - ty) / scale;

    scale = newScale;
    tx = px - ix * scale;
    ty = py - iy * scale;

    render();
  }

  /* WHEEL 줌 */
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    const step = 0.12;
    zoomAt(scale * (1 + step * dir), e.clientX, e.clientY);
  }, { passive: false });

  /* DRAG */
  let isDown = false;
  let startX = 0, startY = 0;
  let baseTx = 0, baseTy = 0;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isDown = true;
    viewport.classList.add('is-dragging');
    startX = e.clientX;
    startY = e.clientY;
    baseTx = tx;
    baseTy = ty;
    viewport.setPointerCapture?.(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    tx = baseTx + (e.clientX - startX);
    ty = baseTy + (e.clientY - startY);
    render();
  });

  function endDrag(e) {
    if (!isDown) return;
    isDown = false;
    viewport.classList.remove('is-dragging');
    viewport.releasePointerCapture?.(e.pointerId);
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  /* DOUBLE CLICK */
  viewport.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (scale < 1.8) zoomAt(2.2, e.clientX, e.clientY);
    else reset();
  });

  /* BUTTONS */
  btnZoomIn?.addEventListener('click', () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(scale * 1.2, r.left + r.width / 2, r.top + r.height / 2);
  });

  btnZoomOut?.addEventListener('click', () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(scale / 1.2, r.left + r.width / 2, r.top + r.height / 2);
  });

  btnReset?.addEventListener('click', reset);

  // ✅ 라이트박스 열릴 때/이미지 로드될 때 항상 중앙 리셋
  const mo = new MutationObserver(() => {
    if (lb.classList.contains('is-open')) reset();
  });
  mo.observe(lb, { attributes: true, attributeFilter: ['class'] });

  img.addEventListener('load', () => {
    reset();
    // 이미지 로드 직후 레이아웃 튀는 경우 한 번 더
    requestAnimationFrame(reset);
  });

  // 최초
  render();
})();




function syncHudHeight() {
  const card = document.querySelector('.hero-container');
  const hud = document.querySelector('.hero-hud');
  if (!card || !hud) return;

  // 카드 높이를 HUD에 그대로 적용
  hud.style.height = card.offsetHeight + 'px';
}

// 최초 1번 + 리사이즈/폰트 로딩 후
window.addEventListener('load', syncHudHeight);
window.addEventListener('resize', syncHudHeight);

// 폰트 때문에 로딩 후 높이가 바뀌는 경우 대비
setTimeout(syncHudHeight, 200);
setTimeout(syncHudHeight, 800);





/* =========================
   HUD CHAT SYSTEM (ONE BLOCK)
========================= */
(() => {
  const hudLines = document.getElementById('hudLines');
  const form = document.getElementById('hudForm');
  const input = document.getElementById('hudInput');
  const caret = document.getElementById('hudCaret');

  if (!hudLines || !form || !input) return;

  const MAX_LINES = 30;

  // auto-scroll lock
  let stickToBottom = true;
  const BOTTOM_GAP = 12;

  function isNearBottom(el) {
    return (el.scrollHeight - el.scrollTop - el.clientHeight) <= BOTTOM_GAP;
  }

  let newBadge = null;
  function showNewBadge() {
    if (newBadge) return;
    newBadge = document.createElement('button');
    newBadge.type = 'button';
    newBadge.className = 'hud-new-badge';
    newBadge.textContent = 'NEW MESSAGES ↓';
    newBadge.addEventListener('click', () => {
      hudLines.scrollTop = hudLines.scrollHeight;
      stickToBottom = true;
      hideNewBadge();
    });
    hudLines.parentElement?.appendChild(newBadge);
  }
  function hideNewBadge() {
    newBadge?.remove();
    newBadge = null;
  }

  hudLines.addEventListener('scroll', () => {
    stickToBottom = isNearBottom(hudLines);
    if (stickToBottom) hideNewBadge();
  });

  function trim() {
    const lines = Array.from(hudLines.querySelectorAll('.hud-line'));
    if (lines.length <= MAX_LINES) return;

    for (const line of lines) {
      if (line.dataset.typing === 'true') continue;
      line.remove();
      break;
    }

    if (stickToBottom) hudLines.scrollTop = hudLines.scrollHeight;
    else showNewBadge();
  }

  function addLine(tag, msg, accent = false) {
    const line = document.createElement('div');
    line.className = 'hud-line';
    line.innerHTML = `
      <span class="hud-tag">[${tag}]</span>
      <span class="${accent ? 'hud-accent' : ''}">${msg}</span>
    `;
    if (caret) hudLines.insertBefore(line, caret);
    else hudLines.appendChild(line);
    trim();
    if (stickToBottom) hudLines.scrollTop = hudLines.scrollHeight;
  }

  function createTypingLine(tag, accent = false) {
    const line = document.createElement('div');
    line.className = 'hud-line';
    line.dataset.typing = 'true';

    const tagEl = document.createElement('span');
    tagEl.className = 'hud-tag';
    tagEl.textContent = `[${tag}]`;

    const msgEl = document.createElement('span');
    msgEl.className = accent ? 'hud-accent' : '';
    msgEl.textContent = '';

    const cursorEl = document.createElement('span');
    cursorEl.className = 'npc-cursor';
    cursorEl.textContent = '▌';

    line.appendChild(tagEl);
    line.appendChild(msgEl);
    line.appendChild(cursorEl);

    if (caret) hudLines.insertBefore(line, caret);
    else hudLines.appendChild(line);

    trim();
    return { line, msgEl, cursorEl };
  }

  // NPC reply
  const NPC_NAME = 'NPC';
  const NPC_KEYWORDS = [
    { keys: ['안녕', 'hi', 'hello', '반가워', 'ㅎㅇ'], replies: ['안녕! 오늘도 퀘스트 하러 왔어?', '반가워 :) 시작할 준비 됐어?'] },
    { keys: ['포트폴리오', '포폴'], replies: ['포트폴리오는 핵심 3개만 강하게 보여주면 돼.', '히어로 섹션 한 방이면 면접관 시선 잡는다.'] },
    { keys: ['면접', '자소서'], replies: ['면접은 역할 → 문제 → 결과 순서로 정리해.', '자소서는 수치 한 줄만 추가해도 달라져.'] },
    { keys: ['피그마', 'figma'], replies: ['오토레이아웃 정리하면 작업 속도 확 올라가.', '컴포넌트 네이밍부터 정리하자.'] },
    { keys: ['코딩', 'js', 'css', 'html'], replies: ['에러 나면 콘솔부터 확인.', '한 기능씩 켜보면 원인 바로 잡혀.'] },
    { keys: ['고마워', 'thanks', '땡큐'], replies: ['언제든 도와줄게.', 'EXP +1 획득.'] }
  ];
  const NPC_FALLBACK = ['로그 확인 완료.', '지금 흐름 좋아.', '그 방향 유지해.', '다음 액션을 선택해.'];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function getNpcReply(userText) {
    const t = userText.toLowerCase();
    for (const rule of NPC_KEYWORDS) {
      if (rule.keys.some(k => t.includes(k))) return pick(rule.replies);
    }
    return pick(NPC_FALLBACK);
  }

  function npcRespond(userText) {
    const reply = getNpcReply(userText);
    const { line, msgEl, cursorEl } = createTypingLine(NPC_NAME, true);

    let i = 0;
    const TYPE_MIN = 14;
    const TYPE_MAX = 26;
    const START_DELAY = Math.random() * 200 + 200;

    const typeTick = () => {
      if (!line.isConnected) return;
      msgEl.textContent = reply.slice(0, i++);
      if (i <= reply.length) {
        const next = Math.floor(Math.random() * (TYPE_MAX - TYPE_MIN + 1)) + TYPE_MIN;
        setTimeout(typeTick, next);
      } else {
        cursorEl.remove();
        delete line.dataset.typing;
        if (stickToBottom) hudLines.scrollTop = hudLines.scrollHeight;
        else showNewBadge();
      }
    };

    setTimeout(typeTick, START_DELAY);
  }

  // commands
  const COMMANDS = {
    help: () => addLine('SYSTEM', 'help / stage1 / stage2 / stage3 / stage4 / final / contact', true),
    stage1: () => document.getElementById('stage1')?.scrollIntoView({ behavior: 'smooth' }),
    stage2: () => document.getElementById('stage2')?.scrollIntoView({ behavior: 'smooth' }),
    stage3: () => document.getElementById('stage3')?.scrollIntoView({ behavior: 'smooth' }),
    stage4: () => document.getElementById('stage4')?.scrollIntoView({ behavior: 'smooth' }),
    final: () => document.getElementById('final')?.scrollIntoView({ behavior: 'smooth' }),
    contact: () => document.querySelector('.ending-cards')?.scrollIntoView({ behavior: 'smooth' }),
  };

  // submit (✅ only one)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = (input.value || '').trim();
    if (!raw) return;

    addLine('YOU', raw, false);

    input.value = '';
    input.focus();

    const cmd = raw.replace(/^\//, '').toLowerCase();
    if (COMMANDS[cmd]) return COMMANDS[cmd]();

    npcRespond(raw);
  });

  // boot
  addLine('SYSTEM', 'BOOT SEQUENCE START...', true);
  setTimeout(() => addLine('SYSTEM', 'HUD ONLINE', true), 250);
  setTimeout(() => addLine('SYSTEM', 'TYPE HELP OR SAY HI', true), 520);
  hudLines.scrollTop = hudLines.scrollHeight;

  // random chat loop
  const POOL = [
    ['디자인은 즐거워', '디자인은 매번 즐겁지만 어렵다…'],
    ['퍼블이 가장 쉬웠어요', '마크업하러 가야지'],
    ['개발하는 개미', '공부 열심히 해야지'],
    ['프론트론', '바이브 코딩하기 좋은 AI 추천해주라'],
    ['취준생A', '취뽀하고 말겠어'],
    ['이직아직', 'Claude랑 ChatGPT 같이 쓰는 중'],
    ['시닙', '채용 공고 떴더라'],
    ['웹디자인 마스터', '합격하고 싶다'],
    ['잘될사람누구게', '나를 믿어'],
    ['취업하고싶다', '디자인 정보 공유 좀'],
    ['경력직같은신입', '오토레이아웃 잘 걸어뒀지?'],
    ['코딩하는디자이너', '포트폴리오에 뭘 추가해야 하나?'],
    ['UXUI전문가', '사용자 경험이 중요하지'],
    ['프로젝트매니저', '일정 관리가 생명이지'],
    ['디자인러', '새로운 툴 좀 알려줘'],
    ['웹뻐블', '반응형 레이아웃 짜야지'],
    ['이직스타트', '최신 프레임워크 뭐가 있지?']
  ];
  const SYSTEM_POOL = ['📡 CONNECTION STABLE', '💾 AUTO SAVE COMPLETE', '🎮 QUEST UPDATED', '⚡ BOOST READY'];
  const RARE_RATE = 0.1;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let deck = [];
  let lastTag = '';

  function refillDeck() { deck = shuffle(POOL.slice()); }

  function pickNormal() {
    if (!deck.length) refillDeck();
    const idx = deck.findIndex(([tag]) => tag !== lastTag);
    return idx >= 0 ? deck.splice(idx, 1)[0] : deck.pop();
  }

  function loop() {
    if (Math.random() < RARE_RATE) {
      addLine('SYSTEM', pick(SYSTEM_POOL), true);
      lastTag = 'SYSTEM';
    } else {
      const [tag, msg] = pickNormal();
      addLine(tag, msg);
      lastTag = tag;
    }
    setTimeout(loop, Math.random() * 900 + 700);
  }

  addLine('서버', '채팅 로그 동기화 중…', true);
  setTimeout(loop, 1000);
})();




(function initHudClock() {
  const el = document.getElementById('hudTime');
  if (!el) return;

  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const d = new Date(); // ✅ 일단 로컬시간 (서버시간 필요하면 아래 2번)
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  tick();
  setInterval(tick, 1000);
})();




/* =========================
   NAV ACTIVE (HTML 유지 버전)
   script.js 맨 아래에 추가
========================= */
(function () {
  const links = Array.from(document.querySelectorAll('.main-nav .nav-menu a'));
  if (!links.length) return;

  // href(#id) → 섹션 찾기
  const items = links
    .map(a => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return null;
      const section = document.querySelector(href);
      if (!section) return null;
      return { a, section, href };
    })
    .filter(Boolean);

  if (!items.length) return;

  // 클릭 시 부드럽게 이동(기존이 있어도 문제 없게)
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  // 스크롤 위치에 따라 active 업데이트
  function setActive(href) {
    links.forEach(x => x.classList.toggle('is-active', x.getAttribute('href') === href));
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      // 가장 많이 보이는 섹션 1개 선택
      let best = null;
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        if (!best || ent.intersectionRatio > best.intersectionRatio) best = ent;
      }
      if (!best) return;

      const id = '#' + best.target.id;
      setActive(id);
    }, { threshold: [0.35, 0.55, 0.75] });

    items.forEach(({ section }) => io.observe(section));
  } else {
    // 구형 브라우저 대비(간단)
    window.addEventListener('scroll', () => {
      let current = items[0].href;
      const y = window.scrollY + 120;
      for (const it of items) {
        if (it.section.offsetTop <= y) current = it.href;
      }
      setActive(current);
    });
  }
})();




/* =========================
   NAV: HAMBURGER PANEL + PANEL TYPING (UNIFIED, iOS SAFE)
   - 중복 바인딩 방지
   - preventDefault/stopPropagation
   - iOS touch 대응
========================= */
window.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');
  const closeBtn = document.getElementById('navPanelClose');
  // ✅ 1) X 버튼이 없으면 자동 생성 (DOM에 없어서 안 보이는 경우 방지)
  let closeBtnEl = closeBtn;

  if (!closeBtnEl) {
    closeBtnEl = document.createElement('button');
    closeBtnEl.id = 'navPanelClose';
    closeBtnEl.type = 'button';
    closeBtnEl.setAttribute('aria-label', 'Close panel');

    // nav-panel-head가 있으면 그 안에, 없으면 panel 맨 앞에 넣기
    const head = panel.querySelector('.nav-panel-head');
    if (head) head.appendChild(closeBtnEl);
    else panel.insertBefore(closeBtnEl, panel.firstChild);
  }

  // ✅ 2) 아이콘 파일 없이 "X"를 CSS로 그리기 (텍스트/이미지 경로 문제 제거)
  closeBtnEl.classList.add('nav-panel-close');

  // ✅ 3) X 버튼이 패널 위로 뜨게 인라인 스타일로 강제 (z-index/position 문제 방지)
closeBtnEl.style.cssText += `
  position:absolute;
  left:24px;
  top:9px;
  width:44px;
  height:44px;
  z-index:99999;
  background:rgba(0,0,0,.25);
  border:1px solid rgba(0,240,255,.35);
  border-radius:12px;
  cursor:pointer;
  display:grid;
  place-items:center;
`;

  // X(두 줄) 만들기: 이미 있으면 중복 생성 방지
  if (!closeBtnEl.querySelector('.x1')) {
    closeBtnEl.innerHTML = `
      <span class="x1" aria-hidden="true"></span>
      <span class="x2" aria-hidden="true"></span>
    `;
    const lineCommon = `
      position:absolute;
      width:18px;
      height:2px;
      background:var(--neon-blue, #00F0FF);
      border-radius:2px;
      box-shadow:0 0 10px rgba(0,240,255,.45);
      left:50%;
      top:50%;
      transform-origin:center;
    `;
    closeBtnEl.querySelector('.x1').style.cssText = lineCommon + `transform:translate(-50%,-50%) rotate(45deg);`;
    closeBtnEl.querySelector('.x2').style.cssText = lineCommon + `transform:translate(-50%,-50%) rotate(-45deg);`;
  }

  // ✅ 4) 클릭/터치로 닫기 바인딩 (기존 closeBtn?.addEventListener 대신 이것으로 확실히)
  closeBtnEl.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  });

  closeBtnEl.addEventListener('touchend', (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    closePanel();
  }, { passive: false });
  const backdrop = document.getElementById('navPanelBackdrop');

  if (!burger || !panel || !backdrop) {
    console.error('❌ NAV DOM missing:', { burger, panel, backdrop, closeBtn });
    return;
  }

  // ✅ 중복 바인딩 방지
  if (burger.dataset.navBound === '1') return;
  burger.dataset.navBound = '1';

  // ================
  // typing line
  // ================
  let typingEl = panel.querySelector('.panel-typing');
  let typingTimer = null;

  function ensureTypingEl() {
    if (typingEl) return typingEl;
    const head = panel.querySelector('.nav-panel-head');
    if (!head) return null;

    typingEl = document.createElement('p');
    typingEl.className = 'panel-typing';
    typingEl.innerHTML = '<span class="text"></span><span class="caret">█</span>';
    head.insertAdjacentElement('afterend', typingEl);
    return typingEl;
  }

  function startTyping(line) {
    const el = ensureTypingEl();
    if (!el) return;

    const textEl = el.querySelector('.text');
    if (!textEl) return;

    if (typingTimer) clearInterval(typingTimer);
    textEl.textContent = '';

    let i = 0;
    typingTimer = setInterval(() => {
      if (!panel.classList.contains('open')) {
        clearInterval(typingTimer);
        typingTimer = null;
        return;
      }
      textEl.textContent = line.slice(0, i++);
      if (i > line.length) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, 28);
  }

  function stopTyping() {
    if (typingTimer) clearInterval(typingTimer);
    typingTimer = null;
    if (typingEl) {
      const textEl = typingEl.querySelector('.text');
      if (textEl) textEl.textContent = '';
    }
  }

  // ================
  // open/close
  // ================
  function openPanel() {
    panel.classList.add('open');
    backdrop.classList.add('open');
    burger.classList.add('is-open');

    panel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');

    document.body.style.overflow = 'hidden';
    document.body.classList.add('nav-open');   // ✅ 추가

    // 타이핑 시작
    startTyping('> OPENING MINIMAP...');
  }

  function closePanel() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    burger.classList.remove('is-open');

    panel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
    document.body.classList.remove('nav-open');   // ✅ 추가
    stopTyping();
  }

  function togglePanel() {
    panel.classList.contains('open') ? closePanel() : openPanel();
  }

  // ================
  // handlers (click + iOS touch)
  // ================
  function onBurgerActivate(e) {
    e.preventDefault();
    e.stopPropagation();
    togglePanel();
  }

  burger.addEventListener('click', onBurgerActivate);

  // iOS에서 click 씹히는 경우 대비
  burger.addEventListener('touchend', (e) => {
    // 스크롤 제스처 방해 최소화
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    togglePanel();
  }, { passive: false });

  // 패널 내부 클릭은 버블 막기(밖에서 닫히는 류 코드 대비)
  panel.addEventListener('click', (e) => e.stopPropagation());

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  });

  backdrop.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  });

  // 패널 링크 클릭: 스무스 스크롤 + 닫기
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
    closePanel();
  });

  // ESC 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });
});




/* =========================
   FINAL STAGE ACTIVATION
   - when #final enters viewport
========================= */

(() => {
  const finalStage = document.querySelector('.stage-final');
  if (!finalStage) return;

  let activated = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !activated) {
        finalStage.classList.add('is-final-armed');
        activated = true; // 한번만 발동
      }
    },
    {
      threshold: 0.35, // FINAL 섹션 35% 보이면 발동
    }
  );

  observer.observe(finalStage);
})();




/* =========================
   NAV ACCENT = CURRENT SECTION --stage-accent
========================= */
(() => {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  // 네 사이트에 있는 섹션들(원하면 더 추가 가능)
  const sectionIds = ['hero', 'stage1', 'stage2', 'stage3', 'stage4', 'final'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  // 섹션의 CSS 변수(--stage-accent)를 읽어서 nav 변수로 세팅
  function applyAccentFrom(sectionEl) {
    const accent = getComputedStyle(sectionEl).getPropertyValue('--stage-accent').trim();
    if (accent) {
      nav.style.setProperty('--nav-accent', accent);
    }
  }

  // IntersectionObserver로 "가장 많이 보이는 섹션"을 선택
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      // 보이는 것 중 가장 많이 보이는 섹션 찾기
      let best = null;
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        if (!best || ent.intersectionRatio > best.intersectionRatio) best = ent;
      }
      if (!best) return;

      applyAccentFrom(best.target);
    }, { threshold: [0.25, 0.35, 0.5, 0.65, 0.8] });

    sections.forEach(sec => io.observe(sec));

    // 첫 로드에서 한 번 보정 (맨 위는 hero일 가능성)
    applyAccentFrom(sections[0]);
  } else {
    // 구형 브라우저 fallback
    function onScroll() {
      const y = window.scrollY + 140;
      let current = sections[0];
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec;
      }
      applyAccentFrom(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();




(() => {
  const desktopBtn = document.getElementById('themeSwitch');
  const mobileBtn = document.getElementById('themeSwitchMobile');
  if (!desktopBtn || !mobileBtn) return;

  // 현재 상태 읽기/쓰기 헬퍼
  function isDark() {
    return document.documentElement.classList.contains('theme-dark')
      || document.body.classList.contains('theme-dark')
      || document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function setAria(btn, dark) {
    btn.setAttribute('aria-checked', dark ? 'true' : 'false');
  }

  // ✅ 여기만 네 기존 테마 적용 방식에 맞게 연결
  // - 1순위: 이미 전역 함수가 있으면 그걸 호출
  // - 없으면: html에 data-theme 토글 (CSS가 이걸 쓰게 되어있다면 바로 작동)
  function applyToggle() {
    // 전역 함수가 있으면 사용(네가 기존에 만들어뒀을 수도 있어서)
    if (typeof window.toggleTheme === 'function') {
      window.toggleTheme();
    } else {
      const dark = !isDark();
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      document.documentElement.classList.toggle('theme-dark', dark);
      document.body.classList.toggle('theme-dark', dark);
    }

    // 버튼 두 개 상태 동기화
    const darkNow = isDark()
      || document.documentElement.getAttribute('data-theme') === 'dark';

    setAria(desktopBtn, darkNow);
    setAria(mobileBtn, darkNow);
  }

  // 초기 동기화
  const initDark = isDark() || document.documentElement.getAttribute('data-theme') === 'dark';
  setAria(desktopBtn, initDark);
  setAria(mobileBtn, initDark);

  desktopBtn.addEventListener('click', applyToggle);
  mobileBtn.addEventListener('click', applyToggle);
})();



(function () {
  const bg = document.querySelector('.bg-parallax');
  if (!bg) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReduced) return;

  let raf = null;
  let targetX = 0, targetY = 0;  // -1 ~ 1
  let curX = 0, curY = 0;

  function onMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = x;
    targetY = y;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    // 부드럽게 따라가게 (lerp)
    curX += (targetX - curX) * 0.10;
    curY += (targetY - curY) * 0.10;

    // 이동량(px) / 기울기(deg)
    const tx = (-curX * 18).toFixed(2) + 'px';
    const ty = (-curY * 14).toFixed(2) + 'px';
    const rx = (curY * 2.2).toFixed(2) + 'deg';
    const ry = (-curX * 2.6).toFixed(2) + 'deg';

    bg.style.setProperty('--tx', tx);
    bg.style.setProperty('--ty', ty);
    bg.style.setProperty('--rx', rx);
    bg.style.setProperty('--ry', ry);

    // 계속 추적 (마우스 멈춰도 잔여 보간)
    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });
})();





(() => {
  const joy = document.querySelector('.hero-joystick');
  if (!joy) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduce) return;

  // 조절값
  const NEAR_PX = 220;      // 근접 판정 거리
  const MAX_PUSH = 10;      // 마우스 방향으로 밀리는 최대 px
  const MAX_ROT = 10;       // 추가 회전 최대 deg
  const SCALE_NEAR = 1.06;  // 근접 시 스케일

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let raf = null;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function tick() {
    raf = null;

    const r = joy.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.hypot(dx, dy);

    const t = 1 - clamp(dist / NEAR_PX, 0, 1); // 0(멀다) ~ 1(가깝다)

    // 근접 클래스
    if (t > 0.12) joy.classList.add('is-near');
    else joy.classList.remove('is-near');

    // 마우스 방향으로 아주 살짝 밀기 + 회전
    const nx = dist ? dx / dist : 0;
    const ny = dist ? dy / dist : 0;

    const pushX = nx * MAX_PUSH * t;
    const pushY = ny * MAX_PUSH * t;

    // 기본 회전(-6deg)에 근접 회전 더하기
    const addRot = clamp(nx * MAX_ROT * t, -MAX_ROT, MAX_ROT);

    const sc = 1 + (SCALE_NEAR - 1) * t;

    // transform 덮어쓰기 (float 애니메이션과 섞이면 복잡해져서,
    // 근접 시에는 is-near에서 animation pause 시켜둠)
    if (t > 0.12) {
      joy.style.transform =
        `translate3d(${pushX}px, ${pushY}px, 0) rotate(${(-6 + addRot).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    } else {
      // 멀어지면 인라인 제거해서 float 애니메이션으로 복귀
      joy.style.transform = '';
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  // 터치 환경: 굳이 반응 안 하게 (원하면 터치로도 켤 수 있음)
})();

/* ==================================================
   DOM UTILITIES (added from index.html inline scripts)
   - drop-section reveal
   - hover preview tooltip (data-preview)
================================================== */

(function initDropSectionReveal() {
  const targets = document.querySelectorAll('.drop-section');
  if (!targets.length) return;

  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  function reveal() {
    const vh = window.innerHeight || 0;
    targets.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.85) el.classList.add('is-in');
    });
  }

  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal);
  reveal();
})();

(function initPreviewTooltip() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const tabletMq = window.matchMedia('(max-width: 1259px)');
  const finePointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');

  function canShowPreview() {
    return !reduce && !tabletMq.matches && finePointerMq.matches;
  }

  // Create tooltip element
  const tip = document.createElement('div');
  tip.className = 'preview-tip';
  tip.innerHTML = '<img alt=""><div class="cap" aria-hidden="true">PREVIEW</div>';
  document.body.appendChild(tip);

  const img = tip.querySelector('img');
  let activeEl = null;
  let raf = null;
  let lastX = window.innerWidth * 0.5;
  let lastY = window.innerHeight * 0.5;

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function place(x, y) {
    const gap = 18;
    const w = tip.offsetWidth || 360;
    const h = tip.offsetHeight || 200;

    let tx = x + gap;
    let ty = y + gap;

    const pad = 12;
    const maxX = window.innerWidth - w - pad;
    const maxY = window.innerHeight - h - pad;

    if (tx > maxX) tx = x - w - gap;
    if (ty > maxY) ty = y - h - gap;

    tip.style.left = clamp(tx, pad, maxX) + 'px';
    tip.style.top = clamp(ty, pad, maxY) + 'px';
  }

  function show(el) {
    if (!canShowPreview()) return;

    const src = el.getAttribute('data-preview');
    if (!src) return;

    activeEl = el;

    const finalSrc = (typeof resolveAsset === 'function')
      ? resolveAsset(src)
      : src;

    img.src = finalSrc;
    tip.classList.add('is-on');

    if (!reduce) place(lastX, lastY);
  }

  function hide() {
    activeEl = null;
    tip.classList.remove('is-on');

    setTimeout(() => {
      if (!activeEl) img.removeAttribute('src');
    }, 120);
  }

  function syncPreviewMode() {
    if (canShowPreview()) {
      tip.style.display = '';
    } else {
      tip.style.display = 'none';
      hide();
    }
  }

  syncPreviewMode();

  if (tabletMq.addEventListener) {
    tabletMq.addEventListener('change', syncPreviewMode);
    finePointerMq.addEventListener('change', syncPreviewMode);
  } else {
    tabletMq.addListener(syncPreviewMode);
    finePointerMq.addListener(syncPreviewMode);
  }

  // Event delegation
  document.addEventListener(
    'mouseenter',
    (e) => {
      const el = e.target.closest?.('[data-preview]');
      if (!el) return;
      show(el);
    },
    true
  );

  document.addEventListener(
    'mouseleave',
    (e) => {
      const el = e.target.closest?.('[data-preview]');
      if (!el) return;
      hide();
    },
    true
  );

  document.addEventListener(
    'mousemove',
    (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (!activeEl || !canShowPreview()) return;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => place(lastX, lastY));
    },
    { passive: true }
  );
})();




document.addEventListener("DOMContentLoaded", () => {
  // 다크 페이지에서만
  if (!document.documentElement.classList.contains("is-dark-page")) return;

  const stages = [
    { id: "hero", label: "HOME" },
    { id: "stage1", label: "PROFILE" },
    { id: "stage2", label: "SKILL MATRIX" },
    { id: "stage3", label: "MAIN QUEST" },
    { id: "stage4", label: "MISSION LOG" },
    { id: "final", label: "FINAL STAGE" },
  ];

  const targets = stages
    .map(s => ({ ...s, el: document.getElementById(s.id) }))
    .filter(s => s.el);

  if (!targets.length) return;

  // 중복 생성 방지
  if (document.querySelector(".minimap")) return;

  // ✅ 미니맵 생성
  const nav = document.createElement("nav");
  nav.className = "minimap";
  nav.setAttribute("aria-label", "MiniMap Navigation");
  document.body.appendChild(nav);

  const btns = targets.map((s) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "minimap__btn";
    btn.setAttribute("aria-label", s.label);

    const dot = document.createElement("span");
    dot.className = "minimap__dot";
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "minimap__label";
    label.textContent = s.label;

    btn.appendChild(dot);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      s.el.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    nav.appendChild(btn);
    return btn;
  });

  const setActive = (id) => {
    btns.forEach((b, i) => {
      const on = targets[i].id === id;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  };

  // ✅ 가장 정확한 방식: "기준점이 들어있는 섹션"을 active로
  const getFocusY = () => {
    const header = document.querySelector(".header");
    const headerH = header ? header.offsetHeight : 0;

    // 헤더 아래 영역의 40% 지점을 기준점으로 (튐 방지)
    return headerH + (window.innerHeight - headerH) * 0.4;
  };

  const updateActive = () => {
    const focusY = getFocusY();

    // 기준점이 섹션 안에 들어간 그 섹션을 선택
    for (const s of targets) {
      const r = s.el.getBoundingClientRect();
      if (r.top <= focusY && r.bottom >= focusY) {
        setActive(s.id);
        return;
      }
    }

    // 예외: 가장 가까운 섹션
    let closest = targets[0];
    let best = Infinity;
    for (const s of targets) {
      const r = s.el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - focusY);
      if (dist < best) {
        best = dist;
        closest = s;
      }
    }
    setActive(closest.id);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateActive();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateActive();
});





document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;

  const mq = window.matchMedia('(max-width: 1259px)');

  const handleHeroVideo = () => {
    if (mq.matches) {
      heroVideo.pause();
      heroVideo.currentTime = 0;
      heroVideo.removeAttribute('autoplay');
    } else {
      heroVideo.setAttribute('autoplay', '');
      const playPromise = heroVideo.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
    }
  };

  handleHeroVideo();

  if (mq.addEventListener) {
    mq.addEventListener('change', handleHeroVideo);
  } else {
    mq.addListener(handleHeroVideo);
  }
});




/* ==========================
   HERO BUTTON -> FINAL STAGE
========================== */
(() => {
  const scrollBtn = document.querySelector('.scroll-down');
  const finalStage = document.querySelector('#final');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!scrollBtn || !finalStage) return;

  scrollBtn.setAttribute('role', 'button');
  scrollBtn.setAttribute('tabindex', '0');
  scrollBtn.setAttribute('aria-label', 'FINAL STAGE로 이동');

  const goToFinal = () => {
    finalStage.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  scrollBtn.addEventListener('click', goToFinal);

  scrollBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToFinal();
    }
  });
})();