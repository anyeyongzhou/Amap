import request from '@/utils/request'

// POST
export const loginAPI = (data) => {
  return request.post('/register', data)
}
