import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchProperties = async () => {
  const { data } = await api.get('/properties')
  return data
}

export default {
  fetchProperties,
}
