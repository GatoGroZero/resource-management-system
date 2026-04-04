import axiosClient from './axiosClient'

export async function getReservations({ page = 0, size = 10, filter = '' }) {
  const params = { page, size }
  if (filter) params.filter = filter
  const response = await axiosClient.get('/api/reservations', { params })
  return response.data
}

export async function getReservationById(id) {
  const response = await axiosClient.get(`/api/reservations/${id}`)
  return response.data
}

export async function getReservationOptions() {
  const response = await axiosClient.get('/api/reservations/options')
  return response.data
}

export async function getReservationsBySpace(spaceId) {
  const response = await axiosClient.get(`/api/reservations/by-space/${spaceId}`)
  return response.data
}

export async function getReservationsByEquipment(equipmentId) {
  const response = await axiosClient.get(`/api/reservations/by-equipment/${equipmentId}`)
  return response.data
}

export async function createReservation(data) {
  const response = await axiosClient.post('/api/reservations', data)
  return response.data
}

export async function approveReservation(id, adminComment = '') {
  const response = await axiosClient.patch(`/api/reservations/${id}/approve`, { adminComment })
  return response.data
}

export async function rejectReservation(id, adminComment = '') {
  const response = await axiosClient.patch(`/api/reservations/${id}/reject`, { adminComment })
  return response.data
}

export async function cancelReservation(id) {
  const response = await axiosClient.patch(`/api/reservations/${id}/cancel`)
  return response.data
}

// --- Solicitante ---

export async function getMyReservations({ userId, page = 0, size = 10, filter = '' }) {
  const params = { userId, page, size }
  if (filter) params.filter = filter
  const response = await axiosClient.get('/api/reservations/my', { params })
  return response.data
}

export async function getMyReservationById(id, userId) {
  const response = await axiosClient.get(`/api/reservations/my/${id}`, { params: { userId } })
  return response.data
}

export async function updateMyReservation(id, userId, data) {
  const response = await axiosClient.put(`/api/reservations/my/${id}?userId=${userId}`, data)
  return response.data
}

export async function cancelMyReservation(id, userId) {
  const response = await axiosClient.patch(`/api/reservations/my/${id}/cancel?userId=${userId}`)
  return response.data
}

export async function returnReservation(id, data) {
  const response = await axiosClient.patch(`/api/reservations/${id}/return`, data)
  return response.data
}