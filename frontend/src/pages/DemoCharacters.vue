<template>
  <div class="character-list">
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="搜索角色名..." clearable>
            <template #append>
              <el-button @click="filterCharacters">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="roleTypeFilter" placeholder="类型筛选" clearable>
            <el-option label="全部" value="" />
            <el-option label="主角" value="protagonist" />
            <el-option label="配角" value="supporting" />
            <el-option label="反派" value="antagonist" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建角色</el-button>
        </el-col>
      </el-row>
    </el-card>

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
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editCharacter(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteCharacter(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新建角色'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.roleType">
            <el-option label="主角" value="protagonist" />
            <el-option label="配角" value="supporting" />
            <el-option label="反派" value="antagonist" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度">
          <el-rate v-model="form.importance" :max="5" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="4" />
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
import { ElMessage } from 'element-plus'

const characters = ref<any[]>([
  { id: '1', name: '林天', roleType: 'protagonist', description: '主角，天赋异禀的少年', importance: 5 },
  { id: '2', name: '苏晴', roleType: 'supporting', description: '女主，青梅竹马', importance: 4 },
  { id: '3', name: '黑魔皇', roleType: 'antagonist', description: '最终反派', importance: 5 },
  { id: '4', name: '老周', roleType: 'supporting', description: '导师角色', importance: 3 }
])
const loading = ref(false)
const searchQuery = ref('')
const roleTypeFilter = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref('')

const form = reactive({
  name: '',
  roleType: 'supporting',
  importance: 3,
  description: ''
})

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, { name: '', roleType: 'supporting', importance: 3, description: '' })
  dialogVisible.value = true
}

const editCharacter = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const deleteCharacter = (row: any) => {
  characters.value = characters.value.filter(c => c.id !== row.id)
  ElMessage.success('删除成功')
}

const submitForm = () => {
  if (isEdit.value) {
    const idx = characters.value.findIndex(c => c.id === editingId.value)
    if (idx !== -1) characters.value[idx] = { ...form }
    ElMessage.success('更新成功')
  } else {
    characters.value.push({ ...form, id: Date.now().toString() })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

const filterCharacters = () => {
  // 简单过滤
}

const getRoleTypeTag = (type: string) => {
  const map: Record<string, string> = { protagonist: 'success', supporting: 'info', antagonist: 'danger' }
  return map[type] || 'info'
}

const getRoleTypeText = (type: string) => {
  const map: Record<string, string> = { protagonist: '主角', supporting: '配角', antagonist: '反派' }
  return map[type] || type
}

onMounted(() => {
  loading.value = false
})
</script>

<style scoped>
.character-list { padding: 20px; }
.toolbar-card { margin-bottom: 20px; }
.list-card { min-height: 400px; }
</style>