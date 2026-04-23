<template>
  <div class="outline-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>大纲管理 - {{ projectTitle }}</span>
          <el-button type="primary" @click="showCreateDialog">新建卷</el-button>
        </div>
      </template>
      
      <el-table :data="outlines" v-loading="loading">
        <el-table-column prop="title" label="卷标题" />
        <el-table-column prop="summary" label="卷概要" show-overflow-tooltip />
        <el-table-column prop="order" label="排序" width="80" />
        <el-table-column label="章节数" width="80">
          <template #default="{ row }">
            {{ row.chapters?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewChapters(row)">章节</el-button>
            <el-button link type="primary" @click="editOutline(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteOutline(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑卷' : '新建卷'" width="500px">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="卷标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="卷概要">
          <el-input v-model="form.summary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '../api/http'

const route = useRoute()
const router = useRouter()
const projectId = route.params.projectId as string
const projectTitle = ref('大纲管理')

const outlines = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  title: '',
  summary: '',
  order: 0,
})

const loadOutlines = async () => {
  loading.value = true
  try {
    outlines.value = await http.get(`/projects/${projectId}/outlines`)
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  isEdit.value = false
  currentId.value = ''
  Object.assign(form, { title: '', summary: '', order: 0 })
  dialogVisible.value = true
}

const editOutline = (row: any) => {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await http.put(`/projects/${projectId}/outlines/${currentId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await http.post(`/projects/${projectId}/outlines`, form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadOutlines()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const deleteOutline = async (row: any) => {
  try {
    await http.delete(`/projects/${projectId}/outlines/${row.id}`)
    ElMessage.success('删除成功')
    loadOutlines()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const viewChapters = (row: any) => {
  router.push(`/outlines/${row.id}/chapters`)
}

onMounted(() => {
  loadOutlines()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>