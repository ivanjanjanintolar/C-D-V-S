import client from 'axios'

// https://localhost:5000/
export const baseURL = 'http://localhost:4000/'

//'https://demo.cotrugli.tech/api-v3/'

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
