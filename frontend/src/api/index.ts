import axios from 'axios'

export const AXIOS_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
})
