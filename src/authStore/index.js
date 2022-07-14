import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import update from './update'
import Courses from './Courses'

export const store = configureStore({
  reducer: {
      auth,
      update,
      Courses
  },
})

