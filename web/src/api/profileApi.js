import axiosClient from './axiosClient'

export async function updateProfile(userId, data) {
  const response = await axiosClient.put(`/api/users/profile/${userId}`, data)
  return response.data
}

export async function changePassword(userId, data) {
  const response = await axiosClient.put(`/api/users/profile/${userId}/change-password`, data)
  return response.data
}