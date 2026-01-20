import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
const initialState = {
  loading: false,
  error: null,
  personalInfoForm: null,
};

export const getPersonalInformationForm = createAsyncThunk("/stage/personal_information",async ({}, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log('personal information is callled')
      const { data } = await axios.get(
        `${baseURL}/api/form-structure`,
      );
      console.log('field is',data)
      return data;
      
    } catch (err) {
      console.log("error is:", err.response.data);
      return rejectWithValue(err?.response?.data);
    }
  }
);


const personalInfoFormSlice = createSlice({
  name: "serviceMaster",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getPersonalInformationForm.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPersonalInformationForm.fulfilled, (state, action) => {
      state.personalInfoForm = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getPersonalInformationForm.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

   

    
  },
});
//generate reducer
const personalInfoFormReducer = personalInfoFormSlice.reducer;
export default personalInfoFormReducer;
