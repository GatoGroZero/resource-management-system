import axiosClient from './axiosClient'

export async function getUsers({ page = 0, size = 10, filter = '', search = '' }) {
  const params = { page, size }

  if (filter) params.filter = filter
  if (search) params.search = search

  const response = await axiosClient.get('/api/users', { params })
  return response.data
}

export async function getUserById(id) {
  const response = await axiosClient.get(`/api/users/${id}`)
  return response.data
}

export async function createUser(data) {
  const response = await axiosClient.post('/api/users', data)
  return response.data
}

export async function updateUser(id, data) {
  const response = await axiosClient.put(`/api/users/${id}`, data)
  return response.data
}

export async function toggleUserStatus(id) {
  const response = await axiosClient.patch(`/api/users/${id}/toggle-status`)
  return response.data
}