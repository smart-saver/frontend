import axios from "axios"

const baseURL = process.env.BASE_URL_API

const Instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true
})

export default Instance;