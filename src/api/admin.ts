
import axios from 'axios';

// 创建一个axios实例
const api = axios.create({
  baseURL: 'http://localhost:443', // 例如: 'https://api.example.com'
  timeout: 1000, // 请求超时时间
});

// post
export async function postRequest(url: string, params?: any, headers?: any) {
  try {
    const response = await api.post(url, { 
      params: params, // 传递params作为查询参数
      headers: headers, // 传递headers作为请求头部
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 抛出错误
  }
}


// GET请求函数
export async function getRequest(url: string, params?: any, headers?: any) {
  try {
    const response = await api.get(url, { 
      params: params, // 传递params作为查询参数
      headers: headers, // 传递headers作为请求头部
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 抛出错误
  }
}

// DELETE请求函数
export async function deleteRequest(url: string, params?: any, headers?: any) {
  try {
    const response = await api.delete(url, { 
      params: params, // 传递params作为查询参数
      headers: headers, // 传递headers作为请求头部
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 抛出错误
  }
}

// PUT请求函数
export async function putRequest(url: string, data?: any, params?: any, headers?: any) {
  try {
    const response = await api.put(url, data, {
      params: params, // 传递params作为查询参数
      headers: headers, // 传递headers作为请求头部
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 抛出错误
  }
}