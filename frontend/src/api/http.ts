import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 项目相关API
export const getProjects = (params?: { page?: number; pageSize?: number }) => {
  return http.get('/projects', { params })
}

export const getProject = (id: string) => {
  return http.get(`/projects/${id}`)
}

export const createProject = (data: any) => {
  return http.post('/projects', data)
}

export const updateProject = (id: string, data: any) => {
  return http.put(`/projects/${id}`, data)
}

export const deleteProject = (id: string) => {
  return http.delete(`/projects/${id}`)
}

export default http