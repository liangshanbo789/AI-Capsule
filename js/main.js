/**
 * 算力胶囊 (AI-Capsule) 核心交互逻辑
 * 原生高能效 JavaScript 实现，无任何重型库依赖，保证秒开与极致流畅度。
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. 移动端导航菜单切换
  // ==========================================
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      // 动画化汉堡菜单的三个横杠
      const bars = mobileNavToggle.querySelectorAll('.bar');
      if (mobileNavToggle.classList.contains('active')) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    // 点击导航链接后自动关闭菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navMenu.classList.remove('active');
        const bars = mobileNavToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.style.transform = 'none');
        bars[1].style.opacity = '1';
      });
    });
  }

  // ==========================================
  // 2. 页面滚动时 Header 效果与高亮锚点
  // ==========================================
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // Header 变窄变暗
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 锚点联动高亮
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // ==========================================
  // 3. 3D Card Tilt Effect (三大 AI 卡片悬浮视差)
  // ==========================================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      
      // 鼠标在卡片内的坐标百分比
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      
      // 更新卡片用于高光的自定义变量
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 视差倾斜角度计算
      const midCardWidth = cardRect.width / 2;
      const midCardHeight = cardRect.height / 2;
      
      // 限制最大旋转 10 度
      const angleX = -(y - midCardHeight) / (midCardHeight / 10);
      const angleY = (x - midCardWidth) / (midCardWidth / 10);
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ==========================================
  // 4. Scroll Reveal (滚动渐入显示)
  // ==========================================
  const revealElements = document.querySelectorAll('.animate-scroll-fade');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 一次性淡入，不再重复
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 5. Stats Counter Animation (数据递增滚动)
  // ==========================================
  const statNums = document.querySelectorAll('.stat-num');
  
  const startCounter = (el) => {
    const targetVal = parseFloat(el.getAttribute('data-val'));
    const duration = 2000; // 动画时长 2s
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // 使用 easeOutQuad 缓动函数让数字增长更自然
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * targetVal;

      // 格式化输出
      if (targetVal === 1000) {
        el.innerText = `${Math.floor(currentVal)}+`;
      } else if (targetVal === 99) {
        el.innerText = `${Math.floor(currentVal)}%+`;
      } else if (targetVal === 24) {
        el.innerText = `7×${Math.floor(currentVal)}`;
      } else if (targetVal === 49) {
        // 浮点数处理，滚动到 4.9
        const floatVal = (currentVal / 10).toFixed(1);
        el.innerText = `${floatVal}/5`;
      } else {
        el.innerText = Math.floor(currentVal);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 确保动画结束时精准落地
        if (targetVal === 1000) el.innerText = "1000+";
        else if (targetVal === 99) el.innerText = "99%+";
        else if (targetVal === 24) el.innerText = "7×24";
        else if (targetVal === 49) el.innerText = "4.9/5";
      }
    };

    requestAnimationFrame(animate);
  };

  // 监听 Stats 模块进入视口触发计数
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach(num => startCounter(num));
          observer.unobserve(statsBar); // 仅触发一次
        }
      });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsBar);
  }

  // ==========================================
  // 6. FAQ Accordion (手风琴展开缩放)
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // 关闭其他已展开的 FAQ 项
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (!isActive) {
        item.classList.add('active');
        // 将 max-height 设置为 scrollHeight 动态值
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
      }
    });
  });

});
