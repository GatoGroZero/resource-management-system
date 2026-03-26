import axiosClient from './axiosClient'

export async function getSpaces({ page = 0, size = 10, filter = '', search = '' }) {
  const params = { page, size }

  if (filter) params.filter = filter
  if (search) params.search = search

  const response = await axiosClient.get('/api/spaces', { params })
  return response.data
}

export async function getSpaceById(id) {
  const response = await axiosClient.get(`/api/spaces/${id}`)
  return response.data
}

export async function createSpace(data) {
  const response = await axiosClient.post('/api/spaces', data)
  return response.data
}

export async function updateSpace(id, data) {
  const response = await axiosClient.put(`/api/spaces/${id}`, data)
  return response.data
}

export async function toggleSpaceStatus(id) {
  const response = await axiosClient.patch(`/api/spaces/${id}/toggle-status`)
  return response.data
}