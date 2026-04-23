<template>
  <div class="chapter-list">
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="搜索章节标题..." clearable>
            <template #append><el-button @click="loadChapters">搜索</el-button></template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="状态筛选" clearable>
            <el-option label="全部" value="" />
            <el-option label="待写" value="pending" />
            <el-option label="写作中" value="writing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建章节</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="list-card">
      <el-table :data="chapters" v-loading="loading" stripe>
        <el-table-column prop="title" label="章节标题" min-width="180" />
        <el-table-column prop="chapterNumber" label="章号" width="60" />
        <el-table-column prop="sectionNumber" label="节号" width="60" />
        <el-table-column prop="wordCount" label="字数" width="80">
          <template #default="{ row }">{{ row.wordCount || 0 }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="摘要" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editChapter(row)">编辑</el-button>
            <el-button link type="success" @click="writeChapter(row)">写作</el-button>
            <el-button link type="danger" @click="deleteChapter(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑章节' : '新建章节'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="章节标题"><el-input v-model="form.title" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="章号"><el-input-number v-model="form.chapterNumber" :min="1" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节号"><el-input-number v-model="form.sectionNumber" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="详细大纲"><el-input v-model="form.outline" type="textarea" :rows="5" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="writeDialogVisible" title="章节写作" width="900px" top="5vh">
      <div class="write-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="outline-panel">
              <h4>章节大纲</h4>
              <p>{{ writingChapter?.outline || '暂无大纲' }}</p>
            </div>
          </el-col>
          <el-col :span="18">
            <el-input v-model="writingContent" type="textarea" :rows="20" placeholder="请开始写作..." />
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="writeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWriting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const chapters = ref<any[]>([
  { id: '1', title: '第一章 觉醒', chapterNumber: 1, sectionNumber: 0, wordCount: 3500, status: 'completed', summary: '主角意外获得传承', outline: '主角在山中探险，意外发现古遗迹，获得上古传承' },
  { id: '2', title: '第二章 初试身手', chapterNumber: 2, sectionNumber: 0, wordCount: 2800, status: 'completed', summary: '小试牛刀', outline: '主角回到城中，展示实力' },
  { id: '3', title: '第三章 青云宗', chapterNumber: 3, sectionNumber: 0, wordCount: 0, status: 'writing', summary: '加入宗门', outline: '主角前往青云宗参加考核' },
  { id: '4', title: '第四章 修炼开始', chapterNumber: 4, sectionNumber: 0, wordCount: 0, status: 'pending', summary: '开始修炼', outline: '主角开始青云宗的修炼生活' }
])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const writeDialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref('')
const writingChapter = ref<any>(null)
const writingContent = ref('')

const form = reactive({ title: '', chapterNumber: 1, sectionNumber: 0, summary: '', outline: '' })

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, { title: '', chapterNumber: 1, sectionNumber: 0, summary: '', outline: '' })
  dialogVisible.value = true
}

const editChapter = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const deleteChapter = (row: any) => {
  chapters.value = chapters.value.filter(c => c.id !== row.id)
  ElMessage.success('删除成功')
}

const writeChapter = (row: any) => {
  writingChapter.value = row
  writingContent.value = row.content || ''
  writeDialogVisible.value = true
}

const saveWriting = () => {
  const idx = chapters.value.findIndex(c => c.id === writingChapter.value.id)
  if (idx !== -1) {
    chapters.value[idx].content = writingContent.value
    chapters.value[idx].wordCount = writingContent.value.length
    chapters.value[idx].status = 'writing'
  }
  ElMessage.success('保存成功')
  writeDialogVisible.value = false
}

const submitForm = () => {
  if (isEdit.value) {
    const idx = chapters.value.findIndex(c => c.id === editingId.value)
    if (idx !== -1) chapters.value[idx] = { ...form }
    ElMessage.success('更新成功')
  } else {
    chapters.value.push({ ...form, id: Date.now().toString(), wordCount: 0, status: 'pending' })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

const loadChapters = () => {}

const getStatusType = (status: string) => {
  const map: Record<string, string> = { pending: 'info', writing: 'warning', completed: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = { pending: '待写', writing: '写作中', completed: '已完成' }
  return map[status] || status
}

onMounted(() => { loading.value = false })
</script>

<style scoped>
.chapter-list { padding: 20px; }
.toolbar-card { margin-bottom: 20px; }
.list-card { min-height: 400px; }
.write-container { min-height: 400px; }
.outline-panel { background: #f5f7fa; padding: 15px; border-radius: 4px; height: 100%; }
.outline-panel h4 { margin: 0 0 10px 0; font-size: 14px; color: #409eff; }
.outline-panel p { margin: 0; font-size: 13px; color: #606266; white-space: pre-wrap; }
</style>