# 小说创作平台配色方案

## 设计理念
- 柔和护眼：长时间写作不疲劳
- 沉浸专注：减少视觉干扰
- 温暖舒适：营造创作氛围

## 配色方案

### 浅色主题（默认）
```css
/* 主色调 - 柔和的青蓝色，护眼舒适 */
--primary: #5B8DEF;        /* 主按钮、选中状态 */
--primary-light: #7BA3EF;   /* 悬停状态 */
--primary-dark: #4A7AD9;    /* 点击状态 */

/* 背景色 - 温暖的米白色 */
--bg-page: #F8F7F4;        /* 页面背景 - 暖白 */
--bg-card: #FFFFFF;         /* 卡片背景 */
--bg-header: #6BA3E0;     /* 顶部导航 - 柔和蓝 */
--bg-sidebar: #F5F4F1;    /* 侧边栏 */

/* 文字颜色 */
--text-primary: #3D3D3D;    /* 主要文字 */
--text-secondary: #6B6B6B; /* 次要文字 */
--text-placeholder: #A0A0A0; /* 占位符 */

/* 边框颜色 */
--border: #E8E6E3;         /* 边框 */
--border-light: #F0EEEB;   /* 轻边框 */

/* 状态颜色 */
--success: #67C23A;       /* 完成 - 绿色 */
--warning: #E6A23C;       /* 进行中 - 橙色 */
--info: #909399;           /* 待开始 - 灰色 */
--danger: #F56C6C;         /* 删除 - 红色 */
```

### 深色主题（夜间写作）
```css
/* 主色调 */
--primary: #7BA3EF;
--primary-light: #9BB9F3;
--primary-dark: #5B8DEF;

/* 背景色 */
--bg-page: #1A1A1D;
--bg-card: #242428;
--bg-header: #2D2D32;
--bg-sidebar: #1F1F23;

/* 文字颜色 */
--text-primary: #E8E8E8;
--text-secondary: #A0A0A0;
--text-placeholder: #6B6B6B;

/* 边框颜色 */
--border: #3D3D42;
--border-light: #2D2D32;
```

### 语义色
```css
/* 创作相关语义色 */
--novel-draft: #B8A078;      /* 草稿 - 米色 */
--novel-writing: #E6A23C;     /* 写作中 - 橙色 */
--novel-complete: #67C23A;     /* 已完成 - 绿色 */
--novel-review: #909399;        /* 待审核 - 灰色 */

/* 章节进度 */
--chapter-pending: #D0D0D0;    /* 待写 */
--chapter-writing: #E6A23C;    /* 写作中 */
--chapter-done: #67C23A;       /* 已完成 */
```

## 实施计划
1. 更新 CSS 变量定义
2. 调整 Element Plus 主题色
3. 应用到所有组件
4. 测试护眼效果