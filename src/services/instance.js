import axios from "axios"

const BASE_URL = process.env.BASE_URL_API

 const Instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export default Instance;