import { configureStore } from "@reduxjs/toolkit";
import personalInfoFormReducer from "../slices/dynamicForm/personalInfoFormSlice";
import stage1Reducer from "../slices/stage1Sclice";
import registrationNoReducer from "../slices/registrationNo";
import staffIdReducer from "../slices/dynamicForm/editByStaffSlice";
import genericEditReducer from "../slices/genericEdit";

const store=configureStore({
    reducer:{ 
        personalInfoForms:personalInfoFormReducer,
        stage1:stage1Reducer,
        registrationNo:registrationNoReducer,
        staff:staffIdReducer,
        genericEdit:genericEditReducer
    }
})
export default store