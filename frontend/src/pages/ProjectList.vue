<template>
  <div class="project-list">
    <!-- 搜索和筛选工具栏 -->
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索书名或简介..."
            clearable
            @clear="loadProjects"
          >
            <template #append>
              <el-button @click="loadProjects">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="loadProjects">
            <el-option label="全部" value="" />
            <el-option label="草稿中" value="draft" />
            <el-option label="创作中" value="writing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="genreFilter" placeholder="题材筛选" clearable @change="loadProjects">
            <el-option label="全部" value="" />
            <el-option v-for="g in genres" :key="g" :label="g" :value="g" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建项目</el-button>
          <el-button @click="exportProjects">导出</el-button>
          <el-button @click="importProjects">导入</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 项目列表 -->
    <el-card class="list-card">
      <el-table :data="projects" v-loading="loading" stripe>
        <el-table-column prop="title" label="书名" min-width="150" />
        <el-table-column prop="genre" label="题材" width="120" />
        <el-table-column prop="synopsis" label="简介" min-width="200" show-overflow-tooltip />
        <el-table-column prop="targetWordCount" label="目标字数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.targetWordCount) }}
          </template>
        </el-table-column>
        <el-table-column prop="currentWordCount" label="当前字数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.currentWordCount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editProject(row)">编辑</el-button>
            <el-button link type="success" @click="goToOutlines(row)">大纲</el-button>
            <el-button link type="info" @click="goToCharacters(row)">角色</el-button>
            <el-button link type="warning" @click="goToWorlds(row)">世界观</el-button>
            <el-button link type="danger" @click="deleteProject(row)">删除</el-button>
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
        @size-change="loadProjects"
        @current-change="loadProjects"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新建项目'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="题材" prop="genre">
          <el-input v-model="form.genre" placeholder="请输入题材" />
        </el-form-item>
        <el-form-item label="简介" prop="synopsis">
          <el-input v-model="form.synopsis" type="textarea" :rows="3" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="目标字数" prop="targetWordCount">
          <el-input-number v-model="form.targetWordCount" :min="0" :step="10000" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="草稿中" value="draft" />
            <el-option label="创作中" value="writing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入项目" width="400px">
      <el-upload ref="uploadRef" :auto-upload="false" :limit="1" accept=".json" :on-change="handleFileChange">
        <el-button type="primary">选择JSON文件</el-button>
        <template #tip>
          <div class="el-upload__tip">支持JSON格式文件</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '../api/http'

const router = useRouter()

// 导航函数
const goToOutlines = (row: Project) => {
  router.push(`/projects/${row.id}/outlines`)
}

const goToCharacters = (row: Project) => {
  router.push(`/projects/${row.id}/characters`)
}

const goToWorlds = (row: Project) => {
  router.push(`/projects/${row.id}/worlds`)
}

// 类型定义
interface Project {
  id: string
  title: string
  genre: string
  synopsis?: string
  targetWordCount: number
  currentWordCount: number
  status: string
  createdAt: string
  updatedAt: string
}

interface ProjectForm {
  title: string
  genre: string
  synopsis: string
  targetWordCount: number
  status: string
}

// 响应式数据
const projects = ref<Project[]>([])
const genres = ref<string[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const genreFilter = ref('')
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref('')
const formRef = ref()
const uploadRef = ref()

const form = reactive<ProjectForm>({
  title: '',
  genre: '',
  synopsis: '',
  targetWordCount: 100000,
  status: 'draft',
})

const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  genre: [{ required: true, message: '请输入题材', trigger: 'blur' }],
}

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const importFile = ref<File>()

// 方法
const loadProjects = async () => {
  loading.value = true
  try {
    const params = {
      search: searchQuery.value,
      status: statusFilter.value,
      genre: genreFilter.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
    const res = await http.get('/projects', { params })
    projects.value = res.items
    pagination.total = res.total
  } catch (error) {
    ElMessage.error('加载项目失败')
  } finally {
    loading.value = false
  }
}

const loadGenres = async () => {
  try {
    const res = await http.get('/projects/genres/list')
    genres.value = res
  } catch (error) {
    console.error('加载题材失败', error)
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  currentId.value = ''
  Object.assign(form, {
    title: '',
    genre: '',
    synopsis: '',
    targetWordCount: 100000,
    status: 'draft',
  })
  dialogVisible.value = true
}

const editProject = (row: Project) => {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(form, {
    title: row.title,
    genre: row.genre,
    synopsis: row.synopsis || '',
    targetWordCount: row.targetWordCount,
    status: row.status,
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value) {
      await http.put(`/projects/${currentId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await http.post('/projects', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadProjects()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

const deleteProject = async (row: Project) => {
  try {
    await ElMessageBox.confirm(`确定要删除项目"${row.title}"吗？`, '提示', {
      type: 'warning',
    })
    await http.delete(`/projects/${row.id}`)
    ElMessage.success('删除成功')
    loadProjects()
  } catch (error) {
    // 用户取消
  }
}

const exportProjects = () => {
  const data = JSON.stringify(projects.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `projects_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

const importProjects = () => {
  importDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

const submitImport = async () => {
  if (!importFile.value) {
    ElMessage.warning('请选择文件')
    return
  }

  try {
    const text = await importFile.value.text()
    const data = JSON.parse(text)
    for (const project of data) {
      await http.post('/projects', project)
    }
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    loadProjects()
  } catch (error) {
    ElMessage.error('导入失败')
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    draft: 'info',
    writing: 'primary',
    completed: 'success',
    archived: 'warning',
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    writing: '创作中',
    completed: '已完成',
    archived: '已归档',
  }
  return map[status] || status
}

// 生命周期
onMounted(() => {
  loadProjects()
  loadGenres()
})
</script>

<style scoped>
.project-list {
  max-width: 1400px;
  margin: 0 auto;
}

.toolbar-card {
  margin-bottom: 20px;
}

.list-card {
  min-height: 500px;
}
</style>