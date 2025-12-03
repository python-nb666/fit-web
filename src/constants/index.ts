import React from 'react';
import { Icons } from '../components/Icons';
import type { WorkoutCategory } from '../types';

export const categories: {
  id: WorkoutCategory;
  label: string;
  icon: React.FC<any>;
  color: string;
}[] = [
  { id: 'chest', label: '胸部', icon: Icons.Chest, color: 'text-rose-400' },
  { id: 'back', label: '背部', icon: Icons.Back, color: 'text-sky-400' },
  { id: 'shoulders', label: '肩部', icon: Icons.Shoulders, color: 'text-amber-400' },
  { id: 'legs', label: '腿部', icon: Icons.Legs, color: 'text-emerald-400' },
  { id: 'arms', label: '手臂', icon: Icons.Arms, color: 'text-violet-400' },
  { id: 'core', label: '核心', icon: Icons.Core, color: 'text-indigo-400' },
];

export const DEFAULT_EXERCISES: Record<WorkoutCategory, string[]> = {
  chest: ['杠铃卧推', '哑铃卧推', '上斜卧推', '双杠臂屈伸', '绳索夹胸'],
  back: ['引体向上', '杠铃划船', '高位下拉', '坐姿划船', '直臂下压'],
  shoulders: ['坐姿推举', '哑铃侧平举', '面拉', '前平举', '反向飞鸟'],
  legs: ['深蹲', '硬拉', '腿举', '哈克深蹲', '腿屈伸'],
  arms: ['杠铃弯举', '哑铃弯举', '绳索下压', '仰卧臂屈伸'],
  core: ['卷腹', '平板支撑', '悬垂举腿', '俄罗斯转体'],
};
