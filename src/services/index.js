import Instance from "./instance";

export const getTransactionsAPI = () => 
    Instance.get('/transactions/')

export const loginAPI = (data) => 
    Instance.post('/auth/login/', data)

export const signupAPI = (data) => 
    Instance.post('/auth/signup/', data)

export const getUserInfoAPI = () => 
    Instance.get('/auth/login/')

