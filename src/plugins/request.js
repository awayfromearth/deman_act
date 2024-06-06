import axios from 'axios'

const request = axios.create({
  baseURL: 'https://ygk.nbdeman.com:11112/api',
  timeout: 180000,
  withCredentials: false
})

export default request