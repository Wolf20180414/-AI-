<template>
  <div id="app" :class="{ 'dark-theme': isDark }">
    <el-container class="app-container">
      <!-- 顶部导航 -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="header-left">
            <h1>小说AI辅助创作系统</h1>
            <span class="project-info" v-if="currentProject">《{{ currentProject }}》</span>
          </div>
          <div class="header-right">
            <div class="writing-stats" v-if="currentProject">
              <span class="stat-item">
                <el-icon><Document /></el-icon>
                {{ chapterCount }}章
              </span>
              <span class="stat-item">
                <el-icon><Edit /></el-icon>
                {{ wordCount.toLocaleString() }}字
              </span>
            </div>
          </div>
        </div>
      </el-header>
      
      <el-container class="main-container">
        <!-- 侧边栏 -->
        <el-aside class="app-sidebar">
          <div class="sidebar-content">
            <!-- 项目选择器 -->
            <div class="sidebar-section">
              <div class="project-selector">
                <el-select
                  v-model="selectedProjectId"
                  placeholder="选择项目"
                  @change="handleProjectChange"
                  class="project-select"
                >
                  <el-option
                    v-for="project in projects"
                    :key="project.id"
                    :label="project.title"
                    :value="project.id"
                  />
                </el-select>
                <el-button :icon="Plus" circle @click="createNewProject" />
              </div>
            </div>
            
            <!-- 创作流程向导 -->
            <div class="sidebar-section workflow-section">
              <div class="section-title">
                <el-icon><Guide /></el-icon>
                <span>创作流程</span>
              </div>
              <el-menu
                :default-active="activeMenu"
                router
                class="sidebar-menu workflow-menu"
              >
                <el-menu-item index="/">
                  <el-icon><Folder /></el-icon>
                  <span>1. 项目</span>
                </el-menu-item>
                <el-menu-item index="/demo-outlines" v-if="selectedProjectId">
                  <el-icon><List /></el-icon>
                  <span>2. 大纲</span>
                </el-menu-item>
                <el-menu-item index="/demo-characters" v-if="selectedProjectId">
                  <el-icon><User /></el-icon>
                  <span>3. 角色</span>
                </el-menu-item>
                <el-menu-item index="/demo-worlds" v-if="selectedProjectId">
                  <el-icon><MapLocation /></el-icon>
                  <span>4. 世界观</span>
                </el-menu-item>
                <el-menu-item index="/demo-chapters" v-if="selectedProjectId">
                  <el-icon><Document /></el-icon>
                  <span>5. 章节</span>
                </el-menu-item>
              </el-menu>
            </div>
            
            <!-- AI工具区域 -->
            <div class="sidebar-section ai-section">
              <div class="section-title">
                <el-icon><MagicStick /></el-icon>
                <span>AI辅助</span>
              </div>
              <el-menu
                :default-active="activeMenu"
                router
                class="sidebar-menu"
              >
                <el-menu-item index="/ai-writing">
                  <el-icon><EditPen /></el-icon>
                  <span>AI写作</span>
                </el-menu-item>
              </el-menu>
            </div>
            
            <!-- 主题切换 -->
            <div class="sidebar-section theme-section">
              <el-button
                class="theme-toggle-btn"
                :icon="isDark ? Sunny : Moon"
                @click="toggleTheme"
              >
                {{ isDark ? '浅色模式' : '深色模式' }}
              </el-button>
            </div>
          </div>
        </el-aside>
        
        <!-- 主内容区域 -->
        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sunny, Moon, Plus, Folder, List, User, MapLocation, Document, Edit, MagicStick, EditPen, Guide } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import http, { getProjects } from './api/http'

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

// 主题切换 - 默认使用浅色主题
const isDark = ref(false)
const toggleTheme = useToggle(isDark)

// 项目相关状态
const projects = ref<{ id: string; title: string }[]>([])
const selectedProjectId = ref<string>('')
const currentProject = computed(() => {
  const project = projects.value.find(p => p.id === selectedProjectId.value)
  return project?.title || ''
})

// 写作统计（模拟数据）
const chapterCount = ref(0)
const wordCount = ref(0)

