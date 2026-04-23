# 小说AI辅助创作系统 V2

## 项目简介

面向网络文学作者的一站式AI创作辅助平台，通过多智能体协作架构、结构化大纲管理、世界观记忆库等核心功能，帮助作者提升创作效率、维护长篇一致性，实现降本增效与创意激发。

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Vue 3 + TypeScript + Vite |
| UI组件库 | Element Plus |
| 状态管理 | Pinia |
| 后端框架 | NestJS |
| 数据库 | SQLite / PostgreSQL |
| ORM | Prisma |

## 核心功能

- **项目管理**：多项目创建、切换、删除
- **大纲管理**：卷-章-节多级结构，可视化拖拽调整
- **世界观设定**：力量体系、地理地图、种族文明、时间线
- **角色管理**：角色卡片、关系图谱、视角切换
- **AI创作**：大纲生成、正文写作、润色修改、灵感激发
- **导出**：TXT、EPUB、PDF、DOCX格式

## 快速开始

```bash
# 克隆项目
git clone <repository-url> novel-ai-v2
cd novel-ai-v2

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install

# 启动开发服务器
npm run dev
```

## 文档

详细技术方案请参阅 [plans/system_design.md](plans/system_design.md)

## 许可证

MIT License