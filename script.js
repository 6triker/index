// 全局变量
let profileData = {};
let currentTheme = 'cyberpunk';
let particles = [];
let isLoading = true;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    loadProfileData();
});

// 加载个人资料数据
async function loadProfileData() {
    try {
        console.log('开始加载 profile.json...');
        const response = await fetch('profile.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        profileData = await response.json();
        console.log('Profile data loaded successfully:', profileData);
        renderProfile();
    } catch (error) {
        console.error('加载个人资料数据失败:', error);
        // 使用默认数据
        profileData = getDefaultData();
        console.log('Using default data:', profileData);
        renderProfile();
    }
}

// 渲染个人资料
function renderProfile() {
    try {
        console.log('开始渲染个人资料...');
        renderPersonalInfo();
        renderSkills();
        renderExperience();
        renderProjects();
        renderContact();

        console.log('个人资料渲染完成，初始化其他功能...');

        // 数据加载完成后初始化其他功能
        initializeThemeSelector();
        initializeNavigation();
        initializeAnimations();

        // 延迟初始化特效，确保DOM已渲染
        setTimeout(() => {
            initializeParticleSystem();
            initializeMatrixRain();
            initializeTypewriter();
            initializeCounters();
            initializeSocialLinks();
        }, 100);

        hideLoadingScreen();
    } catch (error) {
        console.error('渲染个人资料时出错:', error);
    }
}

// 渲染个人信息
function renderPersonalInfo() {
    const { personal } = profileData;

    // 安全设置元素内容的函数
    function safeSetContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    }

    function safeSetAttribute(id, attribute, value) {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute(attribute, value);
        }
    }

    function safeSetSrc(id, src) {
        const element = document.getElementById(id);
        if (element) {
            element.src = src;
        }
    }

    // 设置头像
    safeSetSrc('avatar', personal.avatar);

    // 设置基本信息
    safeSetContent('name', personal.name);
    safeSetAttribute('name', 'data-text', personal.name);
    safeSetContent('title', personal.title);
    safeSetContent('subtitle', personal.subtitle);
    safeSetContent('bio', personal.bio);

    // 设置联系信息（使用正确的ID）
    safeSetContent('contact-email', personal.email);
    safeSetContent('contact-phone', personal.phone);
    safeSetContent('contact-location', personal.location);

    // 社交链接处理将在renderContact函数中处理
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
    const { personal, social } = profileData;

    // 安全设置元素内容的函数
    function safeSetContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // 更新联系信息
    safeSetContent('contact-email', personal.email);
    safeSetContent('contact-phone', personal.phone);
    safeSetContent('contact-location', personal.location);

    // 更新社交媒体链接
    if (social) {
        const socialCards = document.querySelectorAll('.social-card');
        socialCards.forEach(card => {
            const platform = card.getAttribute('data-platform');
            if (social[platform]) {
                card.href = social[platform];
                if (platform === 'email') {
                    card.href = `mailto:${social[platform]}`;
                }
            }
        });
    }
}

// 主题切换功能
function initializeThemeSelector() {
    console.log('Initializing theme selector...');
    const themeSelect = document.getElementById('theme-select');

    if (!themeSelect) {
        console.error('Theme selector not found!');
        return;
    }

    const savedTheme = localStorage.getItem('selectedTheme') || 'cyberpunk';
    console.log('Saved theme:', savedTheme);

    // 设置保存的主题
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    // 监听主题切换
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        console.log('Theme changed to:', selectedTheme);
        applyTheme(selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    });
}