// 加载项目列表
const loadProjects = async () => {
  try {
    const response = await getProjects({ page: 1, pageSize: 100 })
    projects.value = response.data.items
    // 如果有项目，自动选择第一个
    if (projects.value.length > 0 && !selectedProjectId.value) {
      selectedProjectId.value = projects.value[0].id
    }
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

// 项目切换
const handleProjectChange = (projectId: string) => {
  selectedProjectId.value = projectId
  // 更新统计
  chapterCount.value = Math.floor(Math.random() * 50) + 10
  wordCount.value = Math.floor(Math.random() * 100000) + 50000
}

// 创建新项目
const createNewProject = () => {
  router.push('/')
}

// 初始化
onMounted(() => {
  loadProjects()
})
</script>

<style>
/* 小说创作平台配色方案 - 参照主流平台风格 */
:root {
  /* 主色调 - 蓝色系，更鲜艳 */
  --novel-primary: #4A90D9;
  --novel-primary-light: #5BA0E8;
  --novel-primary-dark: #3A80C9;
   
  /* 背景色 - 温暖的米白色 */
  --novel-bg-page: #F5F5F5;
  --novel-bg-card: #FFFFFF;
  /* 顶部蓝色渐变效果通过样式实现 */
  --novel-bg-header: #4A90D9;
  --novel-bg-sidebar: #FAFAFA;
    
  /* 文字颜色 */
  --novel-text-primary: #333333;
  --novel-text-secondary: #666666;
  --novel-text-placeholder: #999999;
    
  /* 边框颜色 */
  --novel-border: #E0E0E0;
  --novel-border-light: #F0F0F0;
    
  /* 状态颜色 - 更鲜艳 */
  --novel-success: #52C41A;
  --novel-warning: #FF9500;
  --novel-info: #909399;
  --novel-danger: #FF4D4F;
    
  /* 创作语义色 */
  --novel-draft: #8B6914;
  --novel-writing: #FF9500;
  --novel-complete: #52C41A;
  --novel-ai: #722ED1;
    
  /* Element Plus 覆盖 */
  --el-color-primary: #4A90D9;
  --el-color-primary-light-3: #5BA0E8;
  --el-color-primary-light-5: #7AB8F0;
  --el-color-primary-light-7: #A8D0F8;
  --el-color-primary-light-8: #C0E0FA;
  --el-color-primary-light-9: #D8EEFC;
  --el-color-primary-dark-2: #3A80C9;
    
  --el-bg-color: #FFFFFF;
  --el-bg-color-page: #F5F5F5;
  --el-fill-color-light: #FAFAFA;
  --el-border-color: #E0E0E0;
  --el-border-color-light: #F0F0F0;
  --el-text-color-primary: #333333;
  --el-text-color-regular: #666666;
  --el-text-color-secondary: #999999;
}

/* 深色主题 */
.dark {
  --novel-primary: #5BA0E8;
  --novel-primary-light: #7AB8F0;
  --novel-primary-dark: #4A90D9;
   
  --novel-bg-page: #1A1A1A;
  --novel-bg-card: #262626;
  --novel-bg-header: #262626;
  --novel-bg-sidebar: #1F1F1F;
    
  --novel-text-primary: #E5E5E5;
  --novel-text-secondary: #A0A0A0;
  --novel-text-placeholder: #666666;
    
  --novel-border: #404040;
  --novel-border-light: #333333;
    
  --el-color-primary: #5BA0E8;
  --el-color-primary-light-3: #7AB8F0;
  --el-color-primary-light-5: #99D0F8;
  --el-color-primary-light-7: #B8E0F8;
  --el-color-primary-light-8: #D0E8FC;
  --el-color-primary-light-9: #E8F0FC;
  --el-color-primary-dark-2: #4A90D9;
    
  --el-bg-color: #262626;
  --el-bg-color-page: #1A1A1A;
  --el-fill-color-light: #1F1F1F;
  --el-border-color: #404040;
  --el-border-color-light: #333333;
  --el-text-color-primary: #E5E5E5;
  --el-text-color-regular: #A0A0A0;
  --el-text-color-secondary: #666666;
}

/* 新布局样式 */
.app-container {
  min-height: 100vh;
}

.app-header {
  /* 蓝色渐变背景 */
  background: linear-gradient(90deg, #4A90D9 0%, #5BA0E8 100%) !important;
  color: white !important;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  color: white !important;
}

.project-info {
  font-size: 14px;
  color: white;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.writing-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.main-container {
  height: calc(100vh - 60px);
}

.app-sidebar {
  width: 240px !important;
  background-color: var(--novel-bg-sidebar);
  border-right: 1px solid var(--novel-border);
  transition: background-color 0.3s;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 0;
}

.sidebar-section {
  padding: 0 12px;
  margin-bottom: 16px;
}

.project-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-select {
  width: 100%;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--novel-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-menu {
  background-color: transparent !important;
  border: none !important;
}

.sidebar-menu .el-menu-item {
  color: var(--novel-text-primary) !important;
  font-size: 14px;
  border-radius: 8px;
  margin: 4px 8px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: var(--novel-bg-page) !important;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: var(--novel-primary) !important;
  color: white !important;
}

.workflow-section {
  margin-bottom: 16px;
}

.workflow-menu .el-menu-item {
  font-size: 13px;
}

.workflow-menu .el-menu-item span {
  font-size: 12px;
  opacity: 0.8;
}

.ai-section {
  margin-top: auto;
}

.theme-section {
  margin-top: auto;
  padding: 12px;
}

.theme-toggle-btn {
  width: 100%;
  justify-content: flex-start;
  padding-left: 16px;
}

.app-main {
  padding: 24px;
  background-color: var(--novel-bg-page);
  overflow-y: auto;
  transition: background-color 0.3s;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .app-sidebar {
    width: 200px !important;
  }
  
  .header-left h1 {
    font-size: 16px;
  }
  
  .project-info {
    display: none;
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .header-left h1 {
    font-size: 16px;
  }
  
  .el-header {
    padding: 10px;
  }
  
  .el-main {
    padding: 10px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 表格悬停效果 */
.el-table tr:hover > td {
  background-color: rgba(91, 141, 239, 0.08) !important;
}

.dark .el-table tr:hover > td {
  background-color: rgba(123, 163, 239, 0.15) !important;
}

/* 按钮动画 */
.el-button {
  transition: all 0.2s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.el-button:active {
  transform: translateY(0);
}

/* 卡片动画 */
.el-card {
  transition: all 0.3s ease;
  border: 1px solid var(--novel-border);
}

.el-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dark .el-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 标签样式优化 */
.el-tag--success {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: var(--novel-success);
}

.el-tag--warning {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
  color: var(--novel-warning);
}

.el-tag--danger {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
  color: var(--novel-danger);
}

.el-tag--info {
  background-color: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
  color: var(--novel-info);
}
</style>