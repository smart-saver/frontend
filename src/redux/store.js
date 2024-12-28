
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'

export const store = configureStore({
    reducer: {
        userReducer,
    }
})

export default store;