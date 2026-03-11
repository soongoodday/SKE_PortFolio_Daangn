// Animation effects

class Animations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        // AI 바 애니메이션
        this.animateAIBars();
        
        // 스크롤 애니메이션
        this.initScrollAnimations();
        
        // 맨 아래로 스크롤 버튼
        this.initScrollToBottom();
    }
    
    animateAIBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.ai-bar');
                    bars.forEach(bar => {
                        const percentage = bar.getAttribute('data-percentage');
                        setTimeout(() => {
                            bar.style.height = `${percentage}%`;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        const aiBarsContainer = document.querySelector('.ai-bars');
        if (aiBarsContainer) {
            observer.observe(aiBarsContainer);
        }
    }
    
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // 애니메이션을 적용할 요소들
        const animatedElements = document.querySelectorAll(`
            .section-header,
            .skill-card,
            .portfolio-item,
            .info-item,
            .ai-desc-item
        `);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    initScrollToBottom() {
        const scrollBtn = document.getElementById('scrollToBottom');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// 부드러운 호버 효과
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // 스킬 카드 호버 효과
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // 포트폴리오 미리보기 호버
        const previews = document.querySelectorAll('.preview-web');
        previews.forEach(preview => {
            preview.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            preview.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// 스크롤 진행 표시
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(to right, #5577ae, #283f6e);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            this.progressBar.style.width = `${scrollPercent}%`;
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Animations();
    new HoverEffects();
    new ScrollProgress();
    
    // 초기 AI 바 높이 설정 (0에서 시작하도록)
    const aiBars = document.querySelectorAll('.ai-bar');
    aiBars.forEach(bar => {
        bar.style.height = '0';
        bar.style.transition = 'height 1s ease-out';
    });
});