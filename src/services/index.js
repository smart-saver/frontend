import Instance from "./instance";

export const getTransactionsAPI = (data) => 
    Instance.get('/transactions/?' + Object.keys(data).map(key => `${key}=${data[key]}`).join('&'))

export const exportTransactionsAPI = () => 
    Instance.get('/transactions/import-export/')

export const importTransactionsAPI = () => 
    Instance.post('/transactions/import-export/')

export const getCategoriesAPI = () => 
    Instance.get('/categories/')

export const createCategoryAPI = (data) =>
    Instance.post('/categories/', data)

export const createTransactionAPI = (data) => 
    Instance.post('/transactions/', data)

export const loginAPI = (data) => 
    Instance.post('/auth/login/', data)

export const signupAPI = (data) => 
    Instance.post('/auth/signup/', data)

export const getUserInfoAPI = () => 
    Instance.get('/auth/login/')

