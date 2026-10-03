/**
 * 算力胶囊 (AI-Capsule) 殿堂级核心交互与物理微动效引擎
 * Design Standard: Awwwards / FWA / Webby Winner Caliber
 * Zero Heavy Dependencies · Native 60-120fps Silky Performance
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. 全局环境探照灯 (Ambient Cursor Spotlight for Desktop)
  // ==========================================================================
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  if (!isTouchDevice) {
    const ambientSpotlight = document.createElement('div');
    ambientSpotlight.className = 'cursor-ambient-spotlight';
    document.body.appendChild(ambientSpotlight);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // 采用 requestAnimationFrame 阻尼物理平滑插值
    const renderAmbientCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      ambientSpotlight.style.left = `${currentX}px`;
      ambientSpotlight.style.top = `${currentY}px`;
      requestAnimationFrame(renderAmbientCursor);
    };
    renderAmbientCursor();
  }

  // ==========================================================================
  // 2. 顶部阅读/滚动进度条 (Scroll Progress Indicator)
  // ==========================================================================
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  // ==========================================================================
  // 3. 返回顶部胶囊按钮 (Back To Top Float Button)
  // ==========================================================================
  let backToTopBtn = document.querySelector('.back-to-top-btn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', '返回页面顶部');
    backToTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================================================
  // 4. 滚动监听：Header、进度条、返回顶部与高亮锚点联动
  // ==========================================================================
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScrollHandler = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 更新阅读进度条
    if (docHeight > 0 && progressBar) {
      const scrollPercent = Math.min((scrollY / docHeight) * 100, 100);
      progressBar.style.width = `${scrollPercent}%`;
    }

    // 智能 Header 压缩背景
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 返回顶部按钮显隐
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 锚点激活联动 (节流优化)
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.endsWith(`#${currentId}`) || href === `#${currentId}`)) {
          link.classList.add('active');
        } else if (href && href.includes('#')) {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  onScrollHandler(); // 初始化一次

  // ==========================================================================
  // 5. 移动端抽屉导航交互
  // ==========================================================================
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileNavToggle && navMenu) {
    const bars = mobileNavToggle.querySelectorAll('.bar');

    mobileNavToggle.addEventListener('click', () => {
      const isActive = mobileNavToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      if (isActive) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    // 点击链接后平滑收起
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      });
    });
  }

  // ==========================================================================
  // 6. 3D Spatial Tilt & Specular Highlighting (模型与功能卡片视差悬浮)
  // ==========================================================================
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('[data-tilt], .model-card, .price-card, .matrix-preview-card');

    tiltCards.forEach(card => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 动态注入鼠标位置用于高光径向渐变
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // 仅对明确标有 data-tilt 的主卡片应用 3D 角度旋转
        if (card.hasAttribute('data-tilt')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = -((y - centerY) / centerY) * 7; // 最大 7 度倾斜，兼具科技感与优雅克制
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -6px, 12px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        if (card.hasAttribute('data-tilt')) {
          card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
        }
      });
    });
  }

  // ==========================================================================
  // 7. Scroll Reveal 滚动交错淡入 (IntersectionObserver)
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.animate-scroll-fade');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 增加微小的交错延时，让同组卡片依次优雅升起
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (index % 3) * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollElements.forEach(el => scrollObserver.observe(el));

  // ==========================================================================
  // 8. 物理数字增长滚动引擎 (Stats Counter Animation)
  // ==========================================================================
  const statNums = document.querySelectorAll('.stat-num');

  const runStatCounter = (el) => {
    const rawVal = el.getAttribute('data-val');
    if (!rawVal) return;
    const targetVal = parseFloat(rawVal);
    const duration = 2200;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic Out 极度丝滑降速缓动
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = easeProgress * targetVal;

      if (targetVal === 1000) {
        el.innerText = `${Math.floor(currentVal)}+`;
      } else if (targetVal === 99) {
        el.innerText = `${Math.floor(currentVal)}%+`;
      } else if (targetVal === 24) {
        el.innerText = `7×${Math.floor(currentVal)}`;
      } else if (targetVal === 49) {
        el.innerText = `${(currentVal / 10).toFixed(1)}/5`;
      } else {
        el.innerText = Math.floor(currentVal);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (targetVal === 1000) el.innerText = "1000+";
        else if (targetVal === 99) el.innerText = "99%+";
        else if (targetVal === 24) el.innerText = "7×24";
        else if (targetVal === 49) el.innerText = "4.9/5";
      }
    };

    requestAnimationFrame(updateCount);
  };

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach(num => runStatCounter(num));
          observer.unobserve(statsBar);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsBar);
  }

  // ==========================================================================
  // 9. FAQ 手风琴流畅折叠
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // 同组排他收起其他展开项，保持界面极简
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // ==========================================================================
  // 10. AI 胶囊选型矩阵交互逻辑 (Interactive Capsule Matrix)
  // ==========================================================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const matrixTitle = document.getElementById('matrix-title');
  const matrixDesc = document.getElementById('matrix-desc');
  const matrixParam1 = document.getElementById('matrix-p1');
  const matrixParam2 = document.getElementById('matrix-p2');
  const matrixParam3 = document.getElementById('matrix-p3');
  const matrixParam4 = document.getElementById('matrix-p4');
  const matrixBtn = document.getElementById('matrix-btn');

  const matrixData = {
    code: {
      title: "Claude Opus 4.7 & CodeX",
      desc: "针对复杂工程级架构、长上下文代码库重构与终端 Claude Code 沉浸式编程，被全球极客公认为逻辑智商天花板。",
      p1: "Opus 4.7 / Sonnet 5",
      p2: "200,000+ Tokens",
      p3: "Artifacts 实时渲染",
      p4: "极速终端集成",
      link: "claude-claudecode.html",
      btnText: "探索 Claude & Code 专区"
    },
    research: {
      title: "Gemini Advanced & 200万上下文",
      desc: "全能型多模态旗舰，支持整本专业学术专著、数十篇英文文献与长视频一次性投喂解析，与 Google 办公生态深度整合。",
      p1: "Gemini 3.5 旗舰引擎",
      p2: "2,000,000 Tokens",
      p3: "原生全能多模态",
      p4: "Google Workspace 联动",
      link: "gemini-antigravity.html",
      btnText: "探索 Gemini 专区"
    },
    general: {
      title: "ChatGPT Plus (GPT-5.5)",
      desc: "全球应用最广泛的全能生产力套件，包含强大的自定义 GPTs、深度联网实时检索、高级数据分析与多模型自由调遣。",
      p1: "GPT-5.5 / GPT-4o",
      p2: "128,000 Tokens",
      p3: "DALL-E 3 绘图 + 搜索",
      p4: "海量专属 GPTs",
      link: "chatgpt-codex.html",
      btnText: "探索 ChatGPT 专区"
    },
    api: {
      title: "全球 AI API 中转与聚合网关",
      desc: "无需自备海外境外实体信用卡，一键汇聚 OpenAI、Anthropic、Google 全系列大模型接口，稳定高并发，国内直接直连调用。",
      p1: "全模型统一接入",
      p2: "高并发极低延迟",
      p3: "按量计费透明清晰",
      p4: "无需境外海外梯子",
      link: "api-relay.html",
      btnText: "探索 API 中转专区"
    }
  };

  if (filterChips.length && matrixTitle) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-type');
        const data = matrixData[key];
        if (data) {
          // 平滑微淡出更新再淡入
          const previewCard = document.querySelector('.matrix-preview-card');
          if (previewCard) {
            previewCard.style.opacity = '0.5';
            previewCard.style.transform = 'scale(0.98)';
            previewCard.style.transition = 'all 0.2s ease';

            setTimeout(() => {
              matrixTitle.innerText = data.title;
              matrixDesc.innerText = data.desc;
              if (matrixParam1) matrixParam1.innerText = data.p1;
              if (matrixParam2) matrixParam2.innerText = data.p2;
              if (matrixParam3) matrixParam3.innerText = data.p3;
              if (matrixParam4) matrixParam4.innerText = data.p4;
              if (matrixBtn) {
                matrixBtn.setAttribute('href', data.link);
                matrixBtn.querySelector('span').innerText = data.btnText;
              }
              previewCard.style.opacity = '1';
              previewCard.style.transform = 'scale(1)';
            }, 200);
          }
        }
      });
    });
  }

  // ==========================================================================
  // 11. 全局轻量 Toast 反馈系统
  // ==========================================================================
  window.showCapsuleToast = (msg) => {
    let toast = document.querySelector('.capsule-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'capsule-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>💊</span><span>${msg}</span>`;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

});
