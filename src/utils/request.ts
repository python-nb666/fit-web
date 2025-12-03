import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应
    const { data } = response;

    // 如果后端返回的数据结构是 { code, data, message }
    if (data.code !== undefined) {
      if (data.code === 200 || data.code === 0) {
        return data.data;
      } else {
        // 处理业务错误
        console.error('API Error:', data.message);
        return Promise.reject(new Error(data.message || 'Request failed'));
      }
    }

    return data;
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.error('Unauthorized');
          // 可以在这里处理登出逻辑
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 500:
          console.error('Internal Server Error');
          break;
        default:
          console.error(`Error: ${status}`);
      }
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export function requestGet<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
  cancelToken?: CancelTokenSource
): Promise<T> {
  return instance.get(url, {
    params,
    ...config,
    cancelToken: cancelToken?.token,
  });
}

export function requestPost<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return instance.post(url, data, config);
}

export function requestPut<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return instance.put(url, data, config);
}

export function requestDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.delete(url, config);
}

export function requestPatch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return instance.patch(url, data, config);
}

// 创建取消令牌
export function createCancelToken(): CancelTokenSource {
  return axios.CancelToken.source();
}

// 导出 axios 实例，用于特殊情况
export const trHttp = instance;

export default instance;
