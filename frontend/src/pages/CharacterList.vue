<template>
  <div class="character-list">
    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索角色名或描述..."
            clearable
            @clear="loadCharacters"
          >
            <template #append>
              <el-button @click="loadCharacters">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="roleTypeFilter" placeholder="类型筛选" clearable @change="loadCharacters">
            <el-option label="全部" value="" />
            <el-option label="主角" value="protagonist" />
            <el-option label="配角" value="supporting" />
            <el-option label="反派" value="antagonist" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表 -->
    <el-card class="list-card">
      <el-table :data="characters" v-loading="loading" stripe>
        <el-table-column prop="name" label="角色名" min-width="120" />
        <el-table-column prop="roleType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTypeTag(row.roleType)">{{ getRoleTypeText(row.roleType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="importance" label="重要程度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.importance" disabled :max="5" />
          </template>
        </el-table-column>
        <el-table-column prop="wordCount" label="字数" width="80">
          <template #default="{ row }">
            {{ row.wordCount || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editCharacter(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteCharacter(row)">删除</el-button>
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
        @size-change="loadCharacters"
        @current-change="loadCharacters"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新建角色'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="类型" prop="roleType">
          <el-select v-model="form.roleType" placeholder="请选择类型">
            <el-option label="主角" value="protagonist" />
            <el-option label="配角" value="supporting" />
            <el-option label="反派" value="antagonist" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度" prop="importance">
          <el-rate v-model="form.importance" :max="5" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="背景故事" prop="background">
          <el-input v-model="form.background" type="textarea" :rows="4" placeholder="请输入背景故事" />
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
const characters = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const roleTypeFilter = ref('')

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
  roleType: 'supporting',
  importance: 3,
  description: '',
  background: ''
})

const rules = {
  name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
  roleType: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

// 加载角色列表
const loadCharacters = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (roleTypeFilter.value) params.roleType = roleTypeFilter.value
    
    const res = await http.get(`/projects/${projectId}/characters`, { params })
    characters.value = res.data.data
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
    roleType: 'supporting',
    importance: 3,
    description: '',
    background: ''
  })
  dialogVisible.value = true
}

// 编辑角色
const editCharacter = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    roleType: row.roleType,
    importance: row.importance,
    description: row.description || '',
    background: row.background || ''
  })
  dialogVisible.value = true
}

// 删除角色
const deleteCharacter = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个角色吗？', '提示', {
      type: 'warning'
    })
    await http.delete(`/projects/${projectId}/characters/${row.id}`)
    ElMessage.success('删除成功')
    loadCharacters()
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
      await http.patch(`/projects/${projectId}/characters/${editingId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await http.post(`/projects/${projectId}/characters`, form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadCharacters()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 工具函数
const getRoleTypeTag = (type: string) => {
  const map: Record<string, string> = {
    protagonist: 'success',
    supporting: 'info',
    antagonist: 'danger',
    other: 'warning'
  }
  return map[type] || 'info'
}

const getRoleTypeText = (type: string) => {
  const map: Record<string, string> = {
    protagonist: '主角',
    supporting: '配角',
    antagonist: '反派',
    other: '其他'
  }
  return map[type] || type
}

onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
.character-list {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
}

.list-card {
  min-height: 400px;
}
</style>