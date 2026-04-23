<template>
  <div class="world-list">
    <el-card class="toolbar-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="searchQuery" placeholder="搜索世界观元素..." clearable>
            <template #append><el-button @click="filterWorlds">搜索</el-button></template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="categoryFilter" placeholder="分类筛选" clearable>
            <el-option label="全部" value="" />
            <el-option label="地点" value="location" />
            <el-option label="组织" value="organization" />
            <el-option label="物品" value="item" />
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="showCreateDialog">新建世界观元素</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="list-card">
      <el-table :data="worlds" v-loading="loading" stripe>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }"><el-tag>{{ getCategoryText(row.category) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="importance" label="重要程度" width="100">
          <template #default="{ row }"><el-rate v-model="row.importance" disabled :max="5" /></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editWorld(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteWorld(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑世界观元素' : '新建世界观元素'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option label="地点" value="location" />
            <el-option label="组织" value="organization" />
            <el-option label="物品" value="item" />
            <el-option label="规则" value="rule" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度"><el-rate v-model="form.importance" :max="5" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
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

const worlds = ref<any[]>([
  { id: '1', name: '青云城', category: 'location', description: '主角所在的城市', importance: 5 },
  { id: '2', name: '青云宗', category: 'organization', description: '主角所在的门派', importance: 5 },
  { id: '3', name: '玄天剑', category: 'item', description: '神器级别的宝剑', importance: 4 },
  { id: '4', name: '灵气修炼体系', category: 'rule', description: '修炼规则设定', importance: 3 }
])
const loading = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref('')

const form = reactive({ name: '', category: 'location', importance: 3, description: '' })

const showCreateDialog = () => {
  isEdit.value = false
  Object.assign(form, { name: '', category: 'location', importance: 3, description: '' })
  dialogVisible.value = true
}

const editWorld = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const deleteWorld = (row: any) => {
  worlds.value = worlds.value.filter(w => w.id !== row.id)
  ElMessage.success('删除成功')
}

const submitForm = () => {
  if (isEdit.value) {
    const idx = worlds.value.findIndex(w => w.id === editingId.value)
    if (idx !== -1) worlds.value[idx] = { ...form }
    ElMessage.success('更新成功')
  } else {
    worlds.value.push({ ...form, id: Date.now().toString() })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

const filterWorlds = () => {}

const getCategoryText = (category: string) => {
  const map: Record<string, string> = { location: '地点', organization: '组织', item: '物品', rule: '规则' }
  return map[category] || category
}

onMounted(() => { loading.value = false })
</script>

<style scoped>
.world-list { padding: 20px; }
.toolbar-card { margin-bottom: 20px; }
.list-card { min-height: 400px; }
</style>