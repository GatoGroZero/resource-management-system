import axiosClient from './axiosClient'

export async function updateProfile(userId, data) {
  const response = await axiosClient.put(`/api/users/profile/${userId}`, data)
  return response.data
}