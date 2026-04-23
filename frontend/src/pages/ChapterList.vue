<template>
  <div class="chapter-list">
    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索章节标题..."
            clearable
            @clear="loadChapters"
          >
            <template #append>
              <el-button @click="loadChapters">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="loadChapters">
            <el-option label="全部" value="" />
            <el-option label="待写" value="pending" />
            <el-option label="写作中" value="writing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已审核" value="reviewed" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建章节</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 章节列表 -->
    <el-card class="list-card">
      <el-table :data="chapters" v-loading="loading" stripe>
        <el-table-column prop="title" label="章节标题" min-width="180" />
        <el-table-column prop="chapterNumber" label="章号" width="60" />
        <el-table-column prop="sectionNumber" label="节号" width="60" />
        <el-table-column prop="wordCount" label="字数" width="80">
          <template #default="{ row }">
            {{ row.wordCount || 0 }}
          </template>
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

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="loadChapters"
        @current-change="loadChapters"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑章节' : '新建章节'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="章节标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入章节标题" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="章号" prop="chapterNumber">
              <el-input-number v-model="form.chapterNumber" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节号" prop="sectionNumber">
              <el-input-number v-model="form.sectionNumber" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入章节摘要" />
        </el-form-item>
        <el-form-item label="详细大纲" prop="outline">
          <el-input v-model="form.outline" type="textarea" :rows="5" placeholder="请输入详细大纲" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 写作对话框 -->
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
            <el-input
              v-model="writingContent"
              type="textarea"
              :rows="20"
              placeholder="请开始写作..."
            />
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="writeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveWriting" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '../api/http'

const route = useRoute()
const outlineId = route.params.outlineId as string

// 数据
const chapters = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const writeDialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref('')
const writingChapter = ref<any>(null)
const writingContent = ref('')
const formRef = ref()
const form = reactive({
  title: '',
  chapterNumber: 1,
  sectionNumber: 0,
  summary: '',
  outline: ''
})

const rules = {
  title: [{ required: true, message: '请输入章节标题', trigger: 'blur' }],
  chapterNumber: [{ required: true, message: '请输入章号', trigger: 'blur' }]
}

// 加载章节列表
const loadChapters = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value) params.status = statusFilter.value
    
    const res = await http.get(`/outlines/${outlineId}/chapters`, { params })
    chapters.value = res.data.data
    pagination.total = res.data.total
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  isEdit.value = false
  editingId.value = ''
  Object.assign(form, {
    title: '',
    chapterNumber: 1,
    sectionNumber: 0,
    summary: '',
    outline: ''
  })
  dialogVisible.value = true
}

// 编辑章节
const editChapter = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    title: row.title,
    chapterNumber: row.chapterNumber,
    sectionNumber: row.sectionNumber,
    summary: row.summary || '',
    outline: row.outline || ''
  })
  dialogVisible.value = true
}

// 删除章节
const deleteChapter = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个章节吗？', '提示', {
      type: 'warning'
    })
    await http.delete(`/outlines/${outlineId}/chapters/${row.id}`)
    ElMessage.success('删除成功')
    loadChapters()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 写作
const writeChapter = async (row: any) => {
  writingChapter.value = row
  // 加载已有内容
  try {
    const res = await http.get(`/outlines/${outlineId}/chapters/${row.id}`)
    writingContent.value = res.data.content || ''
  } catch (error: any) {
    writingContent.value = ''
  }
  writeDialogVisible.value = true
}

// 保存写作内容
const saveWriting = async () => {
  saving.value = true
  try {
    await http.patch(`/outlines/${outlineId}/chapters/${writingChapter.value.id}`, {
      content: writingContent.value,
      status: 'writing'
    })
    ElMessage.success('保存成功')
    writeDialogVisible.value = false
    loadChapters()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  try {
    if (isEdit.value) {
      await http.patch(`/outlines/${outlineId}/chapters/${editingId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await http.post(`/outlines/${outlineId}/chapters`, form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadChapters()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 工具函数
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    writing: 'warning',
    completed: 'success',
    reviewed: ''
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待写',
    writing: '写作中',
    completed: '已完成',
    reviewed: '已审核'
  }
  return map[status] || status
}

onMounted(() => {
  loadChapters()
})
</script>

<style scoped>
.chapter-list {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
}

.list-card {
  min-height: 400px;
}

.write-container {
  min-height: 400px;
}

.outline-panel {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  height: 100%;
}

.outline-panel h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #409eff;
}

.outline-panel p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  white-space: pre-wrap;
}
</style>