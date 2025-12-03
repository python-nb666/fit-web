/**
 * API 适配器
 * 根据环境变量决定使用真实 API 还是 Mock API
 */

import * as realApi from './index';
import { mockApi } from './mock';
import type { WorkoutRecord, WorkoutCategory } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

console.log('API Mode:', USE_MOCK ? 'MOCK' : 'REAL');

// ============ 训练记录相关 API ============

export async function getRecords(params?: {
  category?: WorkoutCategory;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  if (USE_MOCK) {
    return mockApi.getRecords(params);
  }
  return realApi.getRecords(params);
}

export async function getRecordDetail(id: string) {
  if (USE_MOCK) {
    return mockApi.getRecordDetail(id);
  }
  return realApi.getRecordDetail(id);
}

export async function createRecord(data: Omit<WorkoutRecord, 'id'>) {
  if (USE_MOCK) {
    return mockApi.createRecord(data);
  }
  return realApi.createRecord(data);
}

export async function updateRecord(id: string, data: Partial<WorkoutRecord>) {
  if (USE_MOCK) {
    return mockApi.updateRecord(id, data);
  }
  return realApi.updateRecord(id, data);
}

export async function deleteRecord(id: string) {
  if (USE_MOCK) {
    return mockApi.deleteRecord(id);
  }
  return realApi.deleteRecord(id);
}

// ============ 统计相关 API ============

export async function getStats() {
  if (USE_MOCK) {
    return mockApi.getStats();
  }
  return realApi.getStats();
}

export async function getCategoryStats(category: WorkoutCategory) {
  if (USE_MOCK) {
    return mockApi.getCategoryStats(category);
  }
  return realApi.getCategoryStats(category);
}

export async function getLastWorkout(category: WorkoutCategory) {
  if (USE_MOCK) {
    return mockApi.getLastWorkout(category);
  }
  return realApi.getLastWorkout(category);
}

// ============ 用户相关 API ============

export async function getUserProfile() {
  if (USE_MOCK) {
    return mockApi.getUserProfile();
  }
  return realApi.getUserProfile();
}

export async function updateUserProfile(data: { name?: string; email?: string; avatar?: string }) {
  if (USE_MOCK) {
    return mockApi.updateUserProfile(data);
  }
  return realApi.updateUserProfile(data);
}
