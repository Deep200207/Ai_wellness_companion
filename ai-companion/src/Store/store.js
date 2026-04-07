import { configureStore } from '@reduxjs/toolkit'
import userReducer from './Reducer/authSlice.js'
import profileReducer from './Reducer/profileSlice.js'
import statisticReducer from './Reducer/statisticSlice.js'
const store=configureStore({
    reducer:{
        user:userReducer,
        profile:profileReducer,
        statistic:statisticReducer
    }
});
export default store;