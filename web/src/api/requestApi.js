import axiosClient from './axiosClient'

export async function getAllRequests() {
  const response = await axiosClient.get('/api/requests')
  return response.data
}

export async function createRequest(data) {
  const response = await axiosClient.post('/api/requests', data)
  return response.data
}

export async function approveRequest(id, data) {
  const response = await axiosClient.patch(`/api/requests/${id}/approve`, data)
  return response.data
}

export async function rejectRequest(id, data) {
  const response = await axiosClient.patch(`/api/requests/${id}/reject`, data)
  return response.data
}