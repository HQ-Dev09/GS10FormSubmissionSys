import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _id: "",
}



export const update = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateFunction: (state, action) => {
            const update = action.payload

            if (update) {
                state._id = update
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateFunction } = update.actions

export default update.reducer