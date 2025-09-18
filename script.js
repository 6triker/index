// 全局变量
let profileData = {};
let currentTheme = 'cyberpunk';
let particles = [];
let isLoading = true;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    loadProfileData();
    initializeThemeSelector();
    initializeNavigation();
    initializeAnimations();
    initializeParticleSystem();
    initializeMatrixRain();
    initializeTypewriter();
    initializeCounters();
    initializeFormEffects();
    hideLoadingScreen();
});

// 加载个人资料数据
async function loadProfileData() {
    try {
        const response = await fetch('profile.json');
        profileData = await response.json();
        renderProfile();
    } catch (error) {
        console.error('加载个人资料数据失败:', error);
        // 使用默认数据
        profileData = getDefaultData();
        renderProfile();
    }
}

// 渲染个人资料
function renderProfile() {
    renderPersonalInfo();
    renderSkills();
    renderExperience();
    renderProjects();
    renderContact();
}

// 渲染个人信息
function renderPersonalInfo() {
    const { personal, social } = profileData;

    document.getElementById('avatar').src = personal.avatar;

    // 设置故障效果的data-text属性
    const nameElement = document.getElementById('name');
    nameElement.textContent = personal.name;
    nameElement.setAttribute('data-text', personal.name);

    document.getElementById('title').textContent = personal.title;
    document.getElementById('subtitle').textContent = personal.subtitle;
    document.getElementById('bio').textContent = personal.bio;
    document.getElementById('email').textContent = personal.email;
    document.getElementById('phone').textContent = personal.phone;
    document.getElementById('location').textContent = personal.location;

    // 社交链接
    if (social.github) {
        document.getElementById('github-link').href = social.github;
    }
    if (social.linkedin) {
        document.getElementById('linkedin-link').href = social.linkedin;
    }
    if (social.blog) {
        document.getElementById('blog-link').href = social.blog;
    }
    if (social.wechat) {
        document.getElementById('wechat-link').href = `weixin://contacts/profile/${social.wechat}`;
    }
}

// 渲染技能
function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    profileData.skills.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        
        categoryDiv.innerHTML = `
            <h3>${category.category}</h3>
            ${category.items.map(skill => `
                <div class="skill-item">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-info">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-progress">
                            <div class="skill-progress-bar" 
                                 style="background: ${skill.color}; width: 0%"
                                 data-level="${skill.level}">
                            </div>
                        </div>
                    </div>
                    <div class="skill-level">${skill.level}%</div>
                </div>
            `).join('')}
        `;
        
        skillsContainer.appendChild(categoryDiv);
    });
    
    // 延迟执行技能条动画
    setTimeout(animateSkillBars, 500);
}

// 技能条动画
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
    });
}

