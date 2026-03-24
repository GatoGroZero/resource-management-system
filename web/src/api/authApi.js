import axiosClient from './axiosClient'

export const loginRequest = async (data) => {
  const response = await axiosClient.post('/api/auth/login', data)
  return response.data
}

export const forgotPasswordRequest = async (data) => {
  const response = await axiosClient.post('/api/auth/forgot-password', data)
  return response.data
}

export const verifyOtpRequest = async (data) => {
  const response = await axiosClient.post('/api/auth/verify-otp', data)
  return response.data
}

export const resetPasswordRequest = async (data) => {
  const response = await axiosClient.post('/api/auth/reset-password', data)
  return response.data
}