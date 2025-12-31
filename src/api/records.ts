import api from "./axios";
import type { WorkoutRecord } from "../types/workout";

export interface CreateRecordDto {
  userId: number;
  exerciseId: number;
  reps: number;
  weight: number;
  weightUnit: string;
  sets: number;
  date: string;
  time: string;
}

export const createRecord = (data: CreateRecordDto) => {
  return api.post<any, WorkoutRecord>("/records", data);
};

export const getRecords = (userId: number = 1) => {
  return api.get<any, any[]>("/records", { params: { userId } });
};

export const updateRecord = (id: string, data: Partial<CreateRecordDto>) => {
  return api.put<any, any>(`/records/${id}`, data);
};

export const deleteRecord = (id: string) => {
  return api.delete<any, any>(`/records/${id}`);
};
