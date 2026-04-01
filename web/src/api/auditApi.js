import axiosClient from './axiosClient'

export async function getAuditRecords({ page = 0, size = 10, filter = '' }) {
  const params = { page, size }
  if (filter) params.filter = filter

  const response = await axiosClient.get('/api/reservations/audit', { params })
  return response.data
}