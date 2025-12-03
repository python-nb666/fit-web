# Fitness Tracker API 架构说明

## 📁 项目结构

```
src/
├── api/
│   ├── index.ts       # 真实 API 接口定义
│   ├── mock.ts        # Mock API 实现
│   └── adapter.ts     # API 适配器（切换真实/Mock）
├── utils/
│   └── request.ts     # Axios 请求封装
└── ...
```

## 🔧 配置

### 环境变量 (`.env`)

```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000
VITE_SERVICE_NAME=fit-tracker

# 是否使用 Mock 数据
VITE_USE_MOCK=true
```

## 📝 数据存储策略

### 本地存储 (LocalStorage)

- ✅ **分类配置** (`categories`) - 静态配置
- ✅ **默认动作** (`DEFAULT_EXERCISES`) - 静态配置
- ✅ **用户自定义动作** (`exercises`) - 用户个性化数据

### API 存储

- 🌐 **训练记录** (`records`) - 通过 API 增删改查
- 🌐 **统计数据** - 通过 API 计算和获取
- 🌐 **用户信息** - 通过 API 管理

## 🔌 API 接口列表

### 训练记录相关

| 方法   | 接口                        | 说明             |
| ------ | --------------------------- | ---------------- |
| GET    | `/fit-tracker/records`      | 获取训练记录列表 |
| GET    | `/fit-tracker/records/{id}` | 获取单条记录详情 |
| POST   | `/fit-tracker/records`      | 创建训练记录     |
| PUT    | `/fit-tracker/records/{id}` | 更新训练记录     |
| DELETE | `/fit-tracker/records/{id}` | 删除训练记录     |

### 统计相关

| 方法 | 接口                                         | 说明             |
| ---- | -------------------------------------------- | ---------------- |
| GET  | `/fit-tracker/stats`                         | 获取整体统计数据 |
| GET  | `/fit-tracker/stats/category/{category}`     | 获取分类统计     |
| GET  | `/fit-tracker/stats/last-workout/{category}` | 获取上次训练信息 |

### 用户相关

| 方法 | 接口                        | 说明         |
| ---- | --------------------------- | ------------ |
| GET  | `/fit-tracker/user/profile` | 获取用户信息 |
| PUT  | `/fit-tracker/user/profile` | 更新用户信息 |

## 💻 使用示例

### 在组件中使用 API

```typescript
import * as api from './api/adapter';

// 获取记录
const loadRecords = async () => {
  try {
    const result = await api.getRecords({
      category: 'chest',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });
    console.log(result.list);
  } catch (error) {
    console.error('Failed to load records:', error);
  }
};

// 创建记录
const createNewRecord = async () => {
  try {
    const newRecord = await api.createRecord({
      category: 'chest',
      exercise: '杠铃卧推',
      sets: 4,
      reps: 10,
      weight: 80,
      date: '2025-12-03',
    });
    console.log('Created:', newRecord);
  } catch (error) {
    console.error('Failed to create record:', error);
  }
};
```

## 🎭 Mock 模式

当前项目默认使用 **Mock 模式**，所有 API 请求都会被 `mock.ts` 拦截并返回模拟数据。

### 切换到真实 API

1. 修改 `.env` 文件：

```env
VITE_USE_MOCK=false
```

2. 确保后端 API 服务已启动

3. 重启开发服务器

## 🔄 请求流程

```
组件调用
  ↓
api/adapter.ts (根据环境变量选择)
  ↓
├─→ mock.ts (Mock 模式)
│     └─→ 返回模拟数据
│
└─→ api/index.ts (真实 API)
      └─→ utils/request.ts (Axios)
            └─→ 后端服务器
```

## 🛠️ 请求封装

### 可用方法

```typescript
import { requestGet, requestPost, requestPut, requestDelete } from './utils/request';

// GET 请求
requestGet('/api/endpoint', { params });

// POST 请求
requestPost('/api/endpoint', { data });

// PUT 请求
requestPut('/api/endpoint', { data });

// DELETE 请求
requestDelete('/api/endpoint');
```

### 拦截器

- **请求拦截器**: 自动添加 Authorization token
- **响应拦截器**: 统一处理错误和数据格式

## 📦 类型定义

所有 API 响应都有完整的 TypeScript 类型定义，位于 `src/types/index.ts`。

```typescript
export interface WorkoutRecord {
  id: string;
  category: WorkoutCategory;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}
```

## 🚀 下一步

1. **实现后端 API**: 根据接口定义实现真实的后端服务
2. **添加更多功能**: 如数据导出、图表统计等
3. **优化性能**: 添加请求缓存、防抖等
4. **错误处理**: 完善错误提示和重试机制
