import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  reg_no: null,
  getRegNo:null
};

export const setRegistrationNo = createAsyncThunk("/registration/reg_no",async ({reg_no}, { rejectWithValue, getState, dispatch }) => {
      console.log('calling set registration no with reg no:',reg_no)
      return reg_no 
  }
);

export const getRegistrationNo = createAsyncThunk("get/registration/reg_no",async ({}, { rejectWithValue, getState, dispatch }) => {
      const state = getState();
      console.log('calling get registration no with reg no:',state.registrationNo.reg_no)
      return state.registrationNo.reg_no 
  }
);

const registrationNoSlice = createSlice({
  name: "registrationNo",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(setRegistrationNo.fulfilled, (state, action) => {
      state.reg_no = action.payload;
    });
    builder.addCase(getRegistrationNo.fulfilled, (state, action) => {
      state.getRegNo = action.payload;
    });
  },
});

const registrationNoReducer = registrationNoSlice.reducer;
export default registrationNoReducer;
