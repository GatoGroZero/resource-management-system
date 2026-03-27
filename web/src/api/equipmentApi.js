import axiosClient from './axiosClient'

export async function getEquipments({ page = 0, size = 10, filter = '', search = '' }) {
  const params = { page, size }

  if (filter) params.filter = filter
  if (search) params.search = search

  const response = await axiosClient.get('/api/equipments', { params })
  return response.data
}

export async function getEquipmentById(id) {
  const response = await axiosClient.get(`/api/equipments/${id}`)
  return response.data
}

export async function createEquipment(data) {
  const response = await axiosClient.post('/api/equipments', data)
  return response.data
}

export async function updateEquipment(id, data) {
  const response = await axiosClient.put(`/api/equipments/${id}`, data)
  return response.data
}

export async function toggleEquipmentStatus(id) {
  const response = await axiosClient.patch(`/api/equipments/${id}/toggle-status`)
  return response.data
}