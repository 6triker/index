// 全局变量
let profileData = {};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    initializeNavigation();
    initializeAnimations();
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
    document.getElementById('name').textContent = personal.name;
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
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
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

// 初始化动画
function initializeAnimations() {
    // 观察器用于触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
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

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
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
});
