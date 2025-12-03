import { requestGet, requestPost, requestPut, requestDelete } from '../utils/request';
import type { WorkoutRecord, WorkoutCategory } from '../types';

const serviceName = import.meta.env.VITE_SERVICE_NAME || 'fit-tracker';

// API URL 定义
const apiUrl = {
  // 训练记录相关
  records: `/${serviceName}/records`, // 获取训练记录列表
  recordDetail: `/${serviceName}/records`, // 获取单条记录详情 /{id}
  createRecord: `/${serviceName}/records`, // 创建训练记录
  updateRecord: `/${serviceName}/records`, // 更新训练记录 /{id}
  deleteRecord: `/${serviceName}/records`, // 删除训练记录 /{id}

  // 统计相关
  stats: `/${serviceName}/stats`, // 获取统计数据
  categoryStats: `/${serviceName}/stats/category`, // 获取分类统计 /{category}
  lastWorkout: `/${serviceName}/stats/last-workout`, // 获取上次训练信息 /{category}

  // 用户相关
  userProfile: `/${serviceName}/user/profile`, // 获取用户信息
  updateProfile: `/${serviceName}/user/profile`, // 更新用户信息
};

// ============ 训练记录相关 API ============

/**
 * 获取训练记录列表
 * @param params 查询参数
 */
export function getRecords(params?: {
  category?: WorkoutCategory;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  return requestGet<{ list: WorkoutRecord[]; total: number }>(apiUrl.records, params);
}

/**
 * 获取单条记录详情
 * @param id 记录ID
 */
export function getRecordDetail(id: string) {
  return requestGet<WorkoutRecord>(`${apiUrl.recordDetail}/${id}`);
}

/**
 * 创建训练记录
 * @param data 记录数据
 */
export function createRecord(data: Omit<WorkoutRecord, 'id'>) {
  return requestPost<WorkoutRecord>(apiUrl.createRecord, data);
}

/**
 * 更新训练记录
 * @param id 记录ID
 * @param data 更新数据
 */
export function updateRecord(id: string, data: Partial<WorkoutRecord>) {
  return requestPut<WorkoutRecord>(`${apiUrl.updateRecord}/${id}`, data);
}

/**
 * 删除训练记录
 * @param id 记录ID
 */
export function deleteRecord(id: string) {
  return requestDelete(`${apiUrl.deleteRecord}/${id}`);
}

// ============ 统计相关 API ============

/**
 * 获取整体统计数据
 */
export function getStats() {
  return requestGet<{
    totalWorkouts: number;
    totalVolume: number;
    currentStreak: number;
    longestStreak: number;
  }>(apiUrl.stats);
}

/**
 * 获取分类统计
 * @param category 训练分类
 */
export function getCategoryStats(category: WorkoutCategory) {
  return requestGet<{
    totalWorkouts: number;
    totalVolume: number;
    averageWeight: number;
    maxWeight: number;
  }>(`${apiUrl.categoryStats}/${category}`);
}

/**
 * 获取上次训练信息
 * @param category 训练分类
 */
export function getLastWorkout(category: WorkoutCategory) {
  return requestGet<{
    lastDate: string | null;
    daysSince: number | null;
  }>(`${apiUrl.lastWorkout}/${category}`);
}

// ============ 用户相关 API ============

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return requestGet<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>(apiUrl.userProfile);
}

/**
 * 更新用户信息
 * @param data 用户数据
 */
export function updateUserProfile(data: { name?: string; email?: string; avatar?: string }) {
  return requestPut(apiUrl.updateProfile, data);
}
