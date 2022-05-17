import client from 'axios'

export const baseURL = 'https://demo.cotrugli.tech/api/'

export const axios = client.create({
  baseURL,
  headers: { Authorization: `Bearer ${localStorage.getItem('token-cotrugli')}` },
})

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    if (response.status === 401) {
      // Token expired or invalid, this is okay for one role, for multi role revision this.
      localStorage.removeItem('token-cotrugli')

      document.location.href = ''
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)