function applyTheme(themeName) {
    currentTheme = themeName;

    // 检查数据是否已加载
    if (!profileData || !profileData.themes) {
        console.log('Profile data not loaded yet, waiting...');
        return;
    }

    const theme = profileData.themes[themeName];

    if (!theme) {
        console.error('Theme not found:', themeName);
        return;
    }

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
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 更新活动导航链接
        updateActiveNavLink();
    });

    // 更新活动导航链接
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// 粒子系统
function initializeParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) {
        console.log('Particles container not found, skipping particle system');
        return;
    }

    console.log('Initializing particle system...');

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
    if (!container) {
        console.log('Matrix rain container not found, skipping matrix rain');
        return;
    }

    console.log('Initializing matrix rain...');

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
        },
        themes: {
            cyberpunk: {
                name: "赛博朋克",
                colors: {
                    primary: "#00f5ff",
                    secondary: "#ff0080",
                    accent: "#39ff14",
                    background: "#0a0a0a",
                    surface: "#1a1a1a",
                    text: "#ffffff",
                    textSecondary: "#b0b0b0"
                },
                effects: {
                    glitch: true,
                    neon: true,
                    particles: true,
                    hologram: true,
                    matrixRain: false,
                    scanLines: true
                }
            }
        }
    };
}

// 打字机效果
function initializeTypewriter() {
    const elements = document.querySelectorAll('.typewriter');
    if (elements.length === 0) {
        console.log('No typewriter elements found');
        return;
    }

    console.log(`Initializing typewriter for ${elements.length} elements...`);
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

// 联系卡片和社交链接效果
function initializeSocialLinks() {
    // 初始化联系卡片
    initializeContactCards();

    // 初始化社交媒体卡片
    const socialCards = document.querySelectorAll('.social-card');

    socialCards.forEach(card => {
        const platform = card.getAttribute('data-platform');

        // 检查是否已配置链接
        const hasConfiguredLink = profileData.social && profileData.social[platform];

        if (!hasConfiguredLink) {
            // 如果没有配置链接，添加点击提示
            card.addEventListener('click', function(e) {
                e.preventDefault();

                // 根据平台显示不同的提示信息
                let message = '';
                switch(platform) {
                    case 'github':
                        message = '请在profile.json中配置您的GitHub链接';
                        break;
                    case 'linkedin':
                        message = '请在profile.json中配置您的LinkedIn链接';
                        break;
                    case 'wechat':
                        message = '请在profile.json中配置您的微信号';
                        break;
                    case 'email':
                        message = '请在profile.json中配置您的邮箱地址';
                        break;
                    default:
                        message = '请在profile.json中配置相应的联系方式';
                }

                // 创建提示框
                showNotification(message);
            });
        } else {
            // 如果已配置链接，设置正确的href并允许正常跳转
            card.href = profileData.social[platform];
            if (platform === 'email') {
                card.href = `mailto:${profileData.social[platform]}`;
            }
        }
    });
}

// 初始化联系卡片
function initializeContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');

    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const value = this.querySelector('p').textContent;

            if (icon.classList.contains('fa-envelope')) {
                // 邮箱卡片
                window.location.href = `mailto:${value}`;
            } else if (icon.classList.contains('fa-phone')) {
                // 电话卡片
                window.location.href = `tel:${value}`;
            } else if (icon.classList.contains('fa-map-marker-alt')) {
                // 位置卡片
                const encodedLocation = encodeURIComponent(value);
                window.open(`https://www.google.com/maps/search/${encodedLocation}`, '_blank');
            }
        });

        // 添加复制功能
        card.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const value = this.querySelector('p').textContent;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(value).then(() => {
                    showNotification('已复制到剪贴板: ' + value);
                });
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = value;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('已复制到剪贴板: ' + value);
            }
        });
    });
}

// 显示通知
function showNotification(message) {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建新通知
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 245, 255, 0.1);
        border: 1px solid var(--primary-color);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        font-family: 'Orbitron', monospace;
        font-size: 0.9rem;
        z-index: 10000;
        backdrop-filter: blur(20px);
        box-shadow: 0 5px 20px rgba(0, 245, 255, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 加载动画
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        console.log('Loading screen not found, skipping...');
        return;
    }

    const progressBar = document.querySelector('.loading-progress');
    const percentage = document.querySelector('.loading-percentage');

    if (!progressBar || !percentage) {
        console.log('Loading progress elements not found');
        return;
    }

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
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');

            // 启动入场动画
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 500);
        }
    }, 1000); // 减少等待时间
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
