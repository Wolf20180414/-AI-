<template>
  <div class="ai-writing" :class="{ 'fullscreen-mode': isFullscreen }">
    <!-- 全屏模式切换按钮 -->
    <div class="fullscreen-toggle">
      <el-button
        :icon="isFullscreen ? Close : FullScreen"
        circle
        @click="toggleFullscreen"
        :title="isFullscreen ? '退出全屏' : '全屏写作'"
      />
    </div>
    
    <el-row :gutter="20" class="writing-layout">
      <!-- 左侧：输入区域 -->
      <el-col :span="isFullscreen ? 8 : 12">
        <el-card class="input-card">
          <template #header>
            <div class="card-header">
              <span>输入内容</span>
              <el-button link type="primary" @click="clearInput">清空</el-button>
            </div>
          </template>
          <el-input
            v-model="inputContent"
            type="textarea"
            :rows="isFullscreen ? 20 : 15"
            placeholder="请输入需要AI处理的内容..."
            class="writing-textarea"
          />
        </el-card>
      </el-col>
      
      <!-- 右侧：设置和输出 -->
      <el-col :span="isFullscreen ? 16 : 12">
        <el-card class="settings-card" v-if="!isFullscreen">
          <template #header>
            <div class="card-header">
              <span>AI功能</span>
            </div>
          </template>
          
          <!-- 功能选择 -->
          <el-form label-width="80px">
            <el-form-item label="功能类型">
              <el-radio-group v-model="aiType">
                <el-radio-button label="continue">AI续写</el-radio-button>
                <el-radio-button label="polish">AI润色</el-radio-button>
                <el-radio-button label="expand">AI扩写</el-radio-button>
                <el-radio-button label="summarize">AI缩写</el-radio-button>
                <el-radio-button label="dialogue">AI对话</el-radio-button>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="生成长度" v-if="aiType !== 'polish' && aiType !== 'summarize'">
              <el-slider v-model="length" :min="100" :max="500" :step="50" show-input />
            </el-form-item>
            
            <el-form-item label="角色名" v-if="aiType === 'dialogue'">
              <el-input v-model="characterName" placeholder="请输入角色名" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="generateContent" :loading="loading" :disabled="!inputContent">
                <el-icon><MagicStick /></el-icon>
                生成内容
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <!-- 全屏模式下的浮动工具栏 -->
        <div class="floating-toolbar" v-if="isFullscreen">
          <el-radio-group v-model="aiType" size="small">
            <el-radio-button label="continue">续写</el-radio-button>
            <el-radio-button label="polish">润色</el-radio-button>
            <el-radio-button label="expand">扩写</el-radio-button>
            <el-radio-button label="summarize">缩写</el-radio-button>
            <el-radio-button label="dialogue">对话</el-radio-button>
          </el-radio-group>
          
          <el-slider
            v-model="length"
            :min="100"
            :max="500"
            :step="50"
            show-stops
            style="width: 200px"
            v-if="aiType !== 'polish' && aiType !== 'summarize'"
          />
          
          <el-button type="primary" @click="generateContent" :loading="loading" :disabled="!inputContent">
            <el-icon><MagicStick /></el-icon>
            生成
          </el-button>
        </div>
        
        <!-- 输出结果 -->
        <el-card class="output-card" v-if="outputContent">
          <template #header>
            <div class="card-header">
              <span>生成结果</span>
              <div class="output-actions">
                <el-button link type="primary" @click="copyResult">复制</el-button>
                <el-button link type="success" @click="insertResult" v-if="!isFullscreen">插入</el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="outputContent"
            type="textarea"
            :rows="isFullscreen ? 20 : 15"
            readonly
            class="output-textarea"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, FullScreen, Close } from '@element-plus/icons-vue'
import http from '../api/http'

const inputContent = ref('')
const outputContent = ref('')
const aiType = ref<'continue' | 'polish' | 'expand' | 'summarize' | 'dialogue'>('continue')
const length = ref(200)
const characterName = ref('')
const loading = ref(false)
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const clearInput = () => {
  inputContent.value = ''
}

const insertResult = () => {
  if (outputContent.value) {
    inputContent.value += outputContent.value
    ElMessage.success('已插入内容')
  }
}

const generateContent = async () => {
  if (!inputContent.value) {
    ElMessage.warning('请输入内容')
    return
  }
  
  loading.value = true
  try {
    const dto = {
      content: inputContent.value,
      type: aiType.value,
      length: length.value,
      character: characterName.value
    }
    const res = await http.post('/ai/write', dto)
    outputContent.value = res.result
    ElMessage.success('生成成功')
  } catch (error: any) {
    ElMessage.error(error.message || '生成失败')
  } finally {
    loading.value = false
  }
}

const copyResult = () => {
  if (outputContent.value) {
    navigator.clipboard.writeText(outputContent.value)
    ElMessage.success('已复制到剪贴板')
  }
}
</script>

<style scoped>
.ai-writing {
  padding: 20px;
  position: relative;
}

.ai-writing.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: var(--novel-bg-page, #F8F7F4);
  padding: 24px;
}

.fullscreen-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.writing-layout {
  height: 100%;
}

.input-card, .settings-card, .output-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-actions {
  display: flex;
  gap: 8px;
}

.writing-textarea,
.output-textarea {
  font-size: 16px;
  line-height: 1.8;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.floating-toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.fullscreen-mode .floating-toolbar {
  background: var(--novel-bg-card, #FFFFFF);
}

.el-radio-button {
  margin-bottom: 5px;
}
</style>