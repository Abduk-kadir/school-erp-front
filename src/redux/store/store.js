import { configureStore } from "@reduxjs/toolkit";

import personalInfoFormReducer from "../slices/dynamicForm/personalInfoFormSlice";

const store=configureStore({
    reducer:{
        
        personalInfoForms:personalInfoFormReducer,
    }
})
export default store