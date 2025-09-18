# 个人简介页面

一个现代化、响应式的个人简介页面，支持通过JSON配置文件轻松自定义内容。

## 特性

- 🎨 **现代化设计** - 采用渐变色彩和流畅动画
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **动态效果** - 丰富的CSS动画和交互效果
- 🔧 **易于配置** - 通过JSON文件快速修改个人信息
- 🚀 **高性能** - 纯HTML/CSS/JavaScript，无需框架
- 🎯 **SEO友好** - 语义化HTML结构

## 文件结构

```
profile/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── profile.json        # 个人信息配置文件
└── README.md          # 说明文档
```

## 快速开始

1. **下载文件**
   将所有文件下载到本地目录

2. **修改个人信息**
   编辑 `profile.json` 文件，替换为你的个人信息

3. **打开页面**
   在浏览器中打开 `index.html` 文件

## 配置说明

### profile.json 配置文件结构

```json
{
  "personal": {
    "name": "你的姓名",
    "title": "职位标题",
    "subtitle": "技能描述",
    "avatar": "头像图片URL",
    "email": "邮箱地址",
    "phone": "电话号码",
    "location": "所在地",
    "bio": "个人简介"
  },
  "skills": [
    {
      "category": "技能分类",
      "items": [
        {
          "name": "技能名称",
          "level": 90,
          "icon": "🔥",
          "color": "#ff6b6b"
        }
      ]
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "duration": "时间段",
      "description": "工作描述"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "tech": "技术栈",
      "description": "项目描述",
      "link": "项目链接"
    }
  ],
  "social": {
    "github": "GitHub链接",
    "linkedin": "LinkedIn链接",
    "blog": "博客链接",
    "wechat": "微信号"
  }
}
```

### 自定义技能图标

技能图标支持：
- Emoji表情符号：🔥 ⚡ 💻 🚀
- Font Awesome图标类名
- 自定义图片URL

### 颜色配置

每个技能可以设置自定义颜色，支持：
- 十六进制颜色：`#ff6b6b`
- RGB颜色：`rgb(255, 107, 107)`
- 渐变色：`linear-gradient(45deg, #ff6b6b, #4ecdc4)`

## 自定义样式

### 修改主题色彩

在 `styles.css` 文件的 `:root` 选择器中修改CSS变量：

```css
:root {
    --primary-color: #667eea;      /* 主色调 */
    --secondary-color: #764ba2;    /* 次要色调 */
    --accent-color: #f093fb;       /* 强调色 */
    /* 更多颜色变量... */
}
```

### 添加新的动画效果

在 `script.js` 中的 `initializeAnimations()` 函数中添加自定义动画。

### 修改布局

通过修改 `styles.css` 中的网格布局和响应式断点来调整页面布局。

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 部署

### 静态托管

可以部署到以下平台：
- GitHub Pages
- Netlify
- Vercel
- 阿里云OSS
- 腾讯云COS

### 本地服务器

使用Python快速启动本地服务器：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后访问 `http://localhost:8000`

## 常见问题

### Q: 如何更换头像？
A: 在 `profile.json` 中修改 `personal.avatar` 字段，可以使用本地图片路径或在线图片URL。

### Q: 如何添加新的技能分类？
A: 在 `profile.json` 的 `skills` 数组中添加新的对象，包含 `category` 和 `items` 字段。

### Q: 如何修改页面标题？
A: 修改 `index.html` 中的 `<title>` 标签内容。

### Q: 如何添加更多社交链接？
A: 在 `profile.json` 的 `social` 对象中添加新字段，然后在 `script.js` 中添加相应的渲染逻辑。

## 许可证

MIT License - 可自由使用和修改

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 更新日志

### v1.0.0
- 初始版本发布
- 基础功能实现
- 响应式设计
- JSON配置支持
