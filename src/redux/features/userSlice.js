
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: undefined,
    token: undefined,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initializeUser(state, action) {
            state.user = action.payload.user
            state.token = action.payload.token
        }
    }
})

export const {initializeUser} = userSlice.actions;
export default userSlice.reducer