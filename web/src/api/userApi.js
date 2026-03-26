import axiosClient from './axiosClient'

export async function getUsers({ page = 0, size = 10, filter = '', search = '' }) {
  const params = { page, size }

  if (filter) params.filter = filter
  if (search) params.search = search

  const response = await axiosClient.get('/api/users', { params })
  return response.data
}