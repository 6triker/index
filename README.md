# 🚀 高科技个人介绍页面

一个具有强烈科技感和未来感的个人介绍静态页面，支持多种主题切换，完全通过JSON配置。

## ✨ 主要特性

### 🎨 视觉效果
- **8种科技主题**：赛博朋克、黑客帝国、霓虹科技、量子蓝等
- **故障效果**：文字故障动画，增强赛博朋克感
- **霓虹灯效果**：发光文字和边框
- **粒子动画**：动态粒子背景
- **3D悬停效果**：鼠标悬停时的3D变换

### 🎯 交互功能
- **主题实时切换**：右上角主题选择器
- **平滑滚动导航**：点击导航自动滚动到对应部分
- **响应式设计**：完美适配移动端
- **社交媒体链接**：支持GitHub、LinkedIn、微信、邮箱

### ⚙️ JSON配置
- **完全数据驱动**：所有内容通过profile.json配置
- **个人信息**：姓名、职位、头像、联系方式
- **技能展示**：技能分类、等级、图标、颜色
- **社交链接**：各平台链接配置

## 🚀 快速开始

### 1. 启动本地服务器
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .
```

### 2. 访问页面
打开浏览器访问：http://localhost:8000

### 3. 自定义内容
编辑 `profile.json` 文件来修改个人信息。

## 📁 文件结构

```
├── index.html          # 主页面（唯一需要的HTML文件）
├── styles.css          # 样式文件
├── script.js           # JavaScript功能
├── profile.json        # 配置文件
└── README.md          # 说明文档
```

## ⚙️ 配置说明

### 个人信息配置
```json
{
  "personal": {
    "name": "你的姓名",
    "title": "你的职位",
    "avatar": "头像图片URL",
    "email": "邮箱地址",
    "phone": "电话号码",
    "location": "所在地",
    "bio": "个人简介"
  }
}
```

### 社交媒体配置
```json
{
  "social": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername",
    "wechat": "your_wechat_id",
    "email": "your@email.com"
  }
}
```

### 技能配置
```json
{
  "skills": [
    {
      "category": "技能分类名称",
      "items": [
        {
          "name": "技能名称",
          "level": 90,
          "icon": "🔥",
          "color": "#ff6b6b"
        }
      ]
    }
  ]
}
```

## 🎨 主题展示

| 主题 | 特色 | 颜色方案 |
|------|------|----------|
| 赛博朋克 | 蓝粉配色，故障效果 | 青蓝 + 洋红 |
| 黑客帝国 | 绿色矩阵风格 | 矩阵绿 |
| 霓虹科技 | 紫粉渐变 | 紫色 + 蓝色 |
| 量子蓝 | 蓝色科技感 | 量子蓝 |

## 🔧 使用说明

1. **修改个人信息**：编辑 `profile.json` 中的 `personal` 部分
2. **添加技能**：在 `skills` 数组中添加新的技能分类和项目
3. **配置社交链接**：在 `social` 对象中添加你的社交媒体链接
4. **切换主题**：使用右上角的主题选择器实时切换

## 🌟 技术栈

- **HTML5**：语义化结构
- **CSS3**：现代样式特性（Grid、Flexbox、Custom Properties）
- **JavaScript ES6+**：模块化、异步处理
- **JSON**：数据配置

## 📱 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

**享受你的高科技个人介绍页面！** 🚀
