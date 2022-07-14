import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Pageno:0,
    TotalPages:0,
    TotalCourse:0,
    NxtPage:0,
    Increment:5,
    PaginationCourses:[]
}



export const updateCourse = createSlice({
    name: 'Courses',
    initialState,
    reducers: {
        updateCourses: (state, action) => {
            const updateCourseRec = action.payload
            if (updateCourseRec) {
                state.Pageno = updateCourseRec.Pageno;
                state.TotalPages = updateCourseRec.TotalPages;
                state.PaginationCourses = updateCourseRec.PaginationCourses;
                state.TotalCourse = updateCourseRec.TotalCourse;
                state.NxtPage = updateCourseRec.NxtPage;
                state.Increment = updateCourseRec.Increment;
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateCourses } = updateCourse.actions

export default updateCourse.reducer