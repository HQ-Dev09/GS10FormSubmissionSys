import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isRole: "",
    _id: "",
    username: "",
    email: "",
    status:"",
    Profile:"",
    Type:""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        validateUser: (state, action) => {
            const user = action.payload
            if (user) {
                state._id = user._id
                state.isRole = user.isRole
                state.username = user.username
                state.email = user.email
                state.status=user.status
                state.Profile=user.UserImage
                state.Type=user.Type
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { validateUser } = authSlice.actions

export default authSlice.reducer