// 渲染工作经历
function renderExperience() {
    const experienceContainer = document.getElementById('experience-container');
    experienceContainer.innerHTML = '';
    
    profileData.experience.forEach(exp => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="experience-company">${exp.company}</div>
                <div class="experience-position">${exp.position}</div>
                <div class="experience-duration">${exp.duration}</div>
                <div class="experience-description">${exp.description}</div>
            </div>
            <div class="timeline-dot"></div>
        `;
        
        experienceContainer.appendChild(timelineItem);
    });
}

// 渲染项目
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    
    profileData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-content">
                <div class="project-name">${project.name}</div>
                <div class="project-tech">${project.tech}</div>
                <div class="project-description">${project.description}</div>
                <a href="${project.link}" class="project-link">
                    查看详情 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// 渲染联系信息
function renderContact() {
    // 联系信息已在renderPersonalInfo中处理
}

// 主题切换功能
function initializeThemeSelector() {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = localStorage.getItem('selectedTheme') || 'cyberpunk';

    // 设置保存的主题
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    // 监听主题切换
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    });
}

function applyTheme(themeName) {
    currentTheme = themeName;
    const theme = profileData.themes[themeName];

    if (!theme) return;

    const root = document.documentElement;
    const colors = theme.colors;

    // 应用颜色变量
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', colors.surface);
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', colors.textSecondary);

    // 更新渐变
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`);
    root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`);
    root.style.setProperty('--gradient-cyber', `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`);

    // 应用特效
    const effects = theme.effects;
    const body = document.body;

    // 移除所有特效类
    body.classList.remove('glitch-enabled', 'neon-enabled', 'particles-enabled', 'hologram-enabled');

    // 添加启用的特效
    if (effects.glitch) body.classList.add('glitch-enabled');
    if (effects.neon) body.classList.add('neon-enabled');
    if (effects.particles) body.classList.add('particles-enabled');
    if (effects.hologram) body.classList.add('hologram-enabled');

    // 重新初始化粒子系统
    if (effects.particles) {
        initializeParticleSystem();
    }

    // 添加主题切换动画
    body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// 初始化导航
function initializeNavigation() {
    // 平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 移动端菜单
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // 点击菜单项后关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // 点击菜单外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // 滚动时导航栏效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 粒子系统
function initializeParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // 清除现有粒子
    container.innerHTML = '';
    particles = [];

    // 创建粒子
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    // 启动粒子动画循环
    animateParticles();
}

function createParticle() {
    const container = document.getElementById('particles-container');
    const particle = document.createElement('div');
    particle.className = 'particle';

    // 随机位置和属性
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 3 + 1;
    const speed = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.5 + 0.3;

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.opacity = opacity;
    particle.style.animationDuration = (20 / speed) + 's';
    particle.style.animationDelay = Math.random() * 20 + 's';

    container.appendChild(particle);

    particles.push({
        element: particle,
        x: x,
        y: y,
        speed: speed,
        size: size
    });
}

function animateParticles() {
    particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.x += Math.sin(particle.y * 0.01) * 0.5;

        if (particle.y < -10) {
            particle.y = window.innerHeight + 10;
            particle.x = Math.random() * window.innerWidth;
        }

        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
    });

    requestAnimationFrame(animateParticles);
}

// 数字雨效果
function initializeMatrixRain() {
    const container = document.querySelector('.matrix-rain');
    if (!container) return;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        createMatrixColumn(container, chars, i);
    }
}

function createMatrixColumn(container, chars, columnIndex) {
    const column = document.createElement('div');
    column.style.position = 'absolute';
    column.style.left = (columnIndex * 20) + 'px';
    column.style.top = '0';
    column.style.width = '20px';
    column.style.height = '100%';

    setInterval(() => {
        if (Math.random() > 0.98) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.left = '0';
            char.style.top = '0';
            char.style.animationDuration = (Math.random() * 3 + 2) + 's';

            column.appendChild(char);

            setTimeout(() => {
                if (char.parentNode) {
                    char.parentNode.removeChild(char);
                }
            }, 5000);
        }
    }, 100);

    container.appendChild(column);
}

// 初始化动画
function initializeAnimations() {
    // 观察器用于触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // 如果是统计项目，启动计数动画
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 观察所有需要动画的元素
    const animateElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .stat-item, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 添加CSS动画类
    const style = document.createElement('style');
    style.textContent = `
        .skill-category, .timeline-item, .project-card, .stat-item, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .timeline-item:nth-child(odd).animate-in {
            transform: translateX(0) !important;
        }

        .timeline-item:nth-child(even).animate-in {
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// 默认数据（备用）
function getDefaultData() {
    return {
        personal: {
            name: "开发者",
            title: "全栈工程师",
            subtitle: "技术专家",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            email: "developer@example.com",
            phone: "+86 138-0000-0000",
            location: "中国",
            bio: "热爱技术的全栈开发工程师"
        },
        skills: [
            {
                category: "编程语言",
                items: [
                    { name: "JavaScript", level: 90, icon: "⚡", color: "#f7df1e" },
                    { name: "Java", level: 85, icon: "☕", color: "#f89820" }
                ]
            }
        ],
        experience: [
            {
                company: "科技公司",
                position: "开发工程师",
                duration: "2020 - 至今",
                description: "负责Web应用开发"
            }
        ],
        projects: [
            {
                name: "示例项目",
                tech: "JavaScript + HTML + CSS",
                description: "一个示例项目",
                link: "#"
            }
        ],
        social: {
            github: "#",
            linkedin: "#",
            blog: "#"
        }
    };
}

// 打字机效果
function initializeTypewriter() {
    const elements = document.querySelectorAll('.typewriter');
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';

        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                // 保持光标闪烁一段时间后移除
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 2000);
            }
        }, 100);
    });
}

// 计数器动画
function initializeCounters() {
    // 这个函数会在观察器中被调用
}

function animateCounter(statItem) {
    const counter = statItem.querySelector('.counter');
    if (!counter || counter.classList.contains('animated')) return;

    counter.classList.add('animated');
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2秒
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

// 表单效果
function initializeFormEffects() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 添加提交动画
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;

        submitBtn.querySelector('.btn-text').textContent = '发送中...';
        submitBtn.disabled = true;

        // 模拟发送过程
        setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = '发送成功!';
            setTimeout(() => {
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });

    // 输入框焦点效果
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    });
}

// 加载动画
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const percentage = document.querySelector('.loading-percentage');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }

        progressBar.style.width = progress + '%';
        percentage.textContent = Math.floor(progress) + '%';
    }, 100);
}

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');

        // 启动入场动画
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    }, 2000);
}

// 3D鼠标跟随效果
function initialize3DEffects() {
    const cards = document.querySelectorAll('.cyber-card, .project-card, .skill-category');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化3D效果，等待元素渲染完成
    setTimeout(() => {
        initialize3DEffects();
    }, 1000);

    // 鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--gradient-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.7';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // 点击波纹效果
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            transform: scale(0);
            animation: ripple-effect 0.6s ease-out;
        `;
        ripple.style.left = e.clientX - 10 + 'px';
        ripple.style.top = e.clientY - 10 + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    });

    // 添加波纹动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .loaded {
            animation: fade-in 1s ease-out;
        }

        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
