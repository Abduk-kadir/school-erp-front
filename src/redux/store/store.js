import { configureStore } from "@reduxjs/toolkit";
import personalInfoFormReducer from "../slices/dynamicForm/personalInfoFormSlice";
import stage1Reducer from "../slices/stage1Sclice";
import registrationNoReducer from "../slices/registrationNo";
import staffIdReducer from "../slices/dynamicForm/editByStaffSlice";

const store=configureStore({
    reducer:{ 
        personalInfoForms:personalInfoFormReducer,
        stage1:stage1Reducer,
        registrationNo:registrationNoReducer,
        staff:staffIdReducer
    }
})
export default store