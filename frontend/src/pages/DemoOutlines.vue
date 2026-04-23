<template>
  <div class="outline-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>大纲管理（演示）</span>
          <el-button type="primary" @click="showCreateDialog">新建卷</el-button>
        </div>
      </template>
      
      <!-- 骨架屏加载 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      
      <!-- 空状态 -->
      <el-empty v-else-if="!outlines.length" description="暂无大纲，点击新建开始创作">
        <el-button type="primary" @click="showCreateDialog">新建卷</el-button>
      </el-empty>
      
      <!-- 列表 -->
      <el-table v-else :data="outlines" stripe @row-click="handleRowClick">
        <el-table-column prop="title" label="卷标题" min-width="150">
          <template #default="{ row }">
            <div class="title-cell">
              <el-icon><Collection /></el-icon>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="卷概要" show-overflow-tooltip />
        <el-table-column prop="order" label="排序" width="80" />
        <el-table-column label="章节数" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ row.chapters || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="viewChapters(row)">章节</el-button>
            <el-button link type="primary" @click.stop="editOutline(row)">编辑</el-button>
            <el-button link type="danger" @click.stop="deleteOutline(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑卷' : '新建卷'" width="500px" destroy-on-close>
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="卷标题">
          <el-input v-model="form.title" placeholder="请输入卷标题" />
        </el-form-item>
        <el-form-item label="卷概要">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入卷概要" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" :min="0" />
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Collection } from '@element-plus/icons-vue'

const router = useRouter()

const outlines = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  title: '',
  summary: '',
  order: 0
})

// 模拟加载
onMounted(() => {
  setTimeout(() => {
    outlines.value = [
      { id: '1', title: '第一卷：觉醒', summary: '主角觉醒超凡力量', order: 1, chapters: 10 },
      { id: '2', title: '第二卷：崛起', summary: '建立自己的势力', order: 2, chapters: 15 },
      { id: '3', title: '第三卷：巅峰', summary: '最终决战', order: 3, chapters: 8 }
    ]
    loading.value = false
  }, 500)
})

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

const deleteOutline = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个卷吗？', '提示', { type: 'warning' })
    outlines.value = outlines.value.filter(o => o.id !== row.id)
    ElMessage.success('删除成功')
  } catch {}
}

const submitForm = async () => {
  if (!form.title) {
    ElMessage.warning('请输入卷标题')
    return
  }
  submitting.value = true
  setTimeout(() => {
    if (isEdit.value) {
      const idx = outlines.value.findIndex(o => o.id === currentId.value)
      if (idx !== -1) outlines.value[idx] = { ...form }
      ElMessage.success('更新成功')
    } else {
      outlines.value.push({ ...form, id: Date.now().toString(), chapters: 0 })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    submitting.value = false
  }, 300)
}

const viewChapters = (row: any) => {
  router.push('/demo-chapters')
}

const handleRowClick = (row: any) => {
  // 行点击效果
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-card {
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-table tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.el-table tr:hover > td {
  background-color: rgba(64, 158, 246, 0.1) !important;
}
</style>