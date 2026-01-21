import { configureStore } from "@reduxjs/toolkit";
import personalInfoFormReducer from "../slices/dynamicForm/personalInfoFormSlice";
import stage1Reducer from "../slices/stage1Sclice";

const store=configureStore({
    reducer:{
        
        personalInfoForms:personalInfoFormReducer,
        stage1:stage1Reducer
    }
})
export default store