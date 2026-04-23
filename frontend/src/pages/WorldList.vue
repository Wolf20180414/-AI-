<template>
  <div class="world-list">
    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索世界观元素..."
            clearable
            @clear="loadWorlds"
          >
            <template #append>
              <el-button @click="loadWorlds">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="categoryFilter" placeholder="分类筛选" clearable @change="loadWorlds">
            <el-option label="全部" value="" />
            <el-option label="地点" value="location" />
            <el-option label="组织" value="organization" />
            <el-option label="物品" value="item" />
            <el-option label="规则" value="rule" />
            <el-option label="历史" value="history" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建世界观元素</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 世界观列表 -->
    <el-card class="list-card">
      <el-table :data="worlds" v-loading="loading" stripe>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryText(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="importance" label="重要程度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.importance" disabled :max="5" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editWorld(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteWorld(row)">删除</el-button>
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
        @size-change="loadWorlds"
        @current-change="loadWorlds"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑世界观元素' : '新建世界观元素'" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="地点" value="location" />
            <el-option label="组织" value="organization" />
            <el-option label="物品" value="item" />
            <el-option label="规则" value="rule" />
            <el-option label="历史" value="history" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度" prop="importance">
          <el-rate v-model="form.importance" :max="5" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="详细设定" prop="details">
          <el-input v-model="form.details" type="textarea" :rows="6" placeholder="请输入详细设定" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
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
const projectId = route.params.projectId as string

// 数据
const worlds = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref('')
const formRef = ref()
const form = reactive({
  name: '',
  category: 'location',
  importance: 3,
  description: '',
  details: ''
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 加载世界观列表
const loadWorlds = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (categoryFilter.value) params.category = categoryFilter.value
    
    const res = await http.get(`/projects/${projectId}/worlds`, { params })
    worlds.value = res.data.data
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
    name: '',
    category: 'location',
    importance: 3,
    description: '',
    details: ''
  })
  dialogVisible.value = true
}

// 编辑世界观
const editWorld = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    category: row.category,
    importance: row.importance,
    description: row.description || '',
    details: row.details || ''
  })
  dialogVisible.value = true
}

// 删除世界观
const deleteWorld = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个世界观元素吗？', '提示', {
      type: 'warning'
    })
    await http.delete(`/projects/${projectId}/worlds/${row.id}`)
    ElMessage.success('删除成功')
    loadWorlds()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  try {
    if (isEdit.value) {
      await http.patch(`/projects/${projectId}/worlds/${editingId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await http.post(`/projects/${projectId}/worlds`, form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadWorlds()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 工具函数
const getCategoryText = (category: string) => {
  const map: Record<string, string> = {
    location: '地点',
    organization: '组织',
    item: '物品',
    rule: '规则',
    history: '历史',
    other: '其他'
  }
  return map[category] || category
}

onMounted(() => {
  loadWorlds()
})
</script>

<style scoped>
.world-list {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
}

.list-card {
  min-height: 400px;
}
</style>