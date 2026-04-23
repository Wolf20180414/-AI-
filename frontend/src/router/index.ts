import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '../pages/ProjectList.vue'
import OutlineList from '../pages/OutlineList.vue'
import CharacterList from '../pages/CharacterList.vue'
import WorldList from '../pages/WorldList.vue'
import ChapterList from '../pages/ChapterList.vue'
import AIWriting from '../pages/AIWriting.vue'

// 演示页面
import DemoOutlines from '../pages/DemoOutlines.vue'
import DemoCharacters from '../pages/DemoCharacters.vue'
import DemoWorlds from '../pages/DemoWorlds.vue'
import DemoChapters from '../pages/DemoChapters.vue'

const routes = [
  {
    path: '/',
    name: 'projects',
    component: ProjectList
  },
  {
    path: '/projects/:projectId/outlines',
    name: 'outlines',
    component: OutlineList
  },
  {
    path: '/projects/:projectId/characters',
    name: 'characters',
    component: CharacterList
  },
  {
    path: '/projects/:projectId/worlds',
    name: 'worlds',
    component: WorldList
  },
  {
    path: '/outlines/:outlineId/chapters',
    name: 'chapters',
    component: ChapterList
  },
  {
    path: '/ai-writing',
    name: 'ai-writing',
    component: AIWriting
  },
  // 演示路由
  {
    path: '/demo-outlines',
    name: 'demo-outlines',
    component: DemoOutlines
  },
  {
    path: '/demo-characters',
    name: 'demo-characters',
    component: DemoCharacters
  },
  {
    path: '/demo-worlds',
    name: 'demo-worlds',
    component: DemoWorlds
  },
  {
    path: '/demo-chapters',
    name: 'demo-chapters',
    component: DemoChapters
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router