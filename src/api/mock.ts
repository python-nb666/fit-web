import type { WorkoutRecord, WorkoutCategory } from '../types';

// Mock 数据延迟
const MOCK_DELAY = 500;

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock 数据存储（模拟数据库）
let mockRecords: WorkoutRecord[] = [];
let mockIdCounter = 1;

// 初始化一些 Mock 数据
const initMockData = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  mockRecords = [
    {
      id: String(mockIdCounter++),
      category: 'chest',
      exercise: '杠铃卧推',
      sets: 4,
      reps: 10,
      weight: 80,
      date: today.toISOString().split('T')[0],
    },
    {
      id: String(mockIdCounter++),
      category: 'chest',
      exercise: '哑铃卧推',
      sets: 3,
      reps: 12,
      weight: 30,
      date: today.toISOString().split('T')[0],
    },
    {
      id: String(mockIdCounter++),
      category: 'back',
      exercise: '引体向上',
      sets: 4,
      reps: 8,
      weight: 0,
      date: yesterday.toISOString().split('T')[0],
    },
  ];
};

// 初始化
initMockData();

// ============ Mock API 实现 ============

export const mockApi = {
  /**
   * 获取训练记录列表
   */
  async getRecords(params?: {
    category?: WorkoutCategory;
    startDate?: string;
    endDate?: string;
    pageNumber?: number;
    pageSize?: number;
  }) {
    await delay(MOCK_DELAY);

    let filtered = [...mockRecords];

    // 过滤分类
    if (params?.category) {
      filtered = filtered.filter((r) => r.category === params.category);
    }

    // 过滤日期范围
    if (params?.startDate) {
      filtered = filtered.filter((r) => r.date >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter((r) => r.date <= params.endDate!);
    }

    // 分页
    const pageNumber = params?.pageNumber || 1;
    const pageSize = params?.pageSize || 20;
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return {
      list: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  /**
   * 获取单条记录详情
   */
  async getRecordDetail(id: string) {
    await delay(MOCK_DELAY);

    const record = mockRecords.find((r) => r.id === id);
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  },

  /**
   * 创建训练记录
   */
  async createRecord(data: Omit<WorkoutRecord, 'id'>) {
    await delay(MOCK_DELAY);

    const newRecord: WorkoutRecord = {
      ...data,
      id: String(mockIdCounter++),
    };

    mockRecords.unshift(newRecord);
    return newRecord;
  },

  /**
   * 更新训练记录
   */
  async updateRecord(id: string, data: Partial<WorkoutRecord>) {
    await delay(MOCK_DELAY);

    const index = mockRecords.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Record not found');
    }

    mockRecords[index] = {
      ...mockRecords[index],
      ...data,
    };

    return mockRecords[index];
  },

  /**
   * 删除训练记录
   */
  async deleteRecord(id: string) {
    await delay(MOCK_DELAY);

    const index = mockRecords.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Record not found');
    }

    mockRecords.splice(index, 1);
    return { success: true };
  },

  /**
   * 获取整体统计数据
   */
  async getStats() {
    await delay(MOCK_DELAY);

    const totalWorkouts = mockRecords.length;
    const totalVolume = mockRecords.reduce((sum, r) => sum + r.sets * r.reps * r.weight, 0);

    // 计算连续训练天数（简化版）
    const dates = [...new Set(mockRecords.map((r) => r.date))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    const today = new Date().toISOString().split('T')[0];
    for (let i = dates.length - 1; i >= 0; i--) {
      if (i === dates.length - 1 && dates[i] === today) {
        streak = 1;
        currentStreak = 1;
      } else if (i < dates.length - 1) {
        const diff = Math.abs(new Date(dates[i + 1]).getTime() - new Date(dates[i]).getTime());
        const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          streak++;
          if (i === dates.length - 1) currentStreak = streak;
        } else {
          longestStreak = Math.max(longestStreak, streak);
          streak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, streak);

    return {
      totalWorkouts,
      totalVolume,
      currentStreak,
      longestStreak,
    };
  },

  /**
   * 获取分类统计
   */
  async getCategoryStats(category: WorkoutCategory) {
    await delay(MOCK_DELAY);

    const categoryRecords = mockRecords.filter((r) => r.category === category);

    if (categoryRecords.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        averageWeight: 0,
        maxWeight: 0,
      };
    }

    const totalWorkouts = categoryRecords.length;
    const totalVolume = categoryRecords.reduce((sum, r) => sum + r.sets * r.reps * r.weight, 0);
    const averageWeight = categoryRecords.reduce((sum, r) => sum + r.weight, 0) / totalWorkouts;
    const maxWeight = Math.max(...categoryRecords.map((r) => r.weight));

    return {
      totalWorkouts,
      totalVolume,
      averageWeight,
      maxWeight,
    };
  },

  /**
   * 获取上次训练信息
   */
  async getLastWorkout(category: WorkoutCategory) {
    await delay(MOCK_DELAY);

    const today = new Date().toISOString().split('T')[0];
    const categoryRecords = mockRecords
      .filter((r) => r.category === category && r.date < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (categoryRecords.length === 0) {
      return {
        lastDate: null,
        daysSince: null,
      };
    }

    const lastDate = categoryRecords[0].date;
    const diffTime = Math.abs(new Date(today).getTime() - new Date(lastDate).getTime());
    const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      lastDate,
      daysSince,
    };
  },

  /**
   * 获取用户信息
   */
  async getUserProfile() {
    await delay(MOCK_DELAY);

    return {
      id: '1',
      name: 'Fitness User',
      email: 'user@fitness.com',
      avatar: '',
    };
  },

  /**
   * 更新用户信息
   */
  async updateUserProfile(data: any) {
    await delay(MOCK_DELAY);

    return {
      id: '1',
      ...data,
    };
  },
};